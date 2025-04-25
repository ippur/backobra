// src/routes/projetos.js
import express from 'express';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// GET /projetos (listar todos)
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projetos');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
});

// GET /projetos/:id (detalhar)
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar projeto por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar projeto.' });
  }
});

// POST /projetos (criar novo projeto)
router.post('/', verificarToken, async (req, res) => {
  const {
    nome_proprietario,
    endereco,
    codigo_projeto,
    engenheiro_responsavel,
    crea,
    situacao,
    debito_status,
    data_vencimento,
    parcelas
  } = req.body;

  try {
    const query = `
      INSERT INTO projetos (
        nome_proprietario,
        endereco,
        codigo_projeto,
        engenheiro_responsavel,
        crea,
        situacao,
        debito_status,
        data_vencimento,
        parcelas
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      nome_proprietario,
      endereco,
      codigo_projeto,
      engenheiro_responsavel,
      crea,
      situacao,
      debito_status,
      data_vencimento || null,
      parcelas || null
    ];

    const resultado = await pool.query(query, values);
    res.status(201).json({ message: '✅ Projeto criado com sucesso.', projeto: resultado.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao cadastrar projeto:', error);
    res.status(500).json({ error: 'Erro ao cadastrar projeto.' });
  }
});

// PUT /projetos/:id (atualizar projeto existente)
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const {
    nome_proprietario,
    endereco,
    codigo_projeto,
    engenheiro_responsavel,
    crea,
    situacao,
    debito_status,
    data_vencimento,
    parcelas
  } = req.body;

  try {
    const query = `
      UPDATE projetos
      SET nome_proprietario = $1,
          endereco = $2,
          codigo_projeto = $3,
          engenheiro_responsavel = $4,
          crea = $5,
          situacao = $6,
          debito_status = $7,
          data_vencimento = $8,
          parcelas = $9
      WHERE id = $10
      RETURNING *;
    `;

    const values = [
      nome_proprietario,
      endereco,
      codigo_projeto,
      engenheiro_responsavel,
      crea,
      situacao,
      debito_status,
      data_vencimento || null,
      parcelas || null,
      id
    ];

    const resultado = await pool.query(query, values);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    res.json({ message: '✅ Projeto atualizado com sucesso.', projeto: resultado.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao atualizar projeto:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar projeto.' });
  }
});

// DELETE /projetos/:id (remover projeto)
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('DELETE FROM projetos WHERE id = $1', [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    res.json({ message: '🗑️ Projeto deletado com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao deletar projeto:', error);
    res.status(500).json({ error: 'Erro ao deletar projeto.' });
  }
});

export default router;
