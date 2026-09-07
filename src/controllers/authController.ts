import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;

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
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
}

export async function registrar(req: Request, res: Response) {
  const { email, senha, role } = req.body;

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
