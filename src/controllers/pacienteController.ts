import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';

export async function criar(req: Request, res: Response) {
  const { dataNascimento, ...dados } = req.body;

  const paciente = await prisma.paciente.create({
    data: { ...dados, dataNascimento: new Date(dataNascimento) },
  });

  return res.status(201).json(paciente);
}

export async function listar(req: Request, res: Response) {
  const { busca } = req.query;

  const pacientes = await prisma.paciente.findMany({
    where: busca
      ? {
          OR: [
            { nomeCompleto: { contains: String(busca), mode: 'insensitive' } },
            { cpf: { contains: String(busca) } },
          ],
        }
      : undefined,
    orderBy: { nomeCompleto: 'asc' },
  });

  return res.json(pacientes);
}

export async function buscarPorId(req: Request, res: Response) {
  const paciente = await prisma.paciente.findUnique({
    where: { id: req.params.id },
    include: { consultas: true },
  });

  if (!paciente) {
    throw AppError.naoEncontrado('Paciente');
  }

  return res.json(paciente);
}

export async function atualizar(req: Request, res: Response) {
  const { dataNascimento, ...dados } = req.body;

  const paciente = await prisma.paciente.update({
    where: { id: req.params.id },
    data: {
      ...dados,
      ...(dataNascimento && { dataNascimento: new Date(dataNascimento) }),
    },
  });

  return res.json(paciente);
}
