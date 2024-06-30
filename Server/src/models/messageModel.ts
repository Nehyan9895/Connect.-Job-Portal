import mongoose, { Schema, Document } from 'mongoose';


const messageSchema = new Schema({
    sender_id:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,
    },
    reciever_id:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,
    },
    chatRoom_id:{
        type: mongoose.Types.ObjectId,
        ref: "ChatRoom",
        require: true,
    },
    text:{
        type:String,
        trim:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

export const Message = mongoose.model('Message',messageSchema)