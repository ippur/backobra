// src/index.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projetoRoutes from './routes/projetos.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Obravisor está rodando!');
});

app.use('/auth', authRoutes);
app.use('/projetos', authMiddleware, projetoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
