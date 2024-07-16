import { JobApplication } from "../models/jobApplication";
import mongoose from "mongoose";

class JobApplicationRepository {
    async createJobApplication(applicationData: object) {
        const jobApplication = new JobApplication(applicationData);
        await jobApplication.save();
        return jobApplication;
    }

    async findApplicationByCandidateAndJob(candidateId: mongoose.Types.ObjectId, jobId: mongoose.Types.ObjectId) {
        return await JobApplication.findOne({ candidate_id: candidateId, job_id: jobId });
    }

    async findApplicationsByCandidate(candidateId: mongoose.Types.ObjectId) {
        const result = await JobApplication.find({ candidate_id: candidateId }).populate('job_id');
        console.log(result);
        return result
    }

    async findApplicationsByJobIds(jobIds: mongoose.Types.ObjectId[]) {
        return await JobApplication.find({ job_id: { $in: jobIds } })
    }

    async findApplicationsByJobId(jobId: mongoose.Types.ObjectId) {
        return await JobApplication.find({ job_id: jobId }).populate('job_id').populate('candidate_id');
      }
    
      async updateApplicationStatus(applicationId: string, updateData: any) {
        return await JobApplication.findByIdAndUpdate(applicationId, updateData, { new: true });
    }
    

}

export const jobApplicationRepository = new JobApplicationRepository();
