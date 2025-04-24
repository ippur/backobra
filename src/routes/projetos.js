import express from 'express';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

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
    debito_emitido,
    debito_pago,
    dias_em_atraso
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
          debito_emitido = $8,
          debito_pago = $9,
          dias_em_atraso = $10
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
      debito_emitido,
      debito_pago,
      dias_em_atraso,
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

// ROTA DELETE: Exclui um projeto existente
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM projetos WHERE id = $1';
    const result = await pool.query(query, [id]);

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
