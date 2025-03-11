import { Router } from 'express';
import { createRequestDemo } from '../controllers/demoRequest';

const router = Router();

router.post('/request-demo', createRequestDemo);

export default router;