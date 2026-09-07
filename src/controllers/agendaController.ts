import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';
import { listarHorariosDisponiveis } from '../services/agendaService';

export async function criar(req: Request, res: Response) {
  const agenda = await prisma.agenda.create({ data: req.body });
  return res.status(201).json(agenda);
}

export async function listar(req: Request, res: Response) {
  const { medicoId } = req.query;

  const agendas = await prisma.agenda.findMany({
    where: {
      medicoId: (medicoId as string) || undefined,
      ativo: true,
    },
    include: {
      unidade: { select: { id: true, nome: true } },
    },
  });

  return res.json(agendas);
}

export async function atualizar(req: Request, res: Response) {
  const agenda = await prisma.agenda.update({
    where: { id: req.params.id },
    data: req.body,
  });
  return res.json(agenda);
}

export async function desativar(req: Request, res: Response) {
  await prisma.agenda.update({
    where: { id: req.params.id },
    data: { ativo: false },
  });
  return res.status(204).send();
}

export async function disponibilidade(req: Request, res: Response) {
  const { medicoId, data } = req.query;

  if (!medicoId || !data) {
    throw new AppError('Parâmetros medicoId e data são obrigatórios', 400);
  }

  const horarios = await listarHorariosDisponiveis(medicoId as string, new Date(data as string));

  return res.json(horarios);
}
