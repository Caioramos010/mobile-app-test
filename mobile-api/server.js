require('dotenv').config();
const app = require('./src/app');
const createTables = require('./src/config/migrations');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar o servidor:', err.message);
    process.exit(1);
  }
};

start();
