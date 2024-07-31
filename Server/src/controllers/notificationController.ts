import { Request,Response } from "express";
import { notificationService } from "../services/notificationService";
import { createErrorResponse, createSuccessResponse } from "../helpers/responseHelper";

class NotificationController{
    async createNotification(req:Request,res:Response){
        try {
            const {userId,message} = req.body;
            const notification = await notificationService.createNotification(userId,message)
            res.status(200).json(createSuccessResponse(notification));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
        

    }
}

export const notificationController = new NotificationController()