import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class FileUpload {
    async uploadFile(filePath: string, userId: string): Promise<string | null> {
        try {
            

            const uploadedFile = await cloudinary.uploader.upload(filePath, {
                resource_type: 'auto' 
            });
            return uploadedFile.secure_url;

        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

}

export default new FileUpload();
