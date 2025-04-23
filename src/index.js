// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projetoRoutes from './routes/projetos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do CORS
const corsOptions = {
  origin: ['https://obravisor-frontend.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};

// Aplica CORS com opções
app.use(cors(corsOptions));

// Middleware adicional para headers CORS (para garantir em ambientes como Render)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://obravisor-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Resposta rápida para pré-flight
  }
  next();
});

// Middlewares
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/projetos', projetoRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
