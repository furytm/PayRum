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
exports.login = exports.verifyOTPAndCreateToken = exports.signup = void 0;
const client_1 = require("../prisma/client"); // Prisma client
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const otpGenerator_1 = require("../utils/otpGenerator");
const emailSender_1 = require("../utils/emailSender");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Admin Service to handle business logic
const signup = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email already exists
    const existingAdmin = yield client_1.prisma.admin.findUnique({
        where: { email },
    });
    if (existingAdmin) {
        throw new Error('Admin with this email already exists');
    }
    // Generate OTP
    const otp = (0, otpGenerator_1.generateOTP)();
    yield (0, emailSender_1.sendOTPEmail)(email, otp);
    // Save admin in the database with hashed password and OTP
    yield client_1.prisma.admin.create({
        data: {
            email,
            password: yield bcryptjs_1.default.hash(password, 10), // Hash the password
            otp,
        },
    });
    return otp; // Return OTP for later comparison (you could store it temporarily in memory or DB)
});
exports.signup = signup;
const verifyOTPAndCreateToken = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield client_1.prisma.admin.findUnique({
        where: { email },
    });
    if (!admin) {
        throw new Error('Admin not found');
    }
    // Compare OTP received with the one stored in the database
    if (otp !== admin.otp) {
        throw new Error('Invalid OTP');
    }
    // OTP is valid, generate JWT token for admin
    const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Optionally, delete the OTP after successful verification
    yield client_1.prisma.admin.update({
        where: { email },
        data: { otp: null }, // Remove OTP from the admin record
    });
    return token; // Return the JWT token
});
exports.verifyOTPAndCreateToken = verifyOTPAndCreateToken;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Find admin by email
    const admin = yield client_1.prisma.admin.findUnique({
        where: { email },
    });
    if (!admin) {
        throw new Error('Admin not found');
    }
    // Compare password with hashed password stored in the database
    const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    // Generate JWT token for the logged-in admin
    const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token; // Return the JWT token
});
exports.login = login;
