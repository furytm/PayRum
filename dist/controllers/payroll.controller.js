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
exports.getPayrollSummaryController = exports.getAllPayrollRecords = exports.getPayrollsForEmployee = exports.getPayrollRecordById = exports.addPayroll = void 0;
const payroll_service_1 = require("../services/payroll.service");
const addPayroll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.body;
        const payroll = yield (0, payroll_service_1.createPayroll)(employeeId);
        res.status(201).json({ success: true, payroll });
    }
    catch (error) {
        next(error);
    }
});
exports.addPayroll = addPayroll;
const getPayrollRecordById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payroll = yield (0, payroll_service_1.getPayrollById)(Number(id));
        res.status(200).json({ success: true, payroll });
    }
    catch (error) {
        next(error);
    }
});
exports.getPayrollRecordById = getPayrollRecordById;
const getPayrollsForEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.params;
        const payrolls = yield (0, payroll_service_1.getPayrollsByEmployee)(Number(employeeId));
        res.status(200).json({ success: true, payrolls });
    }
    catch (error) {
        next(error);
    }
});
exports.getPayrollsForEmployee = getPayrollsForEmployee;
const getAllPayrollRecords = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payrolls = yield (0, payroll_service_1.getAllPayrolls)();
        res.status(200).json({ success: true, payrolls });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPayrollRecords = getAllPayrollRecords;
// NEW: Payroll Summary Endpoint
const getPayrollSummaryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield (0, payroll_service_1.getPayrollSummary)();
        res.status(200).json({ success: true, summary });
    }
    catch (error) {
        next(error);
    }
});
exports.getPayrollSummaryController = getPayrollSummaryController;
