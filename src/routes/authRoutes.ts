import { Router } from 'express';
import { login, registrar } from '../controllers/authController';
import { validar } from '../middleware/validate';
import { loginSchema, registrarUserSchema } from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';
import { autenticar, autorizar } from '../middleware/auth';

const router = Router();

router.post('/login', validar(loginSchema), asyncHandler(login));

router.post(
  '/registrar',
  autenticar,
  autorizar('ADMIN'),
  validar(registrarUserSchema),
  asyncHandler(registrar)
);

export default router;
