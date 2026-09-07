import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ESPECIALIDADES_CFM = [
  'Acupuntura',
  'Alergia e Imunologia',
  'Anestesiologia',
  'Angiologia',
  'Cardiologia',
  'Cirurgia Cardiovascular',
  'Cirurgia da Mão',
  'Cirurgia de Cabeça e Pescoço',
  'Cirurgia do Aparelho Digestivo',
  'Cirurgia Geral',
  'Cirurgia Oncológica',
  'Cirurgia Pediátrica',
  'Cirurgia Plástica',
  'Cirurgia Torácica',
  'Cirurgia Vascular',
  'Clínica Médica',
  'Coloproctologia',
  'Dermatologia',
  'Endocrinologia e Metabologia',
  'Endoscopia',
  'Gastroenterologia',
  'Genética Médica',
  'Geriatria',
  'Ginecologia e Obstetrícia',
  'Hematologia e Hemoterapia',
  'Homeopatia',
  'Infectologia',
  'Mastologia',
  'Medicina de Emergência',
  'Medicina de Família e Comunidade',
  'Medicina de Tráfego',
  'Medicina do Trabalho',
  'Medicina Esportiva',
  'Medicina Física e Reabilitação',
  'Medicina Intensiva',
  'Medicina Legal e Perícia Médica',
  'Medicina Nuclear',
  'Medicina Preventiva e Social',
  'Nefrologia',
  'Neurocirurgia',
  'Neurologia',
  'Nutrologia',
  'Oftalmologia',
  'Oncologia Clínica',
  'Ortopedia e Traumatologia',
  'Otorrinolaringologia',
  'Patologia',
  'Patologia Clínica/Medicina Laboratorial',
  'Pediatria',
  'Pneumologia',
  'Psiquiatria',
  'Radiologia e Diagnóstico por Imagem',
  'Radioterapia',
  'Reumatologia',
  'Urologia',
];

async function semearEspecialidades() {
  for (const nome of ESPECIALIDADES_CFM) {
    await prisma.especialidade.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }
  console.log(`${ESPECIALIDADES_CFM.length} especialidades garantidas no banco.`);
}

async function semearAdmin() {
  const emailAdmin = process.env.SEED_ADMIN_EMAIL ?? 'admin@hospital-app.local';
  const senhaAdmin = process.env.SEED_ADMIN_PASSWORD ?? 'TrocarNoPrimeiroAcesso123';

  const jaExiste = await prisma.user.findUnique({ where: { email: emailAdmin } });

  if (jaExiste) {
    console.log('Usuário admin já existe, seed de usuário ignorado.');
    return;
  }

  const passwordHash = await bcrypt.hash(senhaAdmin, 10);

  await prisma.user.create({
    data: { email: emailAdmin, passwordHash, role: 'ADMIN' },
  });

  console.log(`Usuário admin criado: ${emailAdmin}`);
  console.log('Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD nas variáveis de ambiente para evitar a senha padrão.');
}

async function main() {
  await semearEspecialidades();
  await semearAdmin();
}

main()
  .catch((erro) => {
    console.error('Falha ao rodar o seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
