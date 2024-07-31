import { adminRepository } from "../repositories/adminRepository";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';

class AdminService{
    async adminLogin(email:string,password:string){
        const admin = await adminRepository.findAdminByEmail(email)

        if(!admin){
            throw new Error('admin not exists')
        }

        const isPasswordValid = await bcrypt.compare(password,admin.password)

        if(!isPasswordValid){
            throw new Error('Invalid email or password')
        }

        if(!admin.is_verified){
            throw new Error('admin is not verified')
        }

        if(!admin.isAdmin){
            throw new Error('This is not an admin')
        }
        const token = jwt.sign({email:admin.email,id:admin._id},JWT_SECRET,{expiresIn:'10h'});
        return {token,admin:{email:admin.email,id:admin._id,username:admin.username},message:'Admin login successfull'}
    }

    async getAllCandidatesWithUserInfo() {
        return await adminRepository.getAllCandidatesWithUserInfo();
    }

    async updateUserVerificationStatus(userId: string, is_verified: boolean) {
        const user = await adminRepository.updateUserVerificationStatus(userId, is_verified);
        if (!user) {
          throw new Error('User not found or update failed');
        }
        return user;
      }

      async updateRecruiterVerificationStatus(userId:string,is_verified:boolean){
        const user = await adminRepository.updateRecruiterVerificationStatus(userId, is_verified);
        if (!user) {
          throw new Error('User not found or update failed');
        }
        return user;
      }
    
      async getAllRecruitersWithUserInfo(){
        return await adminRepository.getAllRecruitersWithUserInfo();
      }

}

export const adminService = new AdminService();