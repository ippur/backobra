import express from 'express';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// ROTA GET /projetos (protegido por token)
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projetos');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
});

// ROTA GET /projetos/:id
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar projeto por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
});

// ROTA PUT /projetos/:id
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const {
    nome_proprietario,
    endereco,
    codigo_projeto,
    localizacao,
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
          localizacao = $4,
          engenheiro_responsavel = $5,
          crea = $6,
          situacao = $7,
          debito_status = $8,
          data_vencimento = $9,
          parcelas = $10
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      nome_proprietario,
      endereco,
      codigo_projeto,
      localizacao,
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
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ message: 'Projeto atualizado com sucesso', projeto: resultado.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar projeto' });
  }
});

// ROTA PUT: Atualizar um projeto existente
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const {
    nome_proprietario,
    endereco,
    codigo_projeto,
    localizacao,
    engenheiro_responsavel,
    crea,
    situacao,
    debito_status,
    data_vencimento,
    parcelas
  } = req.body;

  console.log('🟡 Dados recebidos no PUT /projetos/:id =>', req.body); // 👈 DEBUG CRUCIAL

  try {
    const query = `
      UPDATE projetos
      SET nome_proprietario = $1,
          endereco = $2,
          codigo_projeto = $3,
          localizacao = $4,
          engenheiro_responsavel = $5,
          crea = $6,
          situacao = $7,
          debito_status = $8,
          data_vencimento = $9,
          parcelas = $10
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      nome_proprietario,
      endereco,
      codigo_projeto,
      localizacao,
      engenheiro_responsavel,
      crea,
      situacao,
      debito_status,
      data_vencimento,
      parcelas,
      id
    ];

    const resultado = await pool.query(query, values);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ message: 'Projeto atualizado com sucesso', projeto: resultado.rows[0] });
  } catch (error) {
    console.error('❌ Erro ao atualizar projeto (PUT /projetos/:id):', error);
    res.status(500).json({ error: 'Erro interno ao atualizar projeto' });
  }
});


// ROTA DELETE /projetos/:id
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM projetos WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ message: 'Projeto deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({ error: 'Erro ao deletar projeto' });
  }
});

export default router;
