import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  setupAdmin
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  handleValidationErrors 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, handleValidationErrors, register);
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, resetPassword);
router.post('/setup-admin', setupAdmin);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, validateChangePassword, handleValidationErrors, changePassword);
router.post('/logout', authenticateToken, logout);

export default router;
