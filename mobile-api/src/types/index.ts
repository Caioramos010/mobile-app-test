import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
}

export interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

export interface SignInBody {
  email: string;
  password: string;
}

export interface SavePasswordBody {
  site: string;
  username: string;
  password: string;
}

export interface JwtPayload {
  id: number;
}
