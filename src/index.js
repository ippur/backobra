import express from 'express';
import dotenv from 'dotenv';
import projetosRouter from './routes/projetos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/projetos', projetosRouter);

app.get('/', (req, res) => {
  res.send('API do Obravisor está rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
