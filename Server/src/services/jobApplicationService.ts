import { jobApplicationRepository } from "../repositories/jobApplicationRepository";
import { candidateRepository } from "../repositories/candidateRepository";
import { jobRepository } from "../repositories/jobRepository";
import mongoose from "mongoose";
import { recruiterRepository } from "../repositories/recruiterRepository";

class JobApplicationService {
    async applyForJob(userId: string, jobId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const candidate = await candidateRepository.findCandidateByUserId(userId);
        if (!candidate) {
            throw new Error('Candidate not found');
        }
        const candidateId = candidate._id as mongoose.Types.ObjectId;

        const job = await jobRepository.findJobByJobId(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        const job_id = job._id as mongoose.Types.ObjectId;

        if (!mongoose.Types.ObjectId.isValid(job_id)) {
            throw new Error('Invalid job ID format');
        }

        const existingApplication = await jobApplicationRepository.findApplicationByCandidateAndJob(
            candidateId,
            job_id
        );

        if (existingApplication) {
            throw new Error('You have already applied for this job');
        }

        const applicationData = {
            candidate_id: candidateId,
            job_id: job_id,
            application_sent: true
        };

        const jobApplication = await jobApplicationRepository.createJobApplication(applicationData);
        return jobApplication;
    }

    async getJobApplications(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const candidate = await candidateRepository.findCandidateByUserId(userId);
        if (!candidate) {
            throw new Error('Candidate not found');
        }
        const candidateId = candidate._id as mongoose.Types.ObjectId;

        const applications = await jobApplicationRepository.findApplicationsByCandidate(candidateId);
        return applications;
    }

    async getApplicationsForJob(jobId: mongoose.Types.ObjectId) {
        const jobApplications = await jobApplicationRepository.findApplicationsByJobId(jobId);
        return jobApplications;
      }
    
      async getJobApplicationStatistics(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }
    
        const candidate = await candidateRepository.findCandidateByUserId(userId);
        if (!candidate) {
          throw new Error('Candidate not found');
        }
        const candidateId = candidate._id as mongoose.Types.ObjectId;
    
        const applications = await jobApplicationRepository.findApplicationsByCandidate(candidateId);
    
        const statistics = {
          jobsApplied: applications.length,
          reviewed: applications.filter(app => app.application_reviewed).length,
          resumeViewed: applications.filter(app => app.resume_viewed).length,
          accepted: applications.filter(app => app.result === 'Accepted').length,
          rejected: applications.filter(app => app.result === 'Rejected').length
        };
    
        return statistics;
      }
    
      async updateApplicationStatus(applicationId: string, updateData: any) {
        return await jobApplicationRepository.updateApplicationStatus(applicationId, updateData);
    }
    

}

export const jobApplicationService = new JobApplicationService();
