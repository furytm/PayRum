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
exports.createRequestDemo = void 0;
const demoRequest_1 = require("../services/demoRequest");
const createRequestDemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, workEmail, companyName, phoneNumber, companyRole, employeeHeadcount, preferredContact, } = req.body;
        // Validate required fields
        if (!firstName || !lastName || !workEmail || !companyName || !phoneNumber || !companyRole || !employeeHeadcount) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Convert employeeHeadcount to an integer
        const headcount = parseInt(employeeHeadcount, 10);
        if (isNaN(headcount)) {
            res.status(400).json({ message: 'Invalid employeeHeadcount. Must be a number.' });
            return;
        }
        // Convert preferredContact to boolean (true = phone, false = email)
        const isPhonePreferred = preferredContact === 'phone';
        const demoRequest = yield demoRequest_1.RequestDemoService.createRequestDemo(firstName, lastName, workEmail, companyName, phoneNumber, companyRole, employeeHeadcount, isPhonePreferred);
        res.status(201).json({ message: 'Demo request submitted successfully', data: demoRequest });
    }
    catch (error) {
        next(error);
    }
});
exports.createRequestDemo = createRequestDemo;
