import multer from 'multer';
import fs from 'fs'
import path from 'path'
import { Request } from "express";

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});



export const imageFilter = (req:Request,file:Express.Multer.File,cb:CallableFunction)=>{
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
        return cb((new Error('You can only upload Images')),false) 
    }
    cb(null,true)
}







export const upload = multer({storage:storage,fileFilter:imageFilter})