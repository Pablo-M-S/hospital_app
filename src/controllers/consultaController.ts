import { Request, Response } from 'express';
import { StatusConsulta } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';
import { garantirHorarioLivre, duracaoPadraoDoMedico } from '../services/agendaService';

export async function listar(req: Request, res: Response) {
  const { medicoId, pacienteId, status, dataInicio, dataFim } = req.query;

  const consultas = await prisma.consulta.findMany({
    where: {
      medicoId: (medicoId as string) || undefined,
      pacienteId: (pacienteId as string) || undefined,
      status: (status as StatusConsulta) || undefined,
      dataHora: {
        gte: dataInicio ? new Date(dataInicio as string) : undefined,
        lte: dataFim ? new Date(dataFim as string) : undefined,
      },
    },
    include: {
      paciente: { select: { id: true, nomeCompleto: true } },
      medico: { select: { id: true, nomeCompleto: true } },
      unidade: { select: { id: true, nome: true } },
    },
    orderBy: { dataHora: 'asc' },
  });

  return res.json(consultas);
}

export async function buscarPorId(req: Request, res: Response) {
  const consulta = await prisma.consulta.findUnique({
    where: { id: req.params.id },
    include: {
      paciente: true,
      medico: { select: { id: true, nomeCompleto: true, crm: true } },
      unidade: { select: { id: true, nome: true } },
    },
  });

  if (!consulta) {
    throw AppError.naoEncontrado('Consulta');
  }

  return res.json(consulta);
}

export async function marcar(req: Request, res: Response) {
  const { pacienteId, medicoId, unidadeId, dataHora, motivoConsulta, observacoes } = req.body;

  const dataHoraConsulta = new Date(dataHora);
  const duracao = await duracaoPadraoDoMedico(medicoId);

  await garantirHorarioLivre(medicoId, dataHoraConsulta, duracao);

  const consulta = await prisma.consulta.create({
    data: {
      pacienteId,
      medicoId,
      unidadeId,
      dataHora: dataHoraConsulta,
      motivoConsulta,
      observacoes,
    },
  });

  return res.status(201).json(consulta);
}

export async function reagendar(req: Request, res: Response) {
  const { dataHora } = req.body;

  const consultaAtual = await prisma.consulta.findUnique({ where: { id: req.params.id } });

  if (!consultaAtual) {
    throw AppError.naoEncontrado('Consulta');
  }

  const novaDataHora = new Date(dataHora);
  const duracao = await duracaoPadraoDoMedico(consultaAtual.medicoId);

  await garantirHorarioLivre(consultaAtual.medicoId, novaDataHora, duracao, consultaAtual.id);

  const consulta = await prisma.consulta.update({
    where: { id: consultaAtual.id },
    data: { dataHora: novaDataHora, status: 'AGENDADA' },
  });

  return res.json(consulta);
}

export async function atualizarStatus(req: Request, res: Response) {
  const { status } = req.body;

  const consulta = await prisma.consulta.findUnique({ where: { id: req.params.id } });

  if (!consulta) {
    throw AppError.naoEncontrado('Consulta');
  }

  const atualizada = await prisma.consulta.update({
    where: { id: consulta.id },
    data: { status },
  });

  return res.json(atualizada);
}
