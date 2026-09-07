const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.ativo) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const senhaValida = await bcrypt.compare(senha, user.passwordHash);

  if (!senhaValida) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
}

async function registrar(req, res) {
  const { email, senha, role } = req.body;

  if (!email || !senha || !role) {
    return res.status(400).json({ erro: 'Email, senha e role são obrigatórios' });
  }

  const usuarioExistente = await prisma.user.findUnique({ where: { email } });

  if (usuarioExistente) {
    return res.status(409).json({ erro: 'Email já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(senha, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, role },
  });

  return res.status(201).json({
    user: { id: user.id, email: user.email, role: user.role },
  });
}

module.exports = { login, registrar };
