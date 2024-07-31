import { userRepository } from "../repositories/userRepository";
import { candidateRepository } from "../repositories/candidateRepository";
import { otpService } from "../helpers/otpService";
import imageUpload from "../helpers/imageUpload";
import fileUpload from "../helpers/fileUpload";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { recruiterRepository } from "../repositories/recruiterRepository";

const OTP_EXPIRY_TIME = 60; // 1 minute in seconds
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';

class UserService {
    async signup(userData: any) {
        
        const existingUser = await userRepository.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('This user already exists');
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        // Save the user with is_verified set to false
        const user = await userRepository.createUser({ ...userData, is_verified: false });

        // Generate OTP and JWTs
        const otp = this.generateOtp();
        await otpService.sendOtp(user.email, otp);
        console.log(otp,'thisisthe otp');
        
        // Generate OTP token with short expiration time
        const otpToken = jwt.sign({ email: user.email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });

        // Generate email verification token with longer expiration time

        return { message: 'Otp sent to your email', otpToken };
    }

    generateOtp() {
        const randomNumber = crypto.randomInt(0, 1000000);
        return String(randomNumber).padStart(6, '0');
    }

    async verifyOtp(otpToken: string, otp: string) {
        try {
            // Verify and decode the OTP token
            const decoded: any = jwt.verify(otpToken, JWT_SECRET);
            const email = decoded.email;
            const storedOtp = decoded.otp;

            if (storedOtp !== otp) {
                throw new Error('Otp invalid');
            }

            // Mark user as verified
            await userRepository.updateUserVerificationStatus(email, true);

            return { message: 'User verified successfully' };

        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new Error('Otp expired');
            } else {
                throw err;
            }
        }
    }

    async resendOtp(email: string) {
        try {
            const user = await userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            if (user.is_verified) {
                throw new Error('User already verified');
            }

            // Generate and send new OTP
            const otp = this.generateOtp();
            await otpService.sendOtp(email, otp);

            // Generate new OTP token with short expiration time
            const newOtpToken = jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });

            return { message: 'Otp sent to your email', newOtpToken };

        } catch (err) {
            throw new Error('Unknown error occured');
        }
    }

    async userLogin(email:string,password:string){
        const user = await userRepository.findUserByEmail(email);
        
        
        if(!user||user.isEmployee){
            throw new Error('user not exists')
        }

     
        const isPasswordValid = await bcrypt.compare(password,user.password)
        
        if(!isPasswordValid){
            throw new Error('Invalid email or password')
        }
        if(!user.is_verified){
            throw new Error('User is not verified')
        }

        const token = jwt.sign({email:user.email,id:user._id},JWT_SECRET,{expiresIn:'10h'});
        return {token,user:{email:user.email,id:user._id,username:user.username,is_done:user.is_done,image:user.image},message:'Candidate login successful'}
    }

    
    async createProfile(email: string, profileData: any, imageFile?: Express.Multer.File, resumeFile?: Express.Multer.File): Promise<any> {
        const user = await userRepository.findUserByEmail(email);
        
        if (!user || user.isEmployee) {
            throw new Error('User not found');
        }
        
        const userId = user._id.toString();
        
        if (!profileData) {
            throw new Error('Profile data is missing');
        }
        
        const candidateData = {
            user_id: userId,
            fullName: profileData.fullName,
            phone: profileData.phone,
            dob: profileData.dob,
            image: '',
            resume: '',
            gender: profileData.gender,
            education: [{
                qualification: profileData.qualification,
                specialization: profileData.specialization,
                nameOfInstitution: profileData.institution,
                passoutYear: profileData.passoutYear,
                passoutMonth: profileData.passoutMonth
            }],
            experience: [{
                isFresher: profileData.isFresher,
                jobRole: profileData.jobRole,
                companyName: profileData.companyName,
                experienceDuration: profileData.experienceDuration
            }],
            skills: profileData.skills
        };
        
        const candidate = await candidateRepository.createCandidate(candidateData);
        
        if (imageFile && imageFile.path) {
            try {
                const imageUrl = await imageUpload.uploadImage(imageFile.path, userId);
                if (imageUrl) {
                    await candidateRepository.updateCandidateImage(userId, imageUrl);
                    candidate.image = imageUrl;
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error('Error uploading image: ' + error.message);
                } else {
                    throw new Error('An unknown error occurred while uploading the image');
                }
            }
        }
    
        if (resumeFile && resumeFile.path) {
            try {
                const resumeUrl = await fileUpload.uploadFile(resumeFile.path, userId);
                if (resumeUrl) {
                    await candidateRepository.updateCandidateResume(userId, resumeUrl);
                    candidate.resume = resumeUrl;
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error('Error uploading resume: ' + error.message);
                } else {
                    throw new Error('An unknown error occurred while uploading the resume');
                }
            }
        }
        await userRepository.updateUserIsDone(userId)
        return {message:'Profile Created successfully'};
    }
    
    
    
    



    async sendForgotOtp(email:string){
        
        const otp = this.generateOtp();
        await otpService.sendOtp(email, otp);

        const token = jwt.sign({ email: email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });

        return {message: 'Forgot Otp sent to your email', token}
    }

    async verifyForgetOtp(otp:string,otpToken:string){
        const decoded: any = jwt.verify(otpToken, JWT_SECRET);
            const storedOtp = decoded.otp;

            if (storedOtp !== otp) {
                throw new Error('Otp invalid');
            }

            return { message: 'Otp verified successfully' };
    }
    
    async changePassword(email: string, newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userRepository.updateUserPassword(email, hashedPassword);
        return {message:'Password changed successfully'}
    }

    async updateCandidateEducation(userId: string, educationData: any){
        const candidate = await candidateRepository.updateCandidateEducation(userId, educationData);
        return candidate;
      }

      async updateCandidateExperience(userId: string, experienceData: any): Promise<any> {
        const candidate = await candidateRepository.updateCandidateExperience(userId,experienceData)
        return candidate;
      }
      
      async updateCandidateSkills(userId: string, skills: any): Promise<any> {
        const candidate = await candidateRepository.updateCandidateSkills(userId,skills)
        return candidate;
      }

      async updateCandidateProfile(userId:string,candidateData:any){
          const candidate = await candidateRepository.updateCandidateProfile(userId,candidateData)
          return candidate
      }
    
      async getRecruiterById(id:string){
        const candidate = await recruiterRepository.findRecruiterByUserId2(id)
        return candidate
      }

}

export const userService = new UserService();
