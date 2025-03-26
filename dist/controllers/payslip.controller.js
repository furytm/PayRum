"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPayrollsPDF = exports.exportPayrollsCSV = exports.getPayslipController = void 0;
const payslip_services_1 = require("../services/payslip.services");
const getPayslipController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { payrollId } = req.params;
        const payslip = yield (0, payslip_services_1.getPayslip)(Number(payrollId));
        res.status(200).json({ success: true, payslip });
    }
    catch (error) {
        next(error);
    }
});
exports.getPayslipController = getPayslipController;
// CSV Export Controller
const exportPayrollsCSV = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const csv = yield (0, payslip_services_1.generatePayrollsCSV)();
        res.header('Content-Type', 'text/csv');
        res.attachment('payrolls.csv');
        res.send(csv);
    }
    catch (error) {
        next(error);
    }
});
exports.exportPayrollsCSV = exportPayrollsCSV;
// PDF Export Controller
const exportPayrollsPDF = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfBuffer = yield (0, payslip_services_1.generatePayrollsPDFBuffer)();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="payrolls.pdf"');
        res.send(pdfBuffer);
    }
    catch (error) {
        next(error);
    }
});
exports.exportPayrollsPDF = exportPayrollsPDF;
