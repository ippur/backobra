import express from 'express';
import pool from '../db/client.js';

const router = express.Router();

// GET /projetos — lista todos
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM projetos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

// GET /projetos/:id — projeto por ID
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

// POST /projetos — cadastrar novo
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
    const query =
      'INSERT INTO projetos (' +
      'nome_proprietario, endereco, situacao, codigo_projeto, latitude, longitude, ' +
      'engenheiro_responsavel, numero_crea, boleto_emitido, boleto_pago, dias_em_atraso' +
      ') VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';

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

// PUT /projetos/:id — atualizar projeto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
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
    const query =
      'UPDATE projetos SET ' +
      'nome_proprietario = $1, ' +
      'endereco = $2, ' +
      'situacao = $3, ' +
      'codigo_projeto = $4, ' +
      'latitude = $5, ' +
      'longitude = $6, ' +
      'engenheiro_responsavel = $7, ' +
      'numero_crea = $8, ' +
      'boleto_emitido = $9, ' +
      'boleto_pago = $10, ' +
      'dias_em_atraso = $11 ' +
      'WHERE id = $12';

    const params = [
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
      dias_em_atraso,
      id
    ];

    await pool.query(query, params);
    res.status(200).json({ message: 'Projeto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});

export default router;
