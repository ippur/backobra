// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/client.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'obravisor_secret';

const gerarToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
};

// Rota de registro de novo usuário (ainda usada em dev)
router.post('/register', async (req, res) => {
  const { nome, email, telefone, senha, tipo_usuario } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario) VALUES ($1, $2, $3, $4, $5)',
      [nome, email, telefone, hashedPassword, tipo_usuario]
    );

    return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar o usuário.' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha.trim(), usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = gerarToken({
      id: usuario.id,
      nome: usuario.nome,
      tipo_usuario: usuario.tipo_usuario,
    });

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario, // ESSENCIAL para controle no frontend
      },
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

export default router;
