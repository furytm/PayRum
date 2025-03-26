"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payroll_controller_1 = require("../controllers/payroll.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/summary', authMiddleware_1.verifyAdmin, payroll_controller_1.getPayrollSummaryController);
// Endpoint to get payroll records by employee id, e.g., /employee/1/payrolls
router.get('/employee/:employeeId', authMiddleware_1.verifyAdmin, payroll_controller_1.getPayrollsForEmployee);
// Protected routes - ensure only admin can access these endpoints
router.get('/', authMiddleware_1.verifyAdmin, payroll_controller_1.getAllPayrollRecords);
router.get('/:id', authMiddleware_1.verifyAdmin, payroll_controller_1.getPayrollRecordById);
router.post('/', authMiddleware_1.verifyAdmin, payroll_controller_1.addPayroll);
exports.default = router;
