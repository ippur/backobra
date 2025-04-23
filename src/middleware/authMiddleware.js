// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'obravisor_secret';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou malformado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // disponibiliza os dados decodificados para as rotas protegidas
    next();
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

export default verificarToken;
