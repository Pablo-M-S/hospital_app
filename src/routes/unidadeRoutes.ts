import { Router } from 'express';
import * as controller from '../controllers/unidadeController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { unidadeSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);

router.post(
  '/',
  autorizar('ADMIN'),
  validar(unidadeSchema),
  registrarAuditoria('CRIAR_UNIDADE', 'Unidade'),
  controller.criar
);

router.put(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('ATUALIZAR_UNIDADE', 'Unidade'),
  controller.atualizar
);

router.delete(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('DESATIVAR_UNIDADE', 'Unidade'),
  controller.desativar
);

export default router;
