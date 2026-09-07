import { Router } from 'express';
import { login, registrar } from '../controllers/authController';
import { validar } from '../middleware/validate';
import { loginSchema, registrarUserSchema } from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/login', validar(loginSchema), asyncHandler(login));
router.post('/registrar', validar(registrarUserSchema), asyncHandler(registrar));

export default router;
