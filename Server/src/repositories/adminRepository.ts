import { User } from "../models/userModel";
import { Candidate,ICandidate } from "../models/candidateModel";
import { IRecruiter, Recruiter } from "../models/recruiterModel";

class AdminRepository{
    async findAdminByEmail(email:string){
        return await User.findOne({ email:email });
    }

    async getAllCandidatesWithUserInfo() {
        return await Candidate.aggregate([
            {
                $lookup: {
                    from: 'users', // The collection name in MongoDB
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    fullName: 1,
                    phone: 1,
                    email: '$user.email',
                    is_verified: '$user.is_verified'
                }
            }
        ]);
    }

    async getAllRecruitersWithUserInfo() {
        return await Recruiter.aggregate([
            {
                $lookup: {
                    from: 'users', // The collection name in MongoDB
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $match: {
                    'user.isEmployee': true
                }
            },
            {
                $project: {
                    fullName: 1,
                    phone: 1,
                    email: '$user.email',
                    is_verified: '$user.is_verified'
                }
            }
        ]);
    }
    

    async updateUserVerificationStatus(userId: string, is_verified: boolean) {
        const candidatedata: (ICandidate & Document) | null = await Candidate.findById(userId);
        const user_id = candidatedata?.user_id;
    
        if (!user_id) {
            throw new Error('User not found');
        }
    
        return await User.findByIdAndUpdate(user_id, { is_verified: is_verified }, { new: true });
    }

    async updateRecruiterVerificationStatus(userId:string,is_verified:boolean){
        const recruiterData:(IRecruiter&Document) | null = await Recruiter.findById(userId);
        const user_id = recruiterData?.user_id

        if (!user_id) {
            throw new Error('Recruiter not found');
        }

        return await User.findByIdAndUpdate(user_id, { is_verified: is_verified }, { new: true });
    }
    
}

export const adminRepository = new AdminRepository()