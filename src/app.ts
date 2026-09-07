import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes';
import especialidadeRoutes from './routes/especialidadeRoutes';
import unidadeRoutes from './routes/unidadeRoutes';
import medicoRoutes from './routes/medicoRoutes';
import pacienteRoutes from './routes/pacienteRoutes';
import agendaRoutes from './routes/agendaRoutes';
import consultaRoutes from './routes/consultaRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/especialidades', especialidadeRoutes);
app.use('/api/unidades', unidadeRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/agendas', agendaRoutes);
app.use('/api/consultas', consultaRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(errorHandler);

export default app;
