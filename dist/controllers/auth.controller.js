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
exports.verifyOTP = exports.adminLogin = exports.adminSignup = void 0;
const admin_service_1 = require("../services/admin.service");
// Admin Signup Route
const adminSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Call service method to handle signup logic
        const otp = yield (0, admin_service_1.signup)(email, password);
        res.status(200).json({
            message: 'OTP sent to email. Please check your inbox.',
            otp, // You might not want to return OTP directly in a real-world scenario
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminSignup = adminSignup;
// Admin Login Route
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Call service method to handle login logic
        const token = yield (0, admin_service_1.login)(email, password);
        res.status(200).json({
            message: 'Login successful',
            token, // JWT token returned after successful login
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogin = adminLogin;
// OTP Verification Route
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        // Call service method to handle OTP verification and JWT generation
        const token = yield (0, admin_service_1.verifyOTPAndCreateToken)(email, otp);
        res.status(200).json({
            message: 'OTP verified successfully',
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOTP = verifyOTP;
