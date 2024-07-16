import { Message } from '../models/messageModel';
import { User } from '../models/userModel';

export class ChatRepository {
  async sendMessage(senderId: string, receiverId: string, message: string) {
    const newMessage = new Message({ senderId, receiverId, message });
    return await newMessage.save();
  }

  async getMessages(senderId: string, receiverId: string) {
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ timestamp: 1 })
      .populate({
        path: 'senderId receiverId',
        select: 'username email',
      });

    const populatedMessages = await Promise.all(
      messages.map(async (message) => {
        const sender = message.senderId as any;
        const receiver = message.receiverId as any;
        const senderImage = await sender.getImage();
        const receiverImage = await receiver.getImage();
        return {
          ...message.toObject(),
          senderId: {
            ...sender.toObject(),
            image: senderImage,
            _id: sender._id,
            username: sender.username,
            email: sender.email
          },
          receiverId: {
            ...receiver.toObject(),
            image: receiverImage,
            _id: receiver._id,
            username: receiver.username,
            email: receiver.email
          },
        };
      })
    );

    return populatedMessages;
  }

  async getMessageById(id: string) {
    const message = await Message.findById(id).populate({
      path: 'senderId receiverId',
      select: 'username email',
    });

    if (!message) {
      throw new Error('Message not found');
    }

    const sender = message.senderId as any;
    const receiver = message.receiverId as any;
    const senderImage = await sender.getImage();
    const receiverImage = await receiver.getImage();

    return {
      ...message.toObject(),
      senderId: {
        ...sender.toObject(),
        image: senderImage,
        _id: sender._id,
        username: sender.username,
        email: sender.email
      },
      receiverId: {
        ...receiver.toObject(),
        image: receiverImage,
        _id: receiver._id,
        username: receiver.username,
        email: receiver.email
      },
    };
  }

  async addMessagedBy(senderId:string,receiverId:string){
      return await User.findByIdAndUpdate(receiverId, {
      $addToSet: { messagedBy: senderId }
    });
  }
}
