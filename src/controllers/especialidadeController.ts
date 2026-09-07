import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';

export async function criar(req: Request, res: Response) {
  const especialidade = await prisma.especialidade.create({ data: req.body });
  return res.status(201).json(especialidade);
}

export async function listar(req: Request, res: Response) {
  const especialidades = await prisma.especialidade.findMany({
    where: { ativo: true },
    orderBy: { nome: 'asc' },
  });
  return res.json(especialidades);
}

export async function buscarPorId(req: Request, res: Response) {
  const especialidade = await prisma.especialidade.findUnique({
    where: { id: req.params.id },
  });

  if (!especialidade) {
    throw AppError.naoEncontrado('Especialidade');
  }

  return res.json(especialidade);
}

export async function atualizar(req: Request, res: Response) {
  const especialidade = await prisma.especialidade.update({
    where: { id: req.params.id },
    data: req.body,
  });
  return res.json(especialidade);
}

export async function desativar(req: Request, res: Response) {
  await prisma.especialidade.update({
    where: { id: req.params.id },
    data: { ativo: false },
  });
  return res.status(204).send();
}
