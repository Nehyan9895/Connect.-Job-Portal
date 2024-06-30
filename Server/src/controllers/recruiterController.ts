import { Response, Request } from "express";
import { recruiterService } from "../services/recruiterService";
import { createSuccessResponse, createErrorResponse } from "../helpers/responseHelper";

class RecruiterController {
    async recruiterLogin(req: Request, res: Response) {
        const { email, password } = req.body;
        
        try {
            const result = await recruiterService.recruiterLogin(email, password);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async createProfile(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const profileData = req.body.candidateData;
            const file = req.file;
    
            const result = await recruiterService.createProfile(email, profileData, file);
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

export const recruiterController = new RecruiterController();
