import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  date: Date;
  time: string;
  candidateId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
  jobApplicationId: Schema.Types.ObjectId;
  roomId: string;
}

const interviewSchema = new Schema<IInterview>({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  jobApplicationId: { type: Schema.Types.ObjectId, ref: 'JobApplication', required: true },
  roomId: { type: String, required: true }, 
});

export const Interview = mongoose.model<IInterview>('Interview', interviewSchema);
