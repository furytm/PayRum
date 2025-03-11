import { Router } from 'express';
import { createRequestDemo } from '../controllers/demoRequest';

const router = Router();

router.post('/', createRequestDemo);

export default router;