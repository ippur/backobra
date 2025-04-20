import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projetoRoutes from './routes/projetos.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS para permitir apenas a origem da Vercel
const corsOptions = {
  origin: 'https://obravisor-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Obravisor está rodando!');
});

app.use('/auth', authRoutes);
app.use('/projetos', authMiddleware, projetoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
