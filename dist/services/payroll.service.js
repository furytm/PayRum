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
exports.getPayrollSummary = exports.getAllPayrolls = exports.getPayrollsByEmployee = exports.getPayrollById = exports.createPayroll = void 0;
const client_1 = require("../prisma/client");
const createPayroll = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the employee exists and retrieve grossPay
    const employee = yield client_1.prisma.employee.findUnique({
        where: { id: employeeId },
        select: { grossPay: true } // Fetch only the grossPay field
    });
    if (!employee) {
        throw new Error('Employee not found');
    }
    const { grossPay } = employee; // Use the employee's grossPay
    // Define deduction rates (percentages)
    const taxRate = 10; // 10%
    const pensionRate = 5; // 5%
    const nhisRate = 2; // 2%
    const commissionRate = 2; // 2%
    // Calculate deductions
    const tax = (taxRate / 100) * grossPay;
    const pension = (pensionRate / 100) * grossPay;
    const nhis = (nhisRate / 100) * grossPay;
    const commission = (commissionRate / 100) * grossPay;
    const deductions = tax + pension + nhis;
    const netPay = grossPay - deductions + commission;
    // Create payroll entry
    const payroll = yield client_1.prisma.payroll.create({
        data: {
            employeeId,
            grossPay,
            tax,
            pension,
            nhis,
            commission,
            netPay,
            payslip: JSON.stringify({ grossPay, tax, pension, nhis, commission, netPay }),
        },
    });
    return payroll;
});
exports.createPayroll = createPayroll;
const getPayrollById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getPayrollById called with id:", id);
    const payroll = yield client_1.prisma.payroll.findUnique({
        where: { id },
        include: { employee: true }, // Optionally include employee details
    });
    if (!payroll) {
        throw new Error('Payroll record not found');
    }
    return payroll;
});
exports.getPayrollById = getPayrollById;
const getPayrollsByEmployee = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the employee exists (optional, based on your business rules)
    const employee = yield client_1.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
        throw new Error('Employee not found');
    }
    const payrolls = yield client_1.prisma.payroll.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
    });
    return payrolls;
});
exports.getPayrollsByEmployee = getPayrollsByEmployee;
const getAllPayrolls = () => __awaiter(void 0, void 0, void 0, function* () {
    const payrolls = yield client_1.prisma.payroll.findMany({
        include: { employee: true }, // Optionally include employee details
        orderBy: { createdAt: 'desc' },
    });
    // Map each payroll record to add a computed "deductions" field
    const payrollsWithDeductions = payrolls.map(payroll => (Object.assign(Object.assign({}, payroll), { deductions: payroll.tax + payroll.pension + payroll.nhis, employeeFullName: payroll.employee.fullName })));
    return payrollsWithDeductions;
});
exports.getAllPayrolls = getAllPayrolls;
const getPayrollSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const payrolls = yield client_1.prisma.payroll.findMany();
    const summary = payrolls.reduce((acc, payroll) => {
        acc.totalGross += payroll.grossPay;
        acc.totalTax += payroll.tax;
        acc.totalPension += payroll.pension;
        acc.totalNhis += payroll.nhis;
        acc.totalCommission += payroll.commission || 0;
        acc.totalNet += payroll.netPay;
        return acc;
    }, {
        totalGross: 0,
        totalTax: 0,
        totalPension: 0,
        totalNhis: 0,
        totalCommission: 0,
        totalNet: 0,
    });
    return summary;
});
exports.getPayrollSummary = getPayrollSummary;
