// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import projetoRoutes from './routes/projetos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1) Defina explicitamente as origens permitidas
const allowedOrigins = [
  'http://localhost:3000',
  'https://obravisor-frontend.vercel.app'
];

// 2) Configure o CORS incluindo pré-flight (OPTIONS)
const corsOptions = {
  origin(origin, callback) {
    // permitir chamadas sem origin (tools como Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
// habilita pré-flight para todas as rotas
app.options('*', cors(corsOptions));

app.use(express.json());

// suas rotas
app.use('/auth', authRoutes);
app.use('/projetos', projetoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
