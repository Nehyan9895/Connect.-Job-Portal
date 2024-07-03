import { User } from "../models/userModel";
import { IRecruiter, Recruiter } from "../models/recruiterModel";

class RecruiterRepository{
    async findRecruiterByUserId(user_id: string) {
        return await Recruiter.findOne({ user_id });
      }
    
      async findRecruiterIdByUserId(user_id: string): Promise<string | null> {
        const recruiter = await this.findRecruiterByUserId(user_id);
        return recruiter ? recruiter._id.toString() : null;
      }
      
      

    async findRecruiterByEmail(email:string){
        return await User.findOne({email:email,isEmployee:true})
    }

    async createRecruiter(candidateData: any): Promise<any> {
        const recruiter = new Recruiter(candidateData);
        await recruiter.save();
        return recruiter;
    }

    async updateRecruiterImage(userId: string, imageUrl: string) {
        const recruiter = await this.findRecruiterByUserId(userId);
        if (recruiter) {
            recruiter.image = imageUrl;
            await recruiter.save();
        } else {
            throw new Error("recruiter not found");
        }
    }

}

export const recruiterRepository = new RecruiterRepository();