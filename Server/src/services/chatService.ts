// import { ChatRoomRepository } from "../repositories/chatRepository";
// import { MessageRepository } from "../repositories/chatRepository";

// export class ChatService {
//     private chatRoomRepo: ChatRoomRepository;
//     private messageRepo: MessageRepository;

//     constructor() {
//         this.chatRoomRepo = new ChatRoomRepository();
//         this.messageRepo = new MessageRepository();
//     }

//     async createChatRoom(members: string[]): Promise<any> {
//         return this.chatRoomRepo.createChatRoom(members);
//     }

//     async getChatRoomById(id: string): Promise<any | null> {
//         return this.chatRoomRepo.getChatRoomById(id);
//     }

//     async createMessage(data: any): Promise<any> {
//         const message = await this.messageRepo.createMessage(data);
//         await this.chatRoomRepo.updateLastMessage(data.chatRoom_id, data.text, new Date().toISOString());
//         return message;
//     }

//     async getMessagesByChatRoomId(chatRoomId: string): Promise<any> {
//         return this.messageRepo.getMessagesByChatRoomId(chatRoomId);
//     }

//     async getChatRoomsByRecruiter(recruiterId: string): Promise<any> {
//         return this.chatRoomRepo.getChatRoomsByMember(recruiterId);
//     }
// }
