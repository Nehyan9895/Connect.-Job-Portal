import { IUser, User } from "../models/userModel";

class UserRepository {
    async createUser(userData: any) {
        const user = new User(userData);
        return await user.save();
    }

    async findUserByEmail(email: string): Promise<any> {
        const user = await User.findOne({ email: email }) as IUser | null;
        if (!user) {
          return null;
        }
    
        const image = await user.getImage();
        return {
          ...user.toObject(),
          image,
        };
      }
    
    

    async updateUserVerificationStatus(email: string, is_verified: boolean) {
        return await User.updateOne({ email }, { is_verified });
    }

    async findUserById(user_id:string){
        return await User.findById(user_id)
    }

    async updateUserPassword(email: string, newPassword: string) {
        return await User.updateOne({ email }, { password: newPassword });
    }

    async updateUserIsDone (user_id: string){
        return await User.findByIdAndUpdate(user_id, { is_done: true }, { new: true });
    }

    async getMessagedByUsers(user: any): Promise<IUser[]> {
        console.log(user);
        
        if (!user.messagedBy || user.messagedBy.length === 0) {
          console.log('messagedBy array is empty or undefined');
          return [];
        }
    
        console.log('messagedBy array:', user.messagedBy);
    
        const users: IUser[] = await User.find({ _id: { $in: user.messagedBy } });
        console.log('Found users:', users);
    
        const populatedUsers = await Promise.all(
          users.map(async (messagedUser) => {
            const image = await messagedUser.getImage();
            return {
              ...messagedUser.toObject(),
              image,
            };
          })
        );
    
        return populatedUsers;
      }
    
    
    
    
}

export const userRepository = new UserRepository();
