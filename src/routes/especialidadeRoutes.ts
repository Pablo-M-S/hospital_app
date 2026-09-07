import { Router } from 'express';
import * as controller from '../controllers/especialidadeController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { especialidadeSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);

router.post(
  '/',
  autorizar('ADMIN'),
  validar(especialidadeSchema),
  registrarAuditoria('CRIAR_ESPECIALIDADE', 'Especialidade'),
  controller.criar
);

router.put(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('ATUALIZAR_ESPECIALIDADE', 'Especialidade'),
  controller.atualizar
);

router.delete(
  '/:id',
  autorizar('ADMIN'),
  registrarAuditoria('DESATIVAR_ESPECIALIDADE', 'Especialidade'),
  controller.desativar
);

export default router;
