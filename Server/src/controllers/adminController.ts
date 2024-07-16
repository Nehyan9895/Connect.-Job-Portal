import { Request, Response } from "express";
import { adminService } from "../services/adminService";
import { createSuccessResponse, createErrorResponse } from '../helpers/responseHelper';


class AdminController {
    async adminLogin(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const result = await adminService.adminLogin(email, password);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getAllCandidatesWithUserInfo(req: Request, res: Response) {
        try {
            const candidates = await adminService.getAllCandidatesWithUserInfo();
            res.status(200).json(createSuccessResponse(candidates));
        }catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateUserVerificationStatus(req: Request, res: Response) {
        
        
        const userId = req.params.id;
        console.log(userId);
        const { is_verified } = req.body;
        try {
            const updatedUser = await adminService.updateUserVerificationStatus(userId, is_verified);
            res.status(200).json(createSuccessResponse(updatedUser));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateRecruiterVerificationStatus(req:Request,res:Response){
        const userId = req.params.id;
        console.log(userId);
        const { is_verified } = req.body;
        try {
            const updatedUser = await adminService.updateRecruiterVerificationStatus(userId, is_verified);
            res.status(200).json(createSuccessResponse(updatedUser));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getAllRecruitersWithUserInfo(req: Request, res: Response) {
        try {
            const recruiters = await adminService.getAllRecruitersWithUserInfo();
            res.status(200).json(createSuccessResponse(recruiters));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }
}

export const adminController = new AdminController();
