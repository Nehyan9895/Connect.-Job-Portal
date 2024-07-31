import mongoose, { Schema, Document } from 'mongoose';

interface INotification extends Document {
  user: mongoose.Schema.Types.ObjectId;
  notification: string;
  timestamp: Date;
  is_read: boolean;
  type:string
}

const NotificationSchema: Schema = new Schema({
  type: { type: String, enum: ['video', 'others'], default: 'others' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notification: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
});


const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
