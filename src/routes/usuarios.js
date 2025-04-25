import express from 'express';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// ROTA GET: Listar todos os usuários
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome, email, telefone, tipo_usuario FROM usuarios ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

export default router;
