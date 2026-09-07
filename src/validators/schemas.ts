import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const registrarUserSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
  role: z.enum(['ADMIN', 'MEDICO', 'RECEPCAO', 'PACIENTE']),
});

export const especialidadeSchema = z.object({
  nome: z.string().min(2),
  codigoCFM: z.string().optional(),
  descricao: z.string().optional(),
});

export const unidadeSchema = z.object({
  nome: z.string().min(2),
  cnpj: z.string().min(14),
  endereco: z.string().min(3),
  cidade: z.string().min(2),
  estado: z.string().length(2),
  cep: z.string().min(8),
  telefone: z.string().optional(),
});

export const medicoSchema = z.object({
  userId: z.string().uuid(),
  nomeCompleto: z.string().min(3),
  crm: z.string().min(3),
  ufCrm: z.string().length(2),
  cpf: z.string().min(11),
  telefone: z.string().optional(),
  dataNascimento: z.string().datetime().optional(),
  especialidadeIds: z.array(z.string().uuid()).min(1),
  unidadeIds: z.array(z.string().uuid()).min(1),
});

export const pacienteSchema = z.object({
  nomeCompleto: z.string().min(3),
  cpf: z.string().min(11),
  dataNascimento: z.string().datetime(),
  telefone: z.string().min(8),
  email: z.string().email().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  convenio: z.string().optional(),
  numeroCarteirinha: z.string().optional(),
});
