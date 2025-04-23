import express from 'express';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// 📌 Utilitário para resposta padrão
const enviarErro = (res, status, msg, error = null) => {
  console.error(msg, error || '');
  res.status(status).json({ error: msg });
};

// ✅ GET /projetos — lista todos os projetos
router.get('/', verificarToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projetos ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    enviarErro(res, 500, 'Erro ao buscar projetos', error);
  }
});

// ✅ GET /projetos/:id — busca projeto específico
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
    if (rows.length === 0) {
      return enviarErro(res, 404, 'Projeto não encontrado');
    }
    res.json(rows[0]);
  } catch (error) {
    enviarErro(res, 500, 'Erro ao buscar projeto por ID', error);
  }
});

// ✅ POST /projetos — cadastrar novo projeto
router.post('/', verificarToken, async (req, res) => {
  const {
    nome_proprietario,
    endereco,
    codigo_projeto,
    localizacao,
    engenheiro_responsavel,
    crea,
    situacao,
    boleto_emitido,
    boleto_pago,
    dias_atraso
  } = req.body;

  try {
    const query = `
      INSERT INTO projetos (
        nome_proprietario, endereco, codigo_projeto, localizacao,
        engenheiro_responsavel, crea, situacao,
        boleto_emitido, boleto_pago, dias_atraso
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;
    const values = [
      nome_proprietario, endereco, codigo_projeto, localizacao,
      engenheiro_responsavel, crea, situacao,
      boleto_emitido, boleto_pago, dias_atraso
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json({ message: 'Projeto cadastrado com sucesso', projeto: rows[0] });
  } catch (error) {
    enviarErro(res, 500, 'Erro ao cadastrar projeto', error);
  }
});

// ✅ PUT /projetos/:id — editar projeto
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
    boleto_emitido,
    boleto_pago,
    dias_atraso
  } = req.body;

  try {
    const query = `
      UPDATE projetos SET
        nome_proprietario = $1,
        endereco = $2,
        codigo_projeto = $3,
        localizacao = $4,
        engenheiro_responsavel = $5,
        crea = $6,
        situacao = $7,
        boleto_emitido = $8,
        boleto_pago = $9,
        dias_atraso = $10
      WHERE id = $11
      RETURNING *
    `;
    const values = [
      nome_proprietario, endereco, codigo_projeto, localizacao,
      engenheiro_responsavel, crea, situacao,
      boleto_emitido, boleto_pago, dias_atraso, id
    ];

    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return enviarErro(res, 404, 'Projeto não encontrado para atualização');
    }
    res.json({ message: 'Projeto atualizado com sucesso', projeto: rows[0] });
  } catch (error) {
    enviarErro(res, 500, 'Erro ao atualizar projeto', error);
  }
});

// ✅ DELETE /projetos/:id — deletar projeto
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM projetos WHERE id = $1', [id]);
    if (rowCount === 0) {
      return enviarErro(res, 404, 'Projeto não encontrado para exclusão');
    }
    res.json({ message: 'Projeto excluído com sucesso' });
  } catch (error) {
    enviarErro(res, 500, 'Erro ao excluir projeto', error);
  }
});

export default router;