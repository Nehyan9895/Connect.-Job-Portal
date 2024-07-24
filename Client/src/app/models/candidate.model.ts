export interface ICandidate{
    email: string;
    fullName: string;
    phone: string;
    is_verified:boolean;
    _id: string;
}

export interface Sender {
    email: string;
    image: string;
    isAdmin: boolean;
    isEmployee: boolean;
    is_done: boolean;
    is_verified: boolean;
    password: string;
    username: string;
    __v: number;
    _id: string;
  }
  