import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';

export async function criar(req: Request, res: Response) {
  const unidade = await prisma.unidade.create({ data: req.body });
  return res.status(201).json(unidade);
}

export async function listar(req: Request, res: Response) {
  const unidades = await prisma.unidade.findMany({
    where: { ativo: true },
    orderBy: { nome: 'asc' },
  });
  return res.json(unidades);
}

export async function buscarPorId(req: Request, res: Response) {
  const unidade = await prisma.unidade.findUnique({ where: { id: req.params.id } });

  if (!unidade) {
    throw AppError.naoEncontrado('Unidade');
  }

  return res.json(unidade);
}

export async function atualizar(req: Request, res: Response) {
  const unidade = await prisma.unidade.update({
    where: { id: req.params.id },
    data: req.body,
  });
  return res.json(unidade);
}

export async function desativar(req: Request, res: Response) {
  await prisma.unidade.update({
    where: { id: req.params.id },
    data: { ativo: false },
  });
  return res.status(204).send();
}
