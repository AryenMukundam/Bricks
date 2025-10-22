import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import instructorController from '../controllers/instructor.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

router.post('/login' , [
    body('instructorId').isLength({min:3 , max:20}).withMessage('Instructor ID must be between 3 to 20 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],
    instructorController.login
)

router.get('/profile' , authMiddleware.authInstructor , instructorController.getProfile);
router.get('/logout' , authMiddleware.authInstructor , instructorController.logout);

export default router;