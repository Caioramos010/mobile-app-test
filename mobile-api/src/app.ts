import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import passwordRoutes from './routes/passwordRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/passwords', passwordRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

export default app;
