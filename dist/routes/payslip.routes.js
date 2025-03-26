"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payslip_controller_1 = require("../controllers/payslip.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/exportcsv', authMiddleware_1.verifyAdmin, payslip_controller_1.exportPayrollsCSV);
router.get('/exportpdf', authMiddleware_1.verifyAdmin, payslip_controller_1.exportPayrollsPDF);
router.get('/:payrollId/payslip', payslip_controller_1.getPayslipController);
exports.default = router;
