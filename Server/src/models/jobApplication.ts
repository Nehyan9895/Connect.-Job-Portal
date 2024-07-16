import mongoose, { Schema, Document } from 'mongoose';


export interface IJobApplication extends Document{
    candidate_id: mongoose.Schema.Types.ObjectId;
    job_id:mongoose.Schema.Types.ObjectId;
    application_sent:boolean;
    application_reviewed:boolean;
    resume_viewed:boolean;
    result:String
}

const jobApplicationSchema = new Schema<IJobApplication>({
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    application_sent:{
        type:Boolean,
        default:false
    },
    application_reviewed:{
        type:Boolean,
        default:false
    },
    resume_viewed:{
        type:Boolean,
        default:false
    },
    result:{
        type:String,
        enum:['Result','Accepted for Interview','Rejected'],
        default:'Result'
    }
})

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);