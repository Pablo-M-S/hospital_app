import { Router } from 'express';
import * as controller from '../controllers/consultaController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { consultaSchema, atualizarStatusConsultaSchema } from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';

const router = Router();

router.use(autenticar);
router.use(autorizar('ADMIN', 'RECEPCAO', 'MEDICO'));

router.get('/', asyncHandler(controller.listar));
router.get('/:id', asyncHandler(controller.buscarPorId));

router.post(
  '/',
  autorizar('ADMIN', 'RECEPCAO'),
  validar(consultaSchema),
  registrarAuditoria('MARCAR_CONSULTA', 'Consulta'),
  asyncHandler(controller.marcar)
);

router.patch(
  '/:id/reagendar',
  autorizar('ADMIN', 'RECEPCAO'),
  validar(z.object({ dataHora: z.string().datetime() })),
  registrarAuditoria('REAGENDAR_CONSULTA', 'Consulta'),
  asyncHandler(controller.reagendar)
);

router.patch(
  '/:id/status',
  validar(atualizarStatusConsultaSchema),
  registrarAuditoria('ATUALIZAR_STATUS_CONSULTA', 'Consulta'),
  asyncHandler(controller.atualizarStatus)
);

export default router;
