import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import assignmentController from '../controllers/assignment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';


router.post('/instructor/create', authMiddleware.authInstructor, [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('batch').notEmpty().withMessage('Batch is required'),
    body('assignmentType')
        .notEmpty().withMessage('Assignment type is required')
        .isIn(['mcq', 'multiple_correct', 'text', 'image_upload', 'mixed'])
        .withMessage('Invalid assignment type'),
    body('dueDate').notEmpty().withMessage('Due date is required'),
    body('questions').optional().isArray().withMessage('Questions must be an array'),
    body('questions.*.questionText').notEmpty().withMessage('Question text is required'),
    body('questions.*.questionType')
        .isIn(['mcq', 'multiple_correct', 'text', 'image_upload'])
        .withMessage('Invalid question type'),
    body('questions.*.points')
        .optional()
        .isInt({ min: 0 }).withMessage('Points must be a positive number')
], assignmentController.createAssignment);

router.get('/instructor/assignments', 
    authMiddleware.authInstructor, 
    assignmentController.getInstructorAssignments
);

router.get('/instructor/assignment/:assignmentId/submissions', 
    authMiddleware.authInstructor, 
    assignmentController.getAssignmentSubmissions
);

router.put('/instructor/assignment/:assignmentId', authMiddleware.authInstructor, [
    body('title')
        .optional()
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
    body('questions').optional().isArray().withMessage('Questions must be an array')
], assignmentController.updateAssignment);

router.patch('/instructor/assignment/:assignmentId/toggle-lock', 
    authMiddleware.authInstructor, 
    assignmentController.toggleAssignmentLock
);

router.patch('/instructor/assignment/:assignmentId/publish', 
    authMiddleware.authInstructor, 
    assignmentController.publishAssignment
);

router.delete('/instructor/assignment/:assignmentId', 
    authMiddleware.authInstructor, 
    assignmentController.deleteAssignment
);

router.post('/instructor/assignment/:assignmentId/submission/:submissionId/grade', 
    authMiddleware.authInstructor, [
    body('score')
        .notEmpty().withMessage('Score is required')
        .isNumeric().withMessage('Score must be a number'),
    body('feedback').optional().isString().withMessage('Feedback must be a string')
], assignmentController.gradeSubmission);

router.get('/student/assignments', 
    authMiddleware.authStudent, 
    assignmentController.getStudentAssignments
);

router.post('/student/assignment/:assignmentId/submit', authMiddleware.authStudent, [
    body('answers')
        .notEmpty().withMessage('Answers are required')
        .isArray().withMessage('Answers must be an array'),
    body('answers.*.questionId').notEmpty().withMessage('Question ID is required'),
    body('answers.*.answerType')
        .isIn(['mcq', 'multiple_correct', 'text', 'image_upload'])
        .withMessage('Invalid answer type')
], assignmentController.submitAssignment);

router.get('/assignment/:assignmentId', async (req, res, next) => {
    // Try student auth first, then instructor auth
    authMiddleware.authStudent(req, res, (err) => {
        if (err || !req.student) {
            authMiddleware.authInstructor(req, res, next);
        } else {
            next();
        }
    });
}, assignmentController.getAssignmentById);

export default router;