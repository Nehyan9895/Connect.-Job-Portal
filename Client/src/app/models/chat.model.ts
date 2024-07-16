export interface ChatI extends Document{
    _id: string;
    senderId: {
      _id: string;
      username: string;
      email: string;
      password: string;
      is_verified: boolean;
      image: string;
      isEmployee: boolean;
      isAdmin: boolean;
      is_done: boolean;
      __v: number;
    };
    receiverId: {
      _id: string;
      username: string;
      email: string;
      password: string;
      is_verified: boolean;
      image: string;
      isEmployee: boolean;
      isAdmin: boolean;
      is_done: boolean;
      __v: number;
    };
    senderImage?:string;
    recieverImage?:string,
    message: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface UserStatus {
  userId: string;
  isOnline: boolean;
}