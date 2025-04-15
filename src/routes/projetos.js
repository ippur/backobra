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

// Endpoint PUT para atualizar um projeto existente
router.put('/:id', async (req, res) => {
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
  const { id } = req.params;

  try {
    const query = `
      UPDATE projetos
      SET nome_proprietario = $1,
          endereco = $2,
          situacao = $3,
          codigo_projeto = $4,
          latitude = $5,
          longitude = $6,
          engenheiro_responsavel = $7,
          numero_crea = $8
      WHERE id = $9
    `;

    await pool.query(query, [
      nome_proprietario,
      endereco,
      situacao,
      codigo_projeto,
      latitude,
      longitude,
      engenheiro_responsavel,
      numero_crea,
      id
    ]);

    res.status(200).json({ message: 'Projeto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});


export default router;
