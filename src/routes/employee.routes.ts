import { Router } from 'express';
import {
  createEmployeeController,
  updateEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  deleteEmployeeController,
} from '../controllers/employee.controller';
import { verifyToken } from '../middlewares/authMiddleware'; // Ensure JWT middleware is implemented

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

export default router;
