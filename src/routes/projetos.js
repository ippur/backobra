// routes/projetos.js

import express from 'express';
import pool from '../../db/client.js'; // Certifique-se de que esse arquivo está correto e configurado para o PostgreSQL

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
    numero_crea
  } = req.body;

  try {
    const query = 'INSERT INTO projetos (' +
      'nome_proprietario, endereco, situacao, codigo_projeto, latitude, longitude, engenheiro_responsavel, numero_crea' +
      ') VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    
    await pool.query(query, [
      nome_proprietario,
      endereco,
      situacao,
      codigo_projeto,
      latitude,
      longitude,
      engenheiro_responsavel,
      numero_crea
    ]);

    res.status(201).json({ message: 'Projeto cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro ao cadastrar projeto:', error);
    res.status(500).json({ error: 'Erro ao cadastrar projeto' });
  }
});

export default router;
