// src/routes/projetos.js
import express from 'express';
import pool from '../../db/client.js';

const router = express.Router();

// Endpoint GET para listar todos os projetos
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM projetos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

// Endpoint GET para um único projeto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar projeto por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar projeto por ID' });
  }
});

// Endpoint POST para inserir um projeto
router.post('/', async (req, res) => {
  const {
    nome_proprietario,
    endereco,
    situacao,
    codigo_projeto,
    latitude,
    longitude,
    engenheiro_responsavel,
    numero_crea,
    boleto_emitido,
    boleto_pago,
    dias_em_atraso
  } = req.body;

  try {
    const query = `
      INSERT INTO projetos (
        nome_proprietario, endereco, situacao, codigo_projeto, latitude, longitude,
        engenheiro_responsavel, numero_crea, boleto_emitido, boleto_pago, dias_em_atraso
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    const valores = [
      nome_proprietario,
      endereco,
      situacao,
      codigo_projeto,
      latitude,
      longitude,
      engenheiro_responsavel,
      numero_crea,
      boleto_emitido,
      boleto_pago,
      dias_em_atraso
    ];

    await pool.query(query, valores);
    res.status(201).json({ message: 'Projeto cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro ao cadastrar projeto:', error);
    res.status(500).json({ error: 'Erro ao cadastrar projeto' });
  }
});

export default router;
