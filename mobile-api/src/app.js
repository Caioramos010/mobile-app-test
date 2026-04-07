const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/passwords', passwordRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

module.exports = app;
