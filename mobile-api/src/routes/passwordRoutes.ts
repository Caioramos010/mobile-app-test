import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import {
  getPasswords,
  savePassword,
  deletePassword,
  generatePasswordRoute,
} from '../controllers/passwordController';

const router = Router();

router.use(authMiddleware as any);

router.get('/generate', generatePasswordRoute as any);
router.get('/', getPasswords as any);
router.post('/', savePassword as any);
router.delete('/:id', deletePassword as any);

export default router;
