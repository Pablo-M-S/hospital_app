import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as controller from '../controllers/medicoController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { medicoSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);

router.get('/', asyncHandler(controller.listar));
router.get('/:id', asyncHandler(controller.buscarPorId));

router.post(
  '/',
  autorizar('ADMIN'),
  validar(medicoSchema),
  registrarAuditoria('CRIAR_MEDICO', 'Medico'),
  asyncHandler(controller.criar)
);

router.put(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('ATUALIZAR_MEDICO', 'Medico'),
  asyncHandler(controller.atualizar)
);

router.delete(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('DESATIVAR_MEDICO', 'Medico'),
  asyncHandler(controller.desativar)
);

export default router;
