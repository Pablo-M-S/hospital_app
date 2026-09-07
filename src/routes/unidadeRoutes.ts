import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as controller from '../controllers/unidadeController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { unidadeSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);

router.get('/', asyncHandler(controller.listar));
router.get('/:id', asyncHandler(controller.buscarPorId));

router.post(
  '/',
  autorizar('ADMIN'),
  validar(unidadeSchema),
  registrarAuditoria('CRIAR_UNIDADE', 'Unidade'),
  asyncHandler(controller.criar)
);

router.put(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('ATUALIZAR_UNIDADE', 'Unidade'),
  asyncHandler(controller.atualizar)
);

router.delete(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('DESATIVAR_UNIDADE', 'Unidade'),
  asyncHandler(controller.desativar)
);

export default router;
