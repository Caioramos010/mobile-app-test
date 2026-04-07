import { Response } from 'express';
import pool from '../config/database';
import generatePassword from '../utils/passwordGenerator';
import { AuthRequest, SavePasswordBody } from '../types';

// GET /passwords
export const getPasswords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, site, username, password, created_at FROM passwords WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar senhas:', (err as Error).message);
    res.status(500).json({ message: 'Erro ao buscar senhas.' });
  }
};

// POST /passwords
export const savePassword = async (
  req: AuthRequest & { body: SavePasswordBody },
  res: Response
): Promise<void> => {
  const { site, username, password } = req.body;

  if (!site || !username || !password) {
    res.status(400).json({ message: 'site, username e password são obrigatórios.' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO passwords (user_id, site, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, site, username, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar senha:', (err as Error).message);
    res.status(500).json({ message: 'Erro ao salvar senha.' });
  }
};

// DELETE /passwords/:id
export const deletePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM passwords WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Senha não encontrada.' });
      return;
    }

    res.json({ message: 'Senha deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar senha:', (err as Error).message);
    res.status(500).json({ message: 'Erro ao deletar senha.' });
  }
};

// GET /passwords/generate?length=16
export const generatePasswordRoute = (req: AuthRequest, res: Response): void => {
  const length = req.query['length'] ? parseInt(req.query['length'] as string) : 12;
  const password = generatePassword(length);
  res.json({ password });
};
