import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export async function autenticar(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

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

export function autorizar(...papeisPermitidos: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !papeisPermitidos.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso negado para este papel de usuário' });
    }
    next();
  };
}
