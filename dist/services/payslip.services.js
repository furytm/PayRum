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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePayrollsPDFBuffer = exports.generatePayrollsCSV = exports.getPayslip = void 0;
// import PDFDocument from "pdfkit";
const PDFDocument = require("pdfkit-table");
const client_1 = require("../prisma/client");
const json2csv_1 = require("json2csv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// import "pdfkit-table";
const getPayslip = (payrollId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch payroll details with related employee
    const payroll = yield client_1.prisma.payroll.findUnique({
        where: { id: payrollId },
        include: { employee: true }, // Include employee details
    });
    if (!payroll) {
        throw new Error("Payroll record not found");
    }
    // Format payslip response
    const payslip = {
        employee: {
            fullName: payroll.employee.fullName,
            jobTitle: payroll.employee.jobTitle,
            department: payroll.employee.department,
            bankName: payroll.employee.bankName,
            accountNumber: payroll.employee.accountNumber,
        },
        payroll: {
            grossPay: payroll.grossPay,
            deductions: {
                tax: payroll.tax,
                pension: payroll.pension,
                nhis: payroll.nhis,
                commission: payroll.commission || 0,
            },
            netPay: payroll.netPay,
        },
    };
    return payslip;
});
exports.getPayslip = getPayslip;
const generatePayrollsCSV = () => __awaiter(void 0, void 0, void 0, function* () {
    const payrolls = yield client_1.prisma.payroll.findMany({
        include: { employee: true },
        orderBy: { createdAt: "desc" },
    });
    const fields = [
        "emoloyeeId",
        "employeeFullName",
        "grossPay",
        "tax",
        "pension",
        "nhis",
        "commission",
        "netPay",
        "payslip",
        "createdAt",
    ];
    const formattedPayrolls = payrolls.map((p) => {
        var _a, _b, _c;
        return ({
            employeeID: ((_b = (_a = p.employee) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString()) || "N/A",
            employeeFullName: ((_c = p.employee) === null || _c === void 0 ? void 0 : _c.fullName) || "N/A", // Get full name, or "N/A" if missing
            grossPay: p.grossPay.toFixed(2),
            tax: p.tax.toFixed(2),
            pension: p.pension.toFixed(2),
            nhis: p.nhis.toFixed(2),
            commission: (p.commission || 0).toFixed(2),
            netPay: p.netPay.toFixed(2),
            payslip: p.payslip,
            createdAt: p.createdAt.toISOString(),
        });
    });
    const json2csvParser = new json2csv_1.Parser({ fields });
    const csv = json2csvParser.parse(formattedPayrolls);
    return csv;
});
exports.generatePayrollsCSV = generatePayrollsCSV;
const generatePayrollsPDFBuffer = () => __awaiter(void 0, void 0, void 0, function* () {
    const payrolls = yield client_1.prisma.payroll.findMany({
        include: { employee: true },
        orderBy: { createdAt: "desc" },
    });
    // const doc = new PDFDocument({ size: "A4", margin: 50 });
    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => { });
    const logoPath = path_1.default.join(__dirname, "..", "assets", "paysum.jpg");
    if (!fs_1.default.existsSync(logoPath)) {
        throw new Error("Logo file not found");
    }
    doc.image(logoPath, 50, 45, { width: 100, height: 50 });
    doc.fontSize(18).text("PAYSUM", 50, 100, { align: "right" });
    doc
        .fontSize(10)
        .text("GENESYS TECHHUB,ENUGU,NIGERIA", 50, 120, { align: "right" });
    doc.moveDown(2);
    // Title
    doc.fontSize(18).text("Payroll Summary", { align: "center" });
    doc.moveDown();
    const table = {
        headers: [
            "EmployeeID",
            "Name",
            "GrossPay",
            "Tax",
            "Pension",
            "NHIS",
            "Commission",
            "NetPay",
        ], rows: payrolls.map((p) => {
            var _a, _b;
            return [
                ((_a = p.employeeId) === null || _a === void 0 ? void 0 : _a.toString()) || "N/A",
                ((_b = p.employee) === null || _b === void 0 ? void 0 : _b.fullName) || "N/A",
                p.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                p.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                p.pension.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                p.nhis.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                (p.commission || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                p.netPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            ];
        }),
    };
    console.log("doc.table exists:", typeof doc.table); // Check if table function exists
    yield doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: () => doc.font("Helvetica").fontSize(10),
        width: 500,
    });
    doc.end();
    return new Promise((resolve, reject) => {
        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });
        doc.on("error", reject);
    });
});
exports.generatePayrollsPDFBuffer = generatePayrollsPDFBuffer;
