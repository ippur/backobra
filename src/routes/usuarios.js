// src/routes/usuarios.js
import express from 'express';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// GET /usuarios — lista todos os usuários
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, telefone, tipo_usuario FROM usuarios ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// GET /usuarios/:id — detalhes de um usuário
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, nome, email, telefone, tipo_usuario FROM usuarios WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// PUT /usuarios/:id — atualiza um usuário
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, tipo_usuario } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE usuarios
      SET nome = $1,
          email = $2,
          telefone = $3,
          tipo_usuario = $4
      WHERE id = $5
      RETURNING id, nome, email, telefone, tipo_usuario;
      `,
      [nome, email, telefone, tipo_usuario, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para atualizar' });
    }

    res.json({ message: 'Usuário atualizado com sucesso', usuario: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// DELETE /usuarios/:id — remove um usuário
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para excluir' });
    }

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

export default router;
