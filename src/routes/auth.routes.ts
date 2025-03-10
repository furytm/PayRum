import express from 'express';
import { adminLogin, adminSignup, verifyOTP } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/authMiddleware'; // Import the middleware

const router = express.Router();

// Admin Signup Route
router.post('/signup', adminSignup);

// OTP Verification Route
router.post('/verify', verifyOTP);

router.post('/login', adminLogin);

// Protected Route
router.get('/protected', verifyToken, (req, res) => {
    // Only accessible with a valid JWT token
    res.status(200).json({
      message: 'Access granted to protected route',
      user: req.user, // This is the user data decoded from the JWT token
    });
  });
  

export default router;
