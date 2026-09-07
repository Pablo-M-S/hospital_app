import { Router } from 'express';
import * as controller from '../controllers/medicoController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { medicoSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);

router.post(
  '/',
  autorizar('ADMIN'),
  validar(medicoSchema),
  registrarAuditoria('CRIAR_MEDICO', 'Medico'),
  controller.criar
);

router.put(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('ATUALIZAR_MEDICO', 'Medico'),
  controller.atualizar
);

router.delete(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('DESATIVAR_MEDICO', 'Medico'),
  controller.desativar
);

export default router;
