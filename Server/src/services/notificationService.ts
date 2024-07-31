import { notificationRepository } from "../repositories/notificationRepository";



class NotificationService{
    async createNotification(userId:string,message:string){
        return await notificationRepository.createNotification(userId,message)
    }
}

export const notificationService = new NotificationService()