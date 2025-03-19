import { Router } from 'express';
import {
  addPayroll,
  getPayrollRecordById,
  getPayrollsForEmployee,
  getAllPayrollRecords,
  getPayrollSummaryController,
} from '../controllers/payroll.controller';
import { verifyAdmin } from '../middlewares/authMiddleware';


const router = Router();

// Protected routes - ensure only admin can access these endpoints
router.post('/', verifyAdmin, addPayroll);
router.get('/', verifyAdmin, getAllPayrollRecords);
router.get('/:id', verifyAdmin, getPayrollRecordById);
router.get('/summary', verifyAdmin, getPayrollSummaryController);
// Endpoint to get payroll records by employee id, e.g., /employee/1/payrolls
router.get('/employee/:employeeId', verifyAdmin, getPayrollsForEmployee);

export default router;