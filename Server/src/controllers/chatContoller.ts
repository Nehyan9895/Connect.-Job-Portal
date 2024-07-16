// import { Request, Response } from 'express';
// import { ChatService } from '../services/chatService';
// import { createErrorResponse, createSuccessResponse } from '../helpers/responseHelper';

// export class ChatController {
//     private chatService: ChatService;

//     constructor() {
//         this.chatService = new ChatService();
//     }

//     async createChatRoom(req: Request, res: Response) {
//         try {
//             const { members } = req.body;
//             const chatRoom = await this.chatService.createChatRoom(members);
//             res.status(201).json(createSuccessResponse(chatRoom));
//         } catch (err) {
//             if (err instanceof Error) {
//                 res.status(400).json(createErrorResponse(err.message));
//             } else {
//                 res.status(400).json(createErrorResponse('An unknown error occurred'));
//             }
//         }
//     }

//     async getChatRoomById(req: Request, res: Response) {
//         try {
//             const { id } = req.params;
//             const chatRoom = await this.chatService.getChatRoomById(id);
//             if (chatRoom) {
//                 res.status(200).json(createSuccessResponse(chatRoom));
//             } else {
//                 res.status(404).json(createErrorResponse('Chat room not found'));
//             }
//         } catch (err) {
//             if (err instanceof Error) {
//                 res.status(400).json(createErrorResponse(err.message));
//             } else {
//                 res.status(400).json(createErrorResponse('An unknown error occurred'));
//             }
//         }
//     }

//     async createMessage(req: Request, res: Response) {
//         try {
//             const message = await this.chatService.createMessage(req.body);
//             res.status(201).json(createSuccessResponse(message));
//         } catch (err) {
//             if (err instanceof Error) {
//                 res.status(400).json(createErrorResponse(err.message));
//             } else {
//                 res.status(400).json(createErrorResponse('An unknown error occurred'));
//             }
//         }
//     }

//     async getMessagesByChatRoomId(req: Request, res: Response) {
//         try {
//             const { chatRoomId } = req.params;
//             const messages = await this.chatService.getMessagesByChatRoomId(chatRoomId);
//             res.status(200).json(createSuccessResponse(messages));
//         } catch (err) {
//             if (err instanceof Error) {
//                 res.status(400).json(createErrorResponse(err.message));
//             } else {
//                 res.status(400).json(createErrorResponse('An unknown error occurred'));
//             }
//         }
//     }

//     async getChatRoomsByRecruiter(req: Request, res: Response) {
//         try {
//             const recruiterId = req.params.recruiterId;
//             const chatRooms = await this.chatService.getChatRoomsByRecruiter(recruiterId);
//             res.status(200).json(createSuccessResponse(chatRooms));
//         } catch (err) {
//             if (err instanceof Error) {
//                 res.status(400).json(createErrorResponse(err.message));
//             } else {
//                 res.status(400).json(createErrorResponse('An unknown error occurred'));
//             }
//         }
//     }
// }
