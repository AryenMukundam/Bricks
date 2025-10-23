import express from 'express'
const router = express.Router()
import {body} from 'express-validator'
import classController from '../controllers/class.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

router.post('/create' , authMiddleware.authInstructor , [
    body('className').notEmpty().withMessage('Class name is required').isLength({min:3 , max:20}).withMessage('Class name must be between 3 to 20 characters long'),
    body('batch').notEmpty().withMessage('Batch is required'),
    body('googleMeetLink').notEmpty().withMessage('Google meet link is required'),
    body('scheduledAt').notEmpty().withMessage('Scheduled date and time is required'),
    body('preReadLinks').optional().isArray().withMessage('Pre read links must be an array'),
    body('preReadLinks.*.title').notEmpty().withMessage('Link title is required'),
    body('preReadLinks.*.url').notEmpty().withMessage('Link URL is required'),
    body('duration').optional().isInt({ min: 15, max: 300 }).withMessage('Duration must be between 15 and 300 minutes'),
], classController.createClass);

router.get('/instructor/classes' , authMiddleware.authInstructor , classController.getInstructorClasses);

router.get('/instructor/class/:classId/statistics' , authMiddleware.authInstructor , classController.getClassStatistics);

router.put('/instructor/class/:classId' , authMiddleware.authInstructor , [
    body('className').optional().isLength({min:3 , max:20}).withMessage('Class name must be between 3 to 20 characters long'),
    body('googleMeetLink').optional(),
    body('scheduledAt').optional(),
    body('duration').optional().isInt({ min: 15, max: 300 }).withMessage('Duration must be between 15 and 300 minutes'),
], classController.updateClass);

router.delete('/instructor/class/:classId' , authMiddleware.authInstructor , classController.deleteClass);

router.get('/student/classes' , authMiddleware.authStudent , classController.getStudentClasses);

router.post('/student/class/:classId/attend' , authMiddleware.authStudent , classController.recordAttendance);

router.get('/class/:classId' , async(req , res , next)=>{
    // Try student auth first, then instructor auth
    authMiddleware.authStudent(req, res, (err) => {
        if (err || !req.student) {
            authMiddleware.authInstructor(req, res, next);
        } else {
            next();
        }
    });
},
    classController.getClassById
);

export default router