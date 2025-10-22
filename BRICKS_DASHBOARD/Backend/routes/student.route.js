import express from 'express';
const router = express.Router();
import studentController from '../controllers/student.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import {body} from 'express-validator';

router.post('/login' , [
    body('enrollmentNumber').isLength({min:5 , max:20}).withMessage('Enrollment number must be between 5 to 20 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],
    studentController.login
)

router.post('/request-password-change-otp' , [
    body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required'),
    body('tempToken').notEmpty().withMessage('Temporary token is required')
], studentController.requestPasswordChangeOTP
)

router.post('/verify-otp-change-password' , [
    body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required'),
    body('otp').isLength({min:6 , max:6}).withMessage('OTP must be 6 characters long'),
    body('newPassword').isLength({min:6}).withMessage('New password must be at least 6 characters long'),
    body('tempToken').notEmpty().withMessage('Temporary token is required')
], studentController.verifyOTPAndChangePassword
)

router.post('/forgot-password' , [
    body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required'),
    body('email').isEmail().withMessage('Valid email is required')
], studentController.forgotPassword
)

router.post('/reset-password' , [
    body('enrollmentNumber').notEmpty().withMessage('Enrollment number is required'),
    body('otp').isLength({min:6 , max:6}).withMessage('OTP must be 6 characters long'),
    body('newPassword').isLength({min:6}).withMessage('New password must be at least 6 characters long')
], studentController.resetPassword
)


router.get('/profile' , authMiddleware.authStudent , studentController.getProfile);
router.get('/logout' , authMiddleware.authStudent , studentController.logout);

export default router;