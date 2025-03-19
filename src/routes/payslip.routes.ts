import express from 'express';
import { getPayslipController } from '../controllers/payslip.controller';


const router = express.Router();

router.get('/:payrollId/payslip', getPayslipController);

export default router;