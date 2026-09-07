import { Request, Response } from 'express';
import prisma from '../config/database';

export async function criar(req: Request, res: Response) {
  const { especialidadeIds, unidadeIds, dataNascimento, ...dadosMedico } = req.body;

  const medico = await prisma.medico.create({
    data: {
      ...dadosMedico,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
      especialidades: {
        create: especialidadeIds.map((especialidadeId: string) => ({ especialidadeId })),
      },
      unidades: {
        create: unidadeIds.map((unidadeId: string) => ({ unidadeId })),
      },
    },
    include: {
      especialidades: { include: { especialidade: true } },
      unidades: { include: { unidade: true } },
    },
  });

  return res.status(201).json(medico);
}

export async function listar(req: Request, res: Response) {
  const { especialidadeId, unidadeId } = req.query;

  const medicos = await prisma.medico.findMany({
    where: {
      ativo: true,
      ...(especialidadeId && {
        especialidades: { some: { especialidadeId: String(especialidadeId) } },
      }),
      ...(unidadeId && {
        unidades: { some: { unidadeId: String(unidadeId) } },
      }),
    },
    include: {
      especialidades: { include: { especialidade: true } },
      unidades: { include: { unidade: true } },
    },
    orderBy: { nomeCompleto: 'asc' },
  });

  return res.json(medicos);
}

export async function buscarPorId(req: Request, res: Response) {
  const medico = await prisma.medico.findUnique({
    where: { id: req.params.id },
    include: {
      especialidades: { include: { especialidade: true } },
      unidades: { include: { unidade: true } },
    },
  });

  if (!medico) {
    return res.status(404).json({ erro: 'Médico não encontrado' });
  }

  return res.json(medico);
}

export async function atualizar(req: Request, res: Response) {
  const { especialidadeIds, unidadeIds, dataNascimento, ...dadosMedico } = req.body;

  const medico = await prisma.medico.update({
    where: { id: req.params.id },
    data: {
      ...dadosMedico,
      ...(dataNascimento && { dataNascimento: new Date(dataNascimento) }),
      ...(especialidadeIds && {
        especialidades: {
          deleteMany: {},
          create: especialidadeIds.map((especialidadeId: string) => ({ especialidadeId })),
        },
      }),
      ...(unidadeIds && {
        unidades: {
          deleteMany: {},
          create: unidadeIds.map((unidadeId: string) => ({ unidadeId })),
        },
      }),
    },
    include: {
      especialidades: { include: { especialidade: true } },
      unidades: { include: { unidade: true } },
    },
  });

  return res.json(medico);
}

export async function desativar(req: Request, res: Response) {
  await prisma.medico.update({
    where: { id: req.params.id },
    data: { ativo: false },
  });
  return res.status(204).send();
}
