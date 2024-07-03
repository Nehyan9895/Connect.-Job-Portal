import { Candidate } from "../models/candidateModel";

class CandidateRepository{
    async createCandidate(candidateData: any): Promise<any> {
        const candidate = new Candidate(candidateData);
        await candidate.save();
        return candidate;
    }

    async findCandidateByUserId(userId: string) {
        return await Candidate.findOne({ user_id: userId });
    }

    async updateCandidateImage(userId: string, imageUrl: string) {
        const candidate = await this.findCandidateByUserId(userId);
        if (candidate) {
            candidate.image = imageUrl;
            await candidate.save();
        } else {
            throw new Error("Candidate not found");
        }
    }

    async updateCandidateResume(userId: string, resumeUrl: string) {
        const candidate = await this.findCandidateByUserId(userId);
        if (candidate) {
            candidate.resume = resumeUrl;
            await candidate.save();
        } else {
            throw new Error("Candidate not found");
        }
    }


}

export const candidateRepository = new CandidateRepository();