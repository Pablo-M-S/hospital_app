const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

async function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || !user.ativo) {
      return res.status(401).json({ erro: 'Usuário inválido ou inativo' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

function autorizar(...papeisPermitidos) {
  return (req, res, next) => {
    if (!req.user || !papeisPermitidos.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso negado para este papel de usuário' });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };
