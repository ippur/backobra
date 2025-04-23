import express from 'express';
import pool from '../db/client.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// Utilitário para padronizar mensagens de erro
const enviarErro = (res, status, msg, error = null) => {
  console.error(msg, error || '');
  res.status(status).json({ error: msg });
};

// GET /projetos - Lista todos os projetos
router.get('/', verificarToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projetos ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    enviarErro(res, 500, 'Erro ao buscar projetos', error);
  }
});

// GET /projetos/:id - Busca um projeto específico
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

// POST /projetos - Cadastra novo projeto
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
      RETURNING *;
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

export default router;
