import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { createSuccessResponse, createErrorResponse } from '../helpers/responseHelper';
import { CustomMulterRequest } from '../config/multer';
import { recruiterService } from '../services/recruiterService';
import { userRepository } from '../repositories/userRepository';

class UserController {
    async signup(req: Request, res: Response) {
        try {
            const result = await userService.signup(req.body);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async verifyOtp(req: Request, res: Response) {
        const { otp, token } = req.body;

        try {
            if (!token) {
                throw new Error('JWT token must be provided');
            }

            const result = await userService.verifyOtp(token, otp);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async resendOtp(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(createErrorResponse('Email must be provided'));
        }

        try {
            const result = await userService.resendOtp(email);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            res.status(400).json(createErrorResponse('An unknown error occurred'));
        }
    }

    async userLogin(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const result = await userService.userLogin(email, password);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async createProfile(req: CustomMulterRequest, res: Response) {
        try {
            const email = req.body.email;
            const profileData = JSON.parse(req.body.candidateData);
            const imageFile = req.files?.image?.[0];
            const resumeFile = req.files?.resume?.[0];

            const result = await userService.createProfile(email, profileData, imageFile, resumeFile);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }


    async sendForgotOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const result = await userService.sendForgotOtp(email);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async verifyForgetOtp(req: Request, res: Response) {
        try {
            const { otp, token } = req.body;

            if (!token) {
                throw new Error('JWT token must be provided');
            }

            const result = await userService.verifyForgetOtp(otp, token);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { email, newPassword } = req.body;

            if (!email || !newPassword) {
                throw new Error('Email and new password must be provided');
            }

            const result = await userService.changePassword(email, newPassword);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getCandidateById(req: Request, res: Response) {
        try {
            const id = req.params.id
            console.log(id, 'ididnono');

            const candidate = await recruiterService.getCandidateById(id)
            res.status(200).json(createSuccessResponse(candidate));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateCandidateEducation(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const educationData = req.body;

            const updatedCandidate = await userService.updateCandidateEducation(userId, educationData);
            res.status(200).json(createSuccessResponse(updatedCandidate));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateCandidateExperience(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const experienceData = req.body;

            const updatedCandidate = await userService.updateCandidateExperience(userId, experienceData);
            res.status(200).json(createSuccessResponse(updatedCandidate));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateCandidateSkills(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const skills = req.body;

            const updatedCandidate = await userService.updateCandidateSkills(userId, skills);
            res.status(200).json(createSuccessResponse(updatedCandidate));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateCandidateProfile(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const candidateData = req.body;

            console.log('Received userId:', userId);
            console.log('Received candidateData:', candidateData);

            const updatedCandidate = await userService.updateCandidateProfile(userId, candidateData);
            res.status(200).json(createSuccessResponse(updatedCandidate));
        } catch (err) {
            console.error('Error updating candidate profile:', err);
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getMessagedUsers(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const user = await userRepository.findUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const messagedUsers = await userRepository.getMessagedByUsers(user);
            res.status(200).json(createSuccessResponse(messagedUsers));
        } catch (err) {
            console.error('Error updating candidate profile:', err);
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getRecruiterById(req:Request,res:Response){
        try {
            const id = req.params.id
            console.log(id,'ididnono');
            
            const candidate = await userService.getRecruiterById(id)
            res.status(200).json(createSuccessResponse(candidate));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }
}

export const userController = new UserController();
