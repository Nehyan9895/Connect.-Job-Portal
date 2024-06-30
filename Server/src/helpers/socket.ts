import { Server } from 'socket.io';
import { ChatService } from '../services/chatService';

const chatService = new ChatService();

export function setupSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('joinRoom', async (chatRoomId) => {
            socket.join(chatRoomId);
        });

        socket.on('sendMessage', async (message) => {
            const savedMessage = await chatService.createMessage(message);
            io.to(message.chatRoom_id).emit('newMessage', savedMessage);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}
