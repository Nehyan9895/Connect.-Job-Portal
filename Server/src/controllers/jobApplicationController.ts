import { Request, Response } from "express";
import { jobApplicationService } from "../services/jobApplicationService";
import { createErrorResponse, createSuccessResponse } from "../helpers/responseHelper";
import mongoose from "mongoose";



class JobApplicationController {
    async applyForJob(req: Request, res: Response) {
        try {
            const { jobId, userId } = req.body;

            if (!userId) {
                return res.status(400).json(createErrorResponse('Candidate ID required'));
            } else if (!jobId) {
                return res.status(400).json(createErrorResponse('Job ID required'));
            }

            const application = await jobApplicationService.applyForJob(userId, jobId);
            res.status(200).json(createSuccessResponse({ message: 'Job application submitted successfully', application }));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getJobApplications(req: Request, res: Response) {
        try {
            const userId = req.params.id;

            if (!userId) {
                return res.status(400).json(createErrorResponse('User ID required'));
            }

            const applications = await jobApplicationService.getJobApplications(userId);
            res.status(200).json(createSuccessResponse(applications));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getJobApplicationByJob(req: Request, res: Response) {
        try {
            const jobId  = req.params.id;
            

            if (!jobId) {
                return res.status(400).json(createErrorResponse('job ID required'));
            }

            const applications = await jobApplicationService.getApplicationsForJob(new mongoose.Types.ObjectId(jobId));
            console.log(applications);
            
            res.status(200).json(createSuccessResponse(applications));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }
}

export const jobApplicationController = new JobApplicationController();
