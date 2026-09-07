import { Router } from 'express';
import { login, registrar } from '../controllers/authController';
import { validar } from '../middleware/validate';
import { loginSchema, registrarUserSchema } from '../validators/schemas';

const router = Router();

router.post('/login', validar(loginSchema), login);
router.post('/registrar', validar(registrarUserSchema), registrar);

export default router;
