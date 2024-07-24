import imageUpload from "../helpers/imageUpload";
import { candidateRepository } from "../repositories/candidateRepository";
import { recruiterRepository } from "../repositories/recruiterRepository";
import { userRepository } from "../repositories/userRepository";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';

class RecruiterService{

    async recruiterLogin(email:string,password:string){
        const recruiter  = await recruiterRepository.findRecruiterByEmail(email);
        
        if(!recruiter){
            throw new Error('Recruiter not exists')
        }

        const isPasswordValid = await bcrypt.compare(password,recruiter.password)

        if(!isPasswordValid){
            throw new Error('Invalid email or password')
        }
        if(!recruiter.is_verified){
            throw new Error('Recruiter is not verified')
        }

        const token = jwt.sign({email:recruiter.email,id:recruiter._id},JWT_SECRET,{expiresIn:'10h'});
        return {token,recruiter:{email:recruiter.email,id:recruiter._id,username:recruiter.username,is_done:recruiter.is_done},message:'Recruiter login successful'}
    }

    async getCompanyLocations(userId: string): Promise<string[] | null> {
        return await recruiterRepository.getCompanyLocationsByUserId(userId);
    }


    async createProfile(email: string, profileData: any, file?: Express.Multer.File): Promise<any>{
        const user = await userRepository.findUserByEmail(email);
    
        if (!user) {
            throw new Error('User not found');
        }
        const userId = user._id.toString();
    
        if (!profileData) {
            throw new Error('Profile data is missing');
        }
        
        const recruiterData = { 
            user_id: userId,
            fullName: profileData.fullName,
            phone: profileData.phone,
            companyName:profileData.companyName
        };

        const recruiter = await recruiterRepository.createRecruiter(recruiterData)

        if (file && file.path) {
            try {
                const imageUrl = await imageUpload.uploadImage(file.path, userId);
                if(imageUrl){
                await recruiterRepository.updateRecruiterImage(userId, imageUrl);
                }else{
                    console.log('image url is not good');
                    
                }
                recruiter.image = imageUrl;
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error uploading image:', error.message);
                    throw new Error('Error uploading image: ' + error.message);
                } else {
                    console.error('Unknown error uploading image:', error);
                    throw new Error('Unknown error uploading image');
                }
            }
        }

        if(recruiter){
            await userRepository.updateUserIsDone(userId)
        }

        return {recruiter,message:'Profile added successfully'};
    }

    async getCandidateById(userId:string){
        const candidate = await candidateRepository.findCandidateByUserId(userId)
        return candidate
    }

    async getAllInterviews() {
        return recruiterRepository.getAllInterviews();
      }

      async getProfile(id:string){
        return await recruiterRepository.findRecruiterByUserId(id)
      }

      async updateCompanyLocations(userId: string, companyLocations: any): Promise<any> {
        const recruiter = await recruiterRepository.updateCompanyLocations(userId,companyLocations)
        return recruiter;
      }

      async updateRecruiterProfile(userId:string,recruiterData:any){
        const recruiter = await recruiterRepository.updateRecruiterProfile(userId,recruiterData)
        return recruiter
    }
}

export const recruiterService = new RecruiterService();