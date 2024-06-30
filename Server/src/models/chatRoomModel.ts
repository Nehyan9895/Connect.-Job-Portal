import mongoose, { Schema, Document } from 'mongoose';

const chatRoomSchema = new Schema({
    members:{
        type:[
            {
                type:mongoose.Types.ObjectId,
                ref:'User'
            }
        ],
        required:true
    },
    lastMessage:{
        type:String
    },
    lastMessageTime:{
        type:String
    }
},  {
    timestamps:true
});

export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);