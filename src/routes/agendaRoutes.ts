import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as controller from '../controllers/agendaController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { agendaSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);

router.get('/disponibilidade', asyncHandler(controller.disponibilidade));
router.get('/', asyncHandler(controller.listar));

router.post(
  '/',
  autorizar('ADMIN'),
  validar(agendaSchema),
  registrarAuditoria('CRIAR_AGENDA', 'Agenda'),
  asyncHandler(controller.criar)
);

router.put(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('ATUALIZAR_AGENDA', 'Agenda'),
  asyncHandler(controller.atualizar)
);

router.delete(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('DESATIVAR_AGENDA', 'Agenda'),
  asyncHandler(controller.desativar)
);

export default router;
