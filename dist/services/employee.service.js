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
exports.deleteEmployee = exports.getEmployeeById = exports.getAllEmployees = exports.updateEmployee = exports.createEmployee = void 0;
const client_1 = require("../prisma/client");
const uuid_1 = require("uuid");
const createEmployee = (employeeData) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure employeeData is always an array
    const employees = Array.isArray(employeeData) ? employeeData : [employeeData];
    if (!employees.length)
        throw new Error("No employee data provided.");
    const emails = employees.map((employee) => employee.email);
    // Find existing employees by email
    const existingEmployees = yield client_1.prisma.employee.findMany({
        where: { email: { in: emails } },
        select: { email: true },
    });
    const existingEmailsSet = new Set(existingEmployees.map((e) => e.email));
    // Filter new employees to avoid duplicates
    const newEmployees = employees.filter(employee => !existingEmailsSet.has(employee.email));
    if (!newEmployees.length) {
        throw new Error("All provided employees already exist in the database.");
    }
    // Insert employees one by one to return their IDs
    const createdEmployees = [];
    for (const employee of newEmployees) {
        const newEmployee = yield client_1.prisma.employee.create({
            data: Object.assign(Object.assign({}, employee), { autoId: (0, uuid_1.v4)().slice(0, 8) }),
        });
        createdEmployees.push(newEmployee);
    }
    return createdEmployees;
});
exports.createEmployee = createEmployee;
const updateEmployee = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield client_1.prisma.employee.findUnique({
        where: { id },
    });
    if (!employee) {
        throw new Error('Employee not found');
    }
    // If email is being updated, ensure uniqueness
    if (updateData.email && updateData.email !== employee.email) {
        const existingEmployee = yield client_1.prisma.employee.findUnique({
            where: { email: updateData.email },
        });
        if (existingEmployee) {
            throw new Error('Employee with this email already exists');
        }
    }
    return yield client_1.prisma.employee.update({
        where: { id },
        data: updateData,
    });
});
exports.updateEmployee = updateEmployee;
const getAllEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.prisma.employee.findMany();
});
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield client_1.prisma.employee.findUnique({
        where: { id },
    });
    if (!employee) {
        throw new Error('Employee not found');
    }
    return employee;
});
exports.getEmployeeById = getEmployeeById;
const deleteEmployee = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if employee exists before deleting
    const employee = yield client_1.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
        throw new Error('Employee not found');
    }
    return yield client_1.prisma.employee.delete({
        where: { id },
    });
});
exports.deleteEmployee = deleteEmployee;
