import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/database';
import { SignUpBody, SignInBody } from '../types';

const jwtOptions: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
};

// POST /auth/signup
export const signUp = async (req: Request<{}, {}, SignUpBody>, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    return;
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ message: 'E-mail já cadastrado.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, jwtOptions);
  } catch (err) {
    console.error('Erro no signUp:', (err as Error).message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// POST /auth/signin
export const signIn = async (req: Request<{}, {}, SignInBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, jwtOptions);

    res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at },
      token,
    });
  } catch (err) {
    console.error('Erro no signIn:', (err as Error).message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
