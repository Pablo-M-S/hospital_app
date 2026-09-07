import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message, detalhes: err.detalhes });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ erro: 'Registro duplicado', campo: err.meta?.target });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}
