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
exports.deleteEmployeeController = exports.getEmployeeByIdController = exports.getAllEmployeesController = exports.updateEmployeeController = exports.createEmployeeController = void 0;
const employee_service_1 = require("../services/employee.service");
const createEmployeeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // If the request body is not an array, wrap it in an array
    const employees = Array.isArray(req.body) ? req.body : [req.body];
    for (const employee of employees) {
        const { fullName, email, accountNumber, HireDate, grossPay, department, employmentType, jobTitle, bankName, } = employee;
        // Basic validation
        if (!fullName ||
            !email ||
            !accountNumber ||
            !HireDate ||
            !department ||
            !grossPay ||
            !employmentType ||
            !jobTitle ||
            !bankName) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
    }
    try {
        const newEmployees = yield (0, employee_service_1.createEmployee)(employees);
        res.status(201).json({
            message: "Employee created successfully",
            data: newEmployees,
        });
        console.log(newEmployees);
    }
    catch (error) {
        next(error);
    }
});
exports.createEmployeeController = createEmployeeController;
const updateEmployeeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const employee = yield (0, employee_service_1.updateEmployee)(Number(id), updateData);
        res.status(200).json({
            message: "Employee updated successfully",
            data: employee,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateEmployeeController = updateEmployeeController;
const getAllEmployeesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield (0, employee_service_1.getAllEmployees)();
        res.status(200).json({
            message: "Employees fetched successfully",
            data: employees,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllEmployeesController = getAllEmployeesController;
const getEmployeeByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const employee = yield (0, employee_service_1.getEmployeeById)(Number(id));
        res.status(200).json({
            message: "Employee fetched successfully",
            data: employee,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEmployeeByIdController = getEmployeeByIdController;
const deleteEmployeeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, employee_service_1.deleteEmployee)(Number(id));
        res.status(200).json({
            message: "Employee deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteEmployeeController = deleteEmployeeController;
