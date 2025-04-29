// src/routes/usuarios.js
import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// GET /usuarios — Lista todos os usuários
router.get('/', verificarToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, nome, email, telefone, tipo_usuario
      FROM usuarios
      ORDER BY id ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// GET /usuarios/:id — Detalhar um usuário
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT id, nome, email, telefone, tipo_usuario
      FROM usuarios
      WHERE id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// POST /usuarios — Cadastrar novo usuário
router.post('/', verificarToken, async (req, res) => {
  const { nome, email, telefone, senha, tipo_usuario } = req.body;

  if (!nome || !email || !telefone || !senha || !tipo_usuario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const { rows } = await pool.query(`
      INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, telefone, tipo_usuario;
    `, [nome, email, telefone, hashedPassword, tipo_usuario]);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', usuario: rows[0] });
  } catch (error) {
    console.error('❌ Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
  }
});

// PUT /usuarios/:id — Atualizar usuário
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, tipo_usuario } = req.body;

  try {
    const { rowCount, rows } = await pool.query(`
      UPDATE usuarios
      SET nome = $1,
          email = $2,
          telefone = $3,
          tipo_usuario = $4
      WHERE id = $5
      RETURNING id, nome, email, telefone, tipo_usuario;
    `, [nome, email, telefone, tipo_usuario, id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
    }

    res.json({ message: 'Usuário atualizado com sucesso', usuario: rows[0] });
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// DELETE /usuarios/:id — Excluir usuário
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para exclusão.' });
    }

    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

export default router;
