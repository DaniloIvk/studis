import 'express-session';
import { Role } from '@prisma/client'

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      role: Role;
      firstName?:string;
      lastName?:string | null ;
      address?:string;
      phoneNumber?:string;
    };
  }
}