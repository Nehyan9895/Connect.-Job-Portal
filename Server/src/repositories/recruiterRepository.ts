import { User } from "../models/userModel";
import { IRecruiter, Recruiter } from "../models/recruiterModel";
import { IInterview, Interview } from "../models/interviewModel";

class RecruiterRepository{
    async findRecruiterByUserId(user_id: string) {
        return await Recruiter.findOne({ user_id:user_id });
      }
    
      async findRecruiterIdByUserId(user_id: string): Promise<string | null> {
        const recruiter = await this.findRecruiterByUserId(user_id);
        return recruiter ? recruiter._id.toString() : null;
      }
      
      

    async findRecruiterByEmail(email:string){
        return await User.findOne({email:email,isEmployee:true})
    }

    async getCompanyLocationsByUserId(user_id: string): Promise<string[] | null> {
        const recruiter = await Recruiter.findOne({ user_id });
        return recruiter ? recruiter.companyLocations : null;
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

    async findRecruiterByUserId2(id:string){
        return await Recruiter.findOne({user_id:id})
    }

    async createInterview(interviewDetails: Partial<IInterview>): Promise<IInterview> {
        const newInterview = new Interview(interviewDetails);
        return await newInterview.save();
      }
    
      async getAllInterviews(): Promise<IInterview[]> {
        return Interview.find().populate('candidateId').populate('jobId').populate('jobApplicationId').exec();
      }
    
      async updateCompanyLocations(userId: string, companyLocations: any): Promise<any> {
        const recruiter = await this.findRecruiterByUserId(userId);
        if (!recruiter) {
          throw new Error("Candidate not found");
        }
        recruiter.companyLocations = companyLocations;
        await recruiter.save();
        return recruiter;
      }


      async updateRecruiterProfile(userId:string, recruiterData:any) {
      
        const updatedProfile = await Recruiter.findByIdAndUpdate(
          userId,
          {
            fullName: recruiterData.fullName,
            phone: recruiterData.phone,
            companyName: recruiterData.companyName,
          },
          { new: true }
        );
      
        return updatedProfile;
      }

      async   findInterviewByRoomId(roomId:string){
        return await Interview.findOne({ roomId });
      }
}

export const recruiterRepository = new RecruiterRepository();