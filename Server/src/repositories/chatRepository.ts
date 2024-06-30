import { ChatRoom } from '../models/chatRoomModel';

export class ChatRoomRepository {
    async createChatRoom(members: string[]): Promise<any> {
        const chatRoom = new ChatRoom({ members });
        return chatRoom.save();
    }

    async getChatRoomById(id: string): Promise<any> {
        return ChatRoom.findById(id).populate('members').exec();
    }

    async updateLastMessage(id: string, message: string, time: string): Promise<void> {
        await ChatRoom.findByIdAndUpdate(id, { lastMessage: message, lastMessageTime: time }).exec();
    }

    async getChatRoomsByMember(memberId: string): Promise<any> {
        return ChatRoom.find({ members: memberId }).populate('members').exec();
    }
}


// repositories/MessageRepository.ts
import { Message } from '../models/messageModel';

export class MessageRepository {
    async createMessage(data: any): Promise<any> {
        const message = new Message(data);
        return message.save();
    }

    async getMessagesByChatRoomId(chatRoomId: string): Promise<any> {
        return Message.find({ chatRoom_id: chatRoomId }).exec();
    }

    // Additional methods as needed
}
