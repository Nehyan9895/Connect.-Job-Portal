import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    fullName: string;
    phone: string;
    dob: Date;
    image: string;
    gender: string;
    education: Array<{
        qualification: string;
        specialization: string;
        nameOfInstitution: string;
        passoutYear: number;
        passoutMonth: string;
    }>;
    experience: Array<{
        isFresher: boolean;
        jobRole?: string;
        companyName?: string;
        experienceDuration?: number;
    }>;
    skills: string[];
    resume:string
}

const candidateSchema = new Schema<ICandidate>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        validate: {
            validator: (v: string): boolean => /^\d{10}$/.test(v),
            message: (props: { value: string }) => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    dob: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/di9yf5j0d/image/upload/v1695795823/om0qyogv6dejgjseakej.png'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        required: true
    },
    education: [{
        qualification: { type: String, required: true },
        specialization: { type: String, required: true },
        nameOfInstitution: { type: String, required: true },
        passoutYear: { type: Number, min: 1990, max: new Date().getFullYear(), required: true },
        passoutMonth: {
            type: String,
            enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            required: true
        }
    }],
    experience: [{
        isFresher: { type: Boolean, required: true },
        jobRole: { type: String, required: function (this: { isFresher: boolean }) { return !this.isFresher; } },
        companyName: { type: String, required: function (this: { isFresher: boolean }) { return !this.isFresher; } },
        experienceDuration: { type: Number, min: 0, required: function (this: { isFresher: boolean }) { return !this.isFresher; } }
    }],
    skills: {
        type: [String],
        required: true
    },
    resume:{
        type:String,
    }
});

export const Candidate = mongoose.model('Candidate', candidateSchema);
