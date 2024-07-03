import { Job } from "../models/jobModel";


class JobRepository{
    async createJob(jobData:any){
        const job = new Job(jobData)
        await job.save();
        return job;
    }

    async findJobByJobId(jobId:string){
        return await Job.findOne({job_id:jobId}).populate('recruiter_id')
    }

    async findAllJobs() {
        return await Job.find().populate('recruiter_id');
    }

    async findJobsByRecruiterId(recruiter_id:string|null){
        return await Job.find({ recruiter_id: recruiter_id }).populate('recruiter_id');
    } 

    async getJobById(job_id:string){
        return await Job.findOne({job_id:job_id})
    }
    
    async updateJob(job_id: string, jobData: any) {
        return await Job.findOneAndUpdate({ job_id: job_id }, jobData, { new: true });
      }
    
}

export const jobRepository = new JobRepository()