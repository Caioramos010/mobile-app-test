import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types';

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Formato de token inválido.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

export default authMiddleware;
