"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Ensure JWT middleware is implemented
const router = (0, express_1.Router)();
// Protect all employee routes
router.use(authMiddleware_1.verifyToken);
// Create a new employee
router.post('/', employee_controller_1.createEmployeeController);
// Get all employees
router.get('/', employee_controller_1.getAllEmployeesController);
// Get employee by ID
router.get('/:id', employee_controller_1.getEmployeeByIdController);
// Update employee (partial update using PATCH)
router.patch('/:id', employee_controller_1.updateEmployeeController);
// Delete employee
router.delete('/:id', employee_controller_1.deleteEmployeeController);
exports.default = router;
