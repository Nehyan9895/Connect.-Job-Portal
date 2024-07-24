import { Response, Request } from "express";
import { recruiterService } from "../services/recruiterService";
import { createSuccessResponse, createErrorResponse } from "../helpers/responseHelper";
import { recruiterRepository } from "../repositories/recruiterRepository";
import { v4 as uuidv4 } from 'uuid';
import { io } from "../helpers/socket";

class RecruiterController {
    async recruiterLogin(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const result = await recruiterService.recruiterLogin(email, password);
            res.status(200).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getCompanyLocations(req: Request, res: Response) {
        const userId = req.params.userId;

        try {
            const locations = await recruiterService.getCompanyLocations(userId);
            if (locations) {
                res.status(200).json(createSuccessResponse(locations));
            } else {
                res.status(404).json(createErrorResponse('Recruiter not found'));
            }
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async createProfile(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const profileData = req.body.candidateData;
            const file = req.file;

            console.log(email);

            const result = await recruiterService.createProfile(email, profileData, file);
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

    async scheduleInterview(req: Request, res: Response) {
        try {
            const { date, time, candidateId, jobId, jobApplicationId } = req.body;
            const roomId = uuidv4();
            const interviewDetails = { date, time, candidateId, jobId, jobApplicationId, roomId };
            const newInterview = await recruiterRepository.createInterview(interviewDetails);
            res.status(200).json(createSuccessResponse(newInterview));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }


    async getAllInterviews(req: Request, res: Response): Promise<void> {
        try {
            const interviews = await recruiterService.getAllInterviews();
            res.status(200).json(createSuccessResponse(interviews));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const id = req.params.id;
            console.log(id);

            const profile = await recruiterService.getProfile(id)
            console.log(profile);

            res.status(200).json(createSuccessResponse(profile));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateCompanyLocations(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const companyLocations = req.body;

            const updatedRecruiter = await recruiterService.updateCompanyLocations(userId, companyLocations);
            res.status(200).json(createSuccessResponse(updatedRecruiter));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async updateRecruiterProfile(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const recruiterData = req.body;

            console.log('Received userId:', userId);
            console.log('Received recruiterData:', recruiterData);

            const updatedRecruiter = await recruiterService.updateRecruiterProfile(userId, recruiterData);
            res.status(200).json(createSuccessResponse(updatedRecruiter));
        } catch (err) {
            console.error('Error updating candidate profile:', err);
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async joinRoom(req: Request, res: Response) {
        try {
            const { roomId } = req.body;
            const interview = await recruiterRepository.findInterviewByRoomId(roomId)
            if (!interview) {
                res.status(400).json(createErrorResponse('Invalid room'));
            }
            res.status(200).json(createSuccessResponse(interview));
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async signal(req: Request, res: Response){
        try {
          const { roomId, message } = req.body;
          // Send the message to the other peer in the room
          io.to(roomId).emit('signal', message);
          res.status(200).json({ success: true });
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json(createErrorResponse(err.message));
            } else {
                res.status(400).json(createErrorResponse('An unknown error occurred'));
            }
        }
      };
      
}

export const recruiterController = new RecruiterController();
