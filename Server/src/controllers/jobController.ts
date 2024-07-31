import { Request,Response } from "express";
import { jobService } from "../services/jobService";
import { createErrorResponse,createSuccessResponse } from "../helpers/responseHelper";

  

class JobController {
    async createJob(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const jobData = req.body.jobData;
            const result = await jobService.createJob(email, jobData);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getJobsForCandidate(req: Request, res: Response) {
        try {
            const candidateId = req.params.id;
            
            if (!candidateId) {
                return res.status(400).json(createErrorResponse('Candidate ID required'));
            }

            const jobs = await jobService.getJobsForCandidate(candidateId);
            
            res.status(200).json(createSuccessResponse(jobs));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getAllJobsOfRecruiter(req: Request, res: Response) {
        try {
            const user_id = req.params.id;
            
            if (!user_id) {
                return res.status(400).json(createErrorResponse('Invalid user ID'));
            }

            const jobs = await jobService.getAllJobsByRecruiterId(user_id);
            
            res.status(200).json(createSuccessResponse(jobs));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('Failed to fetch jobs'));
            }
        }
    }

    async getJobById(req: Request, res: Response) {
        try {
            const job_id = req.params.id;
            const job = await jobService.getJobById(job_id);
            
            if (!job) {
                return res.status(404).json(createErrorResponse('Job not found'));
            }

            res.status(200).json(createSuccessResponse(job));
        } catch (err) {
            console.error('Failed to fetch job data:', err); // Log the error for debugging
            res.status(400).json(createErrorResponse('Failed to fetch job data'));
        }
    }

    async updateJob(req: Request, res: Response) {
        try {
            const jobData = req.body;
            const job_id = jobData.job_id;
            
            const result = await jobService.updateJob(job_id, jobData);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }
}

export const jobController = new JobController();
  
