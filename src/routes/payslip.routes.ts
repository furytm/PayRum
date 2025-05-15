import express from 'express';
import { exportPayrollsCSV, exportPayrollsPDF, getPayslipController, getPayslipPDFController, getPayslipCSVController, getAllPayslipsController, sendAllPayslipsController, sendPayslipByIdController } from '../controllers/payslip.controller';
import { verifyAdmin } from '../middlewares/authMiddleware';


const router = express.Router();

router.get('/', verifyAdmin, getAllPayslipsController);
router.get("/pdf/:payrollId", verifyAdmin, getPayslipPDFController);
router.get("/csv/:payrollId", verifyAdmin, getPayslipCSVController);
router.post('/send/:id', verifyAdmin, sendPayslipByIdController);
router.post('/send-all', verifyAdmin, sendAllPayslipsController);



router.get('/exportcsv', verifyAdmin, exportPayrollsCSV);
router.get('/exportpdf', verifyAdmin, exportPayrollsPDF);

router.get('/:payrollId/payslip', getPayslipController);
export default router;