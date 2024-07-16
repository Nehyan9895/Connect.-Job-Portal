import { Candidate } from "../models/candidateModel";

class CandidateRepository{
    async createCandidate(candidateData: any): Promise<any> {
        const candidate = new Candidate(candidateData);
        await candidate.save();
        return candidate;
    }

    async findCandidateByUserId(userId: string) {
        return await Candidate.findOne({ user_id: userId });
    }

    async updateCandidateImage(userId: string, imageUrl: string) {
        const candidate = await this.findCandidateByUserId(userId);
        if (candidate) {
            candidate.image = imageUrl;
            await candidate.save();
        } else {
            throw new Error("Candidate not found");
        }
    }

    async getCandidateById(userId:string){
        const candidate = await Candidate.findById(userId);
        return candidate
    }

    async updateCandidateResume(userId: string, resumeUrl: string) {
        const candidate = await this.findCandidateByUserId(userId);
        if (candidate) {
            candidate.resume = resumeUrl;
            await candidate.save();
        } else {
            throw new Error("Candidate not found");
        }
    }

    async updateCandidateEducation(userId: string, educationData: any): Promise<any> {
        const candidate = await this.findCandidateByUserId(userId);
        if (!candidate) {
          throw new Error("Candidate not found");
        }
        candidate.education = educationData;
        await candidate.save();
        return candidate;
      }

      async updateCandidateExperience(userId: string, experienceData: any): Promise<any> {
        const candidate = await this.findCandidateByUserId(userId);
        if (!candidate) {
          throw new Error("Candidate not found");
        }
        candidate.experience = experienceData;
        await candidate.save();
        return candidate;
      }

      async updateCandidateSkills(userId: string, skills: any): Promise<any> {
        const candidate = await this.findCandidateByUserId(userId);
        if (!candidate) {
          throw new Error("Candidate not found");
        }
        candidate.skills = skills;
        await candidate.save();
        return candidate;
      }

      async updateCandidateProfile(userId:string, candidateData:any) {
      
        const updatedProfile = await Candidate.findByIdAndUpdate(
          userId,
          {
            fullName: candidateData.fullName,
            phone: candidateData.phone,
            dob: candidateData.dob,
            gender: candidateData.gender
          },
          { new: true }
        );
      
        return updatedProfile;
      }
      
      
      
}

export const candidateRepository = new CandidateRepository();