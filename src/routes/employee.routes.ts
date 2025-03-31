import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import {
  createEmployeeController,
  updateEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  deleteEmployeeController,
  importEmployeesController
} from '../controllers/employee.controller';
import { verifyToken } from '../middlewares/authMiddleware'; // Ensure JWT middleware is implemented
import { verifyAdmin } from '../middlewares/authMiddleware';


const router = Router();

// Protect all employee routes
router.use(verifyToken);

// Create a new employee
router.post('/', createEmployeeController);

// Get all employees
router.get('/', getAllEmployeesController);

// Get employee by ID
router.get('/:id', getEmployeeByIdController);

// Update employee (partial update using PATCH)
router.patch('/:id', updateEmployeeController);

// Delete employee
router.delete('/:id', deleteEmployeeController);

// Endpoint to import employees via CSV
router.post('/import', verifyAdmin, upload.single('file'), importEmployeesController);


export default router;
