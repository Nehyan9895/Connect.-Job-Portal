import mongoose, { Document } from "mongoose";


export interface IJob extends Document{
    recruiter_id:mongoose.Schema.Types.ObjectId;
    job_id:string;
    job_title:string;
    job_location:string;
    salary_range_min:number;
    salary_range_max:number;
    job_type:string;
    job_mode:string;
    experience_required:string;
    skills_required:string[];
    last_date:Date;
    description:string;
    responsibilities:string;
    preference?:string;
}

const jobSchema = new mongoose.Schema({
    recruiter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    job_id:{
        type:String,
        required:true
    },
    job_title:{
        type:String,
        required:true
    },
    job_location:{
        type:String,
        required:true
    },
    salary_range_min:{
        type:Number,
        required:true
    },
    salary_range_max:{
        type:Number,
        required:true
    },
    job_type:{
        type:String,
        enum:['full_time','part_time','contract_based'],
        required:true
    },
    job_mode:{
        type:String,
        enum:['remote','office','hybrid'],
        required:true
    },
    experience_required:{
        type:String,
        enum:['fresher','1','2','3','4','5','6','7','8','9','10'],
        required:true
    },
    skills_required: {
        type: [String],
        required: true
    },
    last_date:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    responsibilities:{
        type:String,
        required:true
    },
    preference:{
        type:String
    },
},{
    timestamps:true
})
export const Job = mongoose.model<IJob>('Job',jobSchema)