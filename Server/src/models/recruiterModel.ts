import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiter extends Document{
    user_id: mongoose.Schema.Types.ObjectId;
    fullName: string;
    phone: string;
    image: string;
    companyName:string;
    companyLocations:[string];
}

const recruiterSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/di9yf5j0d/image/upload/v1695795823/om0qyogv6dejgjseakej.png'
    },
    companyName:{
        type:String,
        required:true
    },
    companyLocations:{
        type:[String],
        required:true
    }
})

export const Recruiter = mongoose.model('Recruiter', recruiterSchema);