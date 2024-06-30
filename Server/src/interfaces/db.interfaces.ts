import { ObjectId } from 'mongoose';

export interface IUser {
    _id: ObjectId;
    email: string;
    password: string;
    is_verified: boolean;
    isEmployee: boolean;
    username: string;
    is_done: boolean;
}

export interface ICandidate {
    user_id: ObjectId;
    fullName: string;
    phone: string;
    dob: Date;
    image: string;
    gender: string;
    education: IEducation[];
    experience: IExperience[];
    skills: string[];
}

export interface IEducation {
    qualification: string;
    specialization: string;
    nameOfInstitution: string;
    passoutYear: number;
    passoutMonth: string;
}

export interface IExperience {
    isFresher: boolean;
    jobRole: string;
    companyName: string;
    experienceDuration: string;
}

export interface IUserData {
    email: string;
    password: string;
    username?: string;
}

export interface IProfileData {
    fullName: string;
    phone: string;
    dob: Date;
    gender: string;
    qualification: string;
    specialization: string;
    institution: string;
    passoutYear: number;
    passoutMonth: string;
    isFresher: boolean;
    jobRole: string;
    companyName: string;
    experienceDuration: string;
    skills: string[];
}
