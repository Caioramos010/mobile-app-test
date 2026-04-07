const pool = require('./database'); // ✅ caminho corrigido (era '../config/database')

const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100)        NOT NULL,
      email      VARCHAR(150) UNIQUE NOT NULL,
      password   VARCHAR(255)        NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // ✅ colunas alinhadas com o passwordController (site + username)
  const createPasswordsTable = `
    CREATE TABLE IF NOT EXISTS passwords (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      site       VARCHAR(100) NOT NULL,
      username   VARCHAR(150) NOT NULL,
      password   VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createUsersTable);
    console.log('✅ Tabela "users" criada/verificada');
    await pool.query(createPasswordsTable);
    console.log('✅ Tabela "passwords" criada/verificada');
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err.message);
    throw err;
  }
};

module.exports = createTables;