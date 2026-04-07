import 'dotenv/config';
import app from './app';
import createTables from './config/migrations';

const PORT = process.env.PORT ?? 3000;

const start = async (): Promise<void> => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar o servidor:', (err as Error).message);
    process.exit(1);
  }
};

start();
