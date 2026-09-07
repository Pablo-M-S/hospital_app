import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export function registrarAuditoria(acao: string, entidade: string | null = null) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user ? req.user.id : null,
              acao,
              entidade,
              entidadeId: (req.params && req.params.id) || null,
              ip: req.ip,
            },
          });
        } catch (err) {
          console.error('Falha ao registrar auditoria:', (err as Error).message);
        }
      }
    });
    next();
  };
}
