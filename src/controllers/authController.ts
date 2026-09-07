import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.ativo) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const senhaValida = await bcrypt.compare(senha, user.passwordHash);

  if (!senhaValida) {
    throw new AppError('Credenciais inválidas', 401);
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
    throw AppError.conflito('Email já cadastrado');
  }

  const passwordHash = await bcrypt.hash(senha, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, role },
  });

  return res.status(201).json({
    user: { id: user.id, email: user.email, role: user.role },
  });
}
