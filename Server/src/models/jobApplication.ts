import mongoose, { Schema, Document } from 'mongoose';


export interface IJobApplication extends Document{
    candidate_id: mongoose.Schema.Types.ObjectId;
    job_id:mongoose.Schema.Types.ObjectId;
    application_sent:boolean;
    application_reviewed:boolean;
    interview:boolean;
    selected:boolean;
    rejected:boolean;
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
    interview:{
        type:Boolean,
        default:false
    },
    selected:{
        type:Boolean,
        default:false
    },
    rejected:{
        type:Boolean,
        default:false
    },
})

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);