import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ChatRepository } from '../repositories/chatRepository';
import { notificationRepository } from '../repositories/notificationRepository';

const chatRepository = new ChatRepository();
const onlineUsers = new Map();

let io: Server

export const setupSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A User Connected');

        socket.on('user-connect', (userId) => {
            onlineUsers.set(userId, { socketId: socket.id, lastActive: Date.now() });
            broadcastOnlineUsers();
        });

        socket.on('joinChat', ({ senderId, receiverId }) => {
            const room = [senderId, receiverId].sort().join('-');
            socket.join(room);

            chatRepository.getMessages(senderId, receiverId).then((messages) => {
                socket.emit('allMessages', messages);
            });
        });

        socket.on('sendMessage', async ({ senderId, receiverId, message, username }) => {
            const room = [senderId, receiverId].sort().join('-');

            try {
                // Save the message
                const savedMessage = await chatRepository.sendMessage(senderId, receiverId, message);
                const updatedMessage = await chatRepository.getMessageById(savedMessage._id as unknown as string);

                // Add to messagedBy
                await chatRepository.addMessagedBy(senderId, receiverId);

                // Create and save notification
                const notificationMessage = `You have a new message from ${username}`;
                const notification = await notificationRepository.createNotification(receiverId, notificationMessage);

                // Emit the message and notification
                io.to(room).emit('message', updatedMessage);
                console.log(`Emitting notification to ${receiverId}`);
                const receiverSocketId = onlineUsers.get(receiverId)?.socketId;
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('notification', {
                        type: 'message',
                        message: notification.notification
                    });
                } else {
                    console.log(`No active socket found for receiver ${receiverId}`);
                }




            } catch (error) {
                console.error('Error sending message:', error);
            }
        });


        socket.on('heartbeat', (userId) => {
            if (onlineUsers.has(userId)) {
                onlineUsers.get(userId).lastActive = Date.now();
            }
        });

        socket.on('disconnect', () => {
            console.log('A User Disconnected');
            for (let [userId, userData] of onlineUsers.entries()) {
                if (userData.socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            broadcastOnlineUsers();
        });

        socket.on('startInterview', async ({  job,candidateId, roomID }) => {
            const notificationLink = `localhost:4200/video-call?roomID=${roomID}`;
        
            try {
                // Create and save notification
                const notification = await notificationRepository.createNotification(candidateId, notificationLink);
        
                // Emit the notification
                const receiverSocketId = onlineUsers.get(candidateId)?.socketId;
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('notification', {
                        type: 'video',
                        message: `Join this meeting for ${job} position`,
                        link: notificationLink // Send the link with the notification
                    });
                } else {
                    console.log(`No active socket found for receiver ${candidateId}`);
                }
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        });
        


    });

    function broadcastOnlineUsers() {
        const onlineUserIds = Array.from(onlineUsers.keys());
        io.emit('online-users', onlineUserIds);
    }

    setInterval(() => {
        const now = Date.now();
        for (const [userId, userData] of onlineUsers.entries()) {
            if (now - userData.lastActive > 60000) {
                onlineUsers.delete(userId);
            }
        }
        broadcastOnlineUsers();
    }, 30000);
}
export { io };
