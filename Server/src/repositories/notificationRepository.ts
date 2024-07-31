import mongoose from "mongoose";
import Notification from "../models/notificationModel";

class NotificationRepository{
    async createNotification(userid:string,message:string){
        const notification = new Notification({
            user: new mongoose.Types.ObjectId(userid),
            notification: message,
          });
        
          await notification.save();
        return notification
    }

    async getNotifications(userId:string){
        return await Notification.findOne({user:userId})
    }
}

export const notificationRepository = new NotificationRepository()