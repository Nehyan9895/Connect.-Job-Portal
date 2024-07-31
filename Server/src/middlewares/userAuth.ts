import { Request, Response, NextFunction } from 'express';
import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/userModel'; 
import { userRepository } from '../repositories/userRepository';

dotenv.config();


const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret'; // Use a secure key and keep it in environment variables

interface JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
      interface Request {
          user?: JwtPayload
      }
  }
}

class AuthMiddleware {
  private jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  public verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).send('Access Denied: No Token Provided!');
    }

    try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;
      console.log(decoded);
      
      if(decoded){
          const userData = await userRepository.findUserById(decoded.id)
          console.log(userData);
          
          if (userData?.is_verified === false) {
              
              return res.status(401).send('Access Denied: You Are Blocked By Admin!');
          }
      }
      if (decoded) {                     
          req.user = decoded;
          next();
      }else{
          return res.status(401).send('Access Denied: Invalid Token Or Expired Provided!');
      }
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  };

}

const authMiddleware = new AuthMiddleware(jwtSecret);

export { authMiddleware };
