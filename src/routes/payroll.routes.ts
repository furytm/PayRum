import { Router } from 'express';
import {
  addPayroll,
  getPayrollRecordById,
  getPayrollsForEmployee,
  getAllPayrollRecords,
  getPayrollSummaryController,
  deletePayrollController,
} from '../controllers/payroll.controller';
import { verifyAdmin } from '../middlewares/authMiddleware';
import { getAllPayslipsController } from '../controllers/payslip.controller';


const router = Router();
router.get('/summary', verifyAdmin, getPayrollSummaryController);
// Endpoint to get payroll records by employee id, e.g., /employee/1/payrolls
router.get('/employee/:employeeId', verifyAdmin, getPayrollsForEmployee);
// Admin-only route to get payslip summaries


// Protected routes - ensure only admin can access these endpoints

router.get('/', verifyAdmin, getAllPayrollRecords);
router.get('/:id', verifyAdmin, getPayrollRecordById);
router.post('/', verifyAdmin, addPayroll);
router.delete('/:id',verifyAdmin, deletePayrollController);

export default router;