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
exports.RequestDemoService = void 0;
const client_1 = require("../prisma/client");
exports.RequestDemoService = {
    createRequestDemo(firstName, lastName, workEmail, companyName, phoneNumber, companyRole, employeeHeadcount, preferredContact) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.prisma.requestDemo.create({
                data: {
                    firstName,
                    lastName,
                    workEmail,
                    companyName,
                    phoneNumber,
                    companyRole,
                    employeeHeadcount,
                    preferredContact,
                },
            });
        });
    },
};
