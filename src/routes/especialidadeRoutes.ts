import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as controller from '../controllers/especialidadeController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { especialidadeSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);

router.get('/', asyncHandler(controller.listar));
router.get('/:id', asyncHandler(controller.buscarPorId));

router.post(
  '/',
  autorizar('ADMIN'),
  validar(especialidadeSchema),
  registrarAuditoria('CRIAR_ESPECIALIDADE', 'Especialidade'),
  asyncHandler(controller.criar)
);

router.put(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('ATUALIZAR_ESPECIALIDADE', 'Especialidade'),
  asyncHandler(controller.atualizar)
);

router.delete(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('DESATIVAR_ESPECIALIDADE', 'Especialidade'),
  asyncHandler(controller.desativar)
);

export default router;
