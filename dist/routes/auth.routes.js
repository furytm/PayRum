"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Import the middleware
const router = express_1.default.Router();
// Admin Signup Route
router.post('/signup', auth_controller_1.adminSignup);
// OTP Verification Route
router.post('/verify', auth_controller_1.verifyOTP);
router.post('/login', auth_controller_1.adminLogin);
// Protected Route
router.get('/protected', authMiddleware_1.verifyToken, (req, res) => {
    // Only accessible with a valid JWT token
    res.status(200).json({
        message: 'Access granted to protected route',
        user: req.user, // This is the user data decoded from the JWT token
    });
});
exports.default = router;
