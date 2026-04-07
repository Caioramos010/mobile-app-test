const pool = require('../config/database');
const generatePassword = require('../utils/passwordGenerator');

// Listar senhas do usuário
const getPasswords = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, site, username, password, created_at FROM passwords WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar senhas' });
  }
};

// Salvar senha
const savePassword = async (req, res) => {
  const { site, username, password } = req.body;

  if (!site || !username || !password) {
    return res.status(400).json({ message: 'site, username e password são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO passwords (user_id, site, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, site, username, password]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao salvar senha' });
  }
};

// Deletar senha
const deletePassword = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM passwords WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Senha não encontrada' });
    }
    return res.json({ message: 'Senha deletada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar senha' });
  }
};

const generatePasswordRoute = (req, res) => {
  const { length } = req.query;
  const password = generatePassword(length ? parseInt(length) : 12);
  return res.json({ password });
};

module.exports = { getPasswords, savePassword, deletePassword, generatePasswordRoute };