import express from "express";
import cors from "cors";
import projetosRoutes from "./routes/projetos.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Habilita CORS para todas as origens
app.use(cors());
app.use(express.json());

app.use("/projetos", projetosRoutes);

app.get("/", (req, res) => {
  res.send("API do Obravisor está rodando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
