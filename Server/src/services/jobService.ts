import mongoose from "mongoose";
import { ICandidate } from "../models/candidateModel";
import { IJob } from "../models/jobModel";
import { jobRepository } from "../repositories/jobRepository";
import { recruiterRepository } from "../repositories/recruiterRepository";
import { userRepository } from "../repositories/userRepository";
import { candidateRepository } from "../repositories/candidateRepository";
import { jobApplicationRepository } from "../repositories/jobApplicationRepository";


class JobService{
   
    async createJob(email:string,jobData:any){
        
        const user = await userRepository.findUserByEmail(email);
    
        if (!user) {
            throw new Error('User not found');
        }
        const userId = user._id.toString();

        const recruiter = await recruiterRepository.findRecruiterByUserId(userId)
        const recruiter_id = recruiter?._id

        let generateJID = Math.floor(1000 + Math.random() * 9000).toString();
        let existingOrder = await jobRepository.findJobByJobId(generateJID)

        while (existingOrder) {
            generateJID = Math.floor(1000 + Math.random() * 9000).toString();
            existingOrder = await jobRepository.findJobByJobId(generateJID)
        }
        const jobId = `JB${generateJID}`;


        const newJobData = {
            recruiter_id:recruiter_id,
            job_id:jobId,
            job_title:jobData.job_title,
            job_location:jobData.job_location,
            salary_range_min:jobData.salary_range_min,
            salary_range_max:jobData.salary_range_max,
            job_type:jobData.job_type,
            job_mode:jobData.job_mode,
            experience_required:jobData.experience_required,
            skills_required:jobData.skills,
            last_date:jobData.last_date,
            description:jobData.description,
            responsibilities:jobData.responsibilities,
            preference:jobData.preference
        }
        

        const job = await jobRepository.createJob(newJobData);

        return {job,message:'Job created successfully'}
    }



    calculateMatchScore(job: IJob, candidate: ICandidate): number {
        const jobSkills = new Set(job.skills_required);
        const candidateSkills = new Set(candidate.skills);
        const commonSkills = new Set([...jobSkills].filter(skill => candidateSkills.has(skill)));

        const totalSkills = jobSkills.size;
        const matchedSkills = commonSkills.size;

        return totalSkills ? (matchedSkills / totalSkills) * 100 : 0;
    }

    

    async getJobsForCandidate(candidateId: string) {
        if (!mongoose.Types.ObjectId.isValid(candidateId)) {
            throw new Error('Invalid candidate ID format');
        }
    
        const candidate = await candidateRepository.findCandidateByUserId(candidateId);
        if (!candidate) {
            throw new Error('Candidate not found');
        }
    
        const jobs = await jobRepository.findAllJobs();
        const jobIds: mongoose.Types.ObjectId[] = jobs.map(job => job._id as mongoose.Types.ObjectId);
    
        // Fetch applications for these jobs
        const applications = await jobApplicationRepository.findApplicationsByJobIds(jobIds);
        
        // Map jobs with application status
        const jobsWithMatchScore = jobs.map(job => {
            const matchScore = this.calculateMatchScore(job, candidate);
            const applied = applications.some(application =>
                application.job_id.toString() === (job._id as mongoose.Types.ObjectId).toString() &&
                application.candidate_id.toString() === (candidate._id as mongoose.Types.ObjectId).toString()
            );
            return { job, matchScore, applied };
        });
    
        return jobsWithMatchScore.sort((a, b) => b.matchScore - a.matchScore);
    }
    



    async getAllJobsByRecruiterId(user_id: string) {
        const recruiter = await recruiterRepository.findRecruiterByUserId(user_id);
        const recruiter_id = recruiter?._id.toString();

        if (!recruiter_id) {
            throw new Error('Recruiter not found');
          }

        return await jobRepository.findJobsByRecruiterId(recruiter_id);

    }

    async getJobById(job_id:string){
        return await jobRepository.findJobByJobId(job_id)
    }


    async updateJob(job_id: string, jobData: any) {
        const existingJob = await jobRepository.findJobByJobId(job_id);
    
        if (!existingJob) {
          throw new Error('Job not found');
        }
    
        const updatedJobData = {
          job_title: jobData.job_title,
          job_location: jobData.job_location,
          salary_range_min: jobData.salary_range_min,
          salary_range_max: jobData.salary_range_max,
          job_type: jobData.job_type,
          job_mode: jobData.job_mode,
          experience_required: jobData.experience_required,
          skills_required: jobData.skills,
          last_date: jobData.last_date,
          description: jobData.description,
          responsibilities: jobData.responsibilities,
          preference: jobData.preference
        };
    
        const updatedJob = await jobRepository.updateJob(job_id, updatedJobData);
        return { updatedJob, message: 'Job updated successfully' };
      }
    
    
}


export const jobService = new JobService();