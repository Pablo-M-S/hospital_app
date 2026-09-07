import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as controller from '../controllers/pacienteController';
import { autenticar, autorizar } from '../middleware/auth';
import { validar } from '../middleware/validate';
import { registrarAuditoria } from '../middleware/audit';
import { pacienteSchema } from '../validators/schemas';

const router = Router();

router.use(autenticar);
router.use(autorizar('ADMIN', 'RECEPCAO', 'MEDICO'));

router.get('/', registrarAuditoria('LISTAR_PACIENTES', 'Paciente'), asyncHandler(controller.listar));
router.get('/:id', registrarAuditoria('VISUALIZAR_PACIENTE', 'Paciente'), asyncHandler(controller.buscarPorId));

router.post(
  '/',
  autorizar('ADMIN', 'RECEPCAO'),
  validar(pacienteSchema),
  registrarAuditoria('CRIAR_PACIENTE', 'Paciente'),
  asyncHandler(controller.criar)
);

router.put(
  '/:id',
  autorizar('ADMIN', 'RECEPCAO'),
  registrarAuditoria('ATUALIZAR_PACIENTE', 'Paciente'),
  asyncHandler(controller.atualizar)
);

export default router;
