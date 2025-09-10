// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Rotas
import usuarioRoutes from './routes/usuarios.js';
import authRoutes from './routes/auth.js';
import projetoRoutes from './routes/projetos.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Origens permitidas
const allowedOrigins = [
  'http://localhost:3000', // frontend local
  'http://localhost:3001', // backend local
  'https://obravisor-chi.vercel.app', // frontend no Vercel
];

// Configuração do CORS (inclui suporte a Postman)
const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // permite chamadas sem origin (ex: Postman)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // habilita pré-flight para todas as rotas

app.use(express.json()); // Permite receber JSON no corpo das requisições

// Rotas principais
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/projetos', projetoRoutes);

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
