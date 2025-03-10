"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to protect routes by verifying JWT
const verifyToken = (req, res, next) => {
    var _a;
    // Get the token from the Authorization header (bearer token)
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Format: "Bearer <token>"
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    // Verify the token using JWT secret
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        // If the token is valid, attach the decoded payload (user info) to the request
        req.user = decoded; // You can attach any user data you want here
        next(); // Move to the next middleware or route handler
    });
};
exports.verifyToken = verifyToken;
