import mongoose, { CallbackError, Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Candidate } from './candidateModel';
import { Recruiter } from './recruiterModel';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  isEmployee: boolean;
  isAdmin: boolean;
  is_done: boolean;
  getImage: () => Promise<string>;
  messagedBy: mongoose.Types.ObjectId[];
}


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegex,
  },
  password: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  isEmployee: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  is_done: {
    type: Boolean,
    default: false,
  },
  messagedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
});

userSchema.methods.getImage = async function () {
  const candidate = await Candidate.findOne({ user_id: this._id });
  if (candidate) {
    return candidate.image;
  }
  const recruiter = await Recruiter.findOne({ user_id: this._id });
  if (recruiter) {
    return recruiter.image;
  }
  return 'https://res.cloudinary.com/di9yf5j0d/image/upload/v1695795823/om0qyogv6dejgjseakej.png';
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      if (!this.password.startsWith('$2a$')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        console.log('Original Password:', this.password);
        console.log('Hashed Password:', hashedPassword);
        this.password = hashedPassword;
      }
      next();
    } catch (err) {
      next(err as CallbackError);
    }
  } else {
    return next();
  }
});

export const User = mongoose.model('User', userSchema);
