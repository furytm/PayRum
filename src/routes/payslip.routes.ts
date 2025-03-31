import express from 'express';
import { exportPayrollsCSV, exportPayrollsPDF, getPayslipController, getPayslipPDFController, getPayslipCSVController } from '../controllers/payslip.controller';
import { verifyAdmin } from '../middlewares/authMiddleware';


const router = express.Router();


router.get("/pdf/:payrollId", verifyAdmin, getPayslipPDFController);
router.get("/csv/:payrollId", verifyAdmin, getPayslipCSVController);


router.get('/exportcsv', verifyAdmin, exportPayrollsCSV);
router.get('/exportpdf', verifyAdmin, exportPayrollsPDF);

router.get('/:payrollId/payslip', getPayslipController);
export default router;