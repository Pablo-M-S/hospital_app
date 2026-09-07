import prisma from '../config/database';
import { AppError } from '../utils/AppError';

interface Intervalo {
  inicio: Date;
  fim: Date;
}

const STATUS_QUE_OCUPAM_HORARIO = ['AGENDADA', 'CONFIRMADA', 'EM_ANDAMENTO'] as const;

function combinarDataEHora(data: Date, horaLiteral: string): Date {
  const [hora, minuto] = horaLiteral.split(':').map(Number);
  const resultado = new Date(data);
  resultado.setHours(hora, minuto, 0, 0);
  return resultado;
}

function seSobrepoe(a: Intervalo, b: Intervalo): boolean {
  return a.inicio < b.fim && b.inicio < a.fim;
}

export async function listarHorariosDisponiveis(medicoId: string, data: Date) {
  const diaSemana = data.getDay();

  const agendasDoDia = await prisma.agenda.findMany({
    where: { medicoId, diaSemana, ativo: true },
  });

  if (agendasDoDia.length === 0) {
    return [];
  }

  const inicioDoDia = new Date(data);
  inicioDoDia.setHours(0, 0, 0, 0);
  const fimDoDia = new Date(data);
  fimDoDia.setHours(23, 59, 59, 999);

  const consultasOcupadas = await prisma.consulta.findMany({
    where: {
      medicoId,
      status: { in: [...STATUS_QUE_OCUPAM_HORARIO] },
      dataHora: { gte: inicioDoDia, lte: fimDoDia },
    },
    select: { dataHora: true },
  });

  const horariosDisponiveis: { unidadeId: string; horario: Date }[] = [];

  for (const agenda of agendasDoDia) {
    let cursor = combinarDataEHora(data, agenda.horaInicio);
    const fimExpediente = combinarDataEHora(data, agenda.horaFim);

    while (cursor < fimExpediente) {
      const fimDoSlot = new Date(cursor.getTime() + agenda.duracaoConsulta * 60_000);

      const ocupado = consultasOcupadas.some((consulta) =>
        seSobrepoe(
          { inicio: cursor, fim: fimDoSlot },
          {
            inicio: consulta.dataHora,
            fim: new Date(consulta.dataHora.getTime() + agenda.duracaoConsulta * 60_000),
          }
        )
      );

      if (!ocupado && cursor > new Date()) {
        horariosDisponiveis.push({ unidadeId: agenda.unidadeId, horario: new Date(cursor) });
      }

      cursor = fimDoSlot;
    }
  }

  return horariosDisponiveis.sort((a, b) => a.horario.getTime() - b.horario.getTime());
}

export async function garantirHorarioLivre(medicoId: string, dataHora: Date, duracaoMinutos: number, consultaIdIgnorada?: string) {
  const fim = new Date(dataHora.getTime() + duracaoMinutos * 60_000);

  const conflitante = await prisma.consulta.findFirst({
    where: {
      medicoId,
      status: { in: [...STATUS_QUE_OCUPAM_HORARIO] },
      id: consultaIdIgnorada ? { not: consultaIdIgnorada } : undefined,
      dataHora: {
        gte: new Date(dataHora.getTime() - 4 * 60 * 60_000),
        lte: fim,
      },
    },
  });

  if (conflitante && seSobrepoe(
    { inicio: dataHora, fim },
    { inicio: conflitante.dataHora, fim: new Date(conflitante.dataHora.getTime() + duracaoMinutos * 60_000) }
  )) {
    throw AppError.conflito('Já existe uma consulta marcada para este médico neste horário');
  }
}

export async function duracaoPadraoDoMedico(medicoId: string): Promise<number> {
  const agenda = await prisma.agenda.findFirst({ where: { medicoId, ativo: true } });
  return agenda?.duracaoConsulta ?? 30;
}
