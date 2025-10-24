import { validationResult } from "express-validator";
import assignmentModel from "../models/assignment.model.js";
import studentModel from "../models/student.model.js";

const createAssignment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            description,
            batch,
            assignmentType,
            questions,
            dueDate,
            settings,
            isPublished
        } = req.body;

        const instructor = req.instructor;

        if (!instructor.batches.includes(batch)) {
            return res.status(403).json({ errors: [{ msg: 'You are not authorized to create assignments for this batch' }] });
        }

        if (new Date(dueDate) <= new Date()) {
            return res.status(400).json({ errors: [{ msg: 'Due date must be in the future' }] });
        }

        const newAssignment = await assignmentModel.create({
            title,
            description,
            batch,
            instructor: instructor._id,
            instructorName: `${instructor.fullname.firstname} ${instructor.fullname.lastname || ''}`.trim(),
            assignmentType,
            questions: questions || [],
            dueDate,
            settings: settings || {},
            isPublished: isPublished || false,
            publishedAt: isPublished ? Date.now() : null
        });

        res.status(201).json({
            msg: 'Assignment created successfully',
            assignment: newAssignment
        });

    } catch (err) {
        console.error('Create assignment error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error during assignment creation' }] });
    }
};

const getInstructorAssignments = async (req, res) => {
    try {
        const instructor = req.instructor;
        const { batch, isPublished, isLocked, page = 1, limit = 10 } = req.query;

        const query = { instructor: instructor._id, isActive: true };

        if (batch) query.batch = batch;
        if (isPublished !== undefined) query.isPublished = isPublished === 'true';
        if (isLocked !== undefined) query.isLocked = isLocked === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const assignments = await assignmentModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-submissions.answers'); // Don't send answers in list view

        const total = await assignmentModel.countDocuments(query);

        const assignmentsWithStats = assignments.map(assignment => {
            const assignmentObj = assignment.toObject();
            assignmentObj.submissionCount = assignment.getSubmissionCount();
            return assignmentObj;
        });

        res.status(200).json({
            assignments: assignmentsWithStats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalAssignments: total,
                hasMore: skip + assignments.length < total
            }
        });

    } catch (err) {
        console.error('Get assignments error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while fetching assignments' }] });
    }
};

const getAssignmentById = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const user = req.student || req.instructor;
        const userType = req.student ? 'student' : 'instructor';

        const assignment = await assignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (userType === 'student' && assignment.batch !== user.batch) {
            return res.status(403).json({ errors: [{ msg: 'You are not authorized to view this assignment' }] });
        }

        if (userType === 'instructor' && assignment.instructor.toString() !== user._id.toString()) {
            return res.status(403).json({ errors: [{ msg: 'You are not authorized to view this assignment' }] });
        }

        const response = assignment.toObject();

        if (userType === 'student') {
            // Hide correct answers if setting is disabled
            if (!assignment.settings.showCorrectAnswers) {
                response.questions = response.questions.map(q => {
                    const question = { ...q };
                    if (question.options) {
                        question.options = question.options.map(opt => ({
                            optionText: opt.optionText,
                            optionImage: opt.optionImage
                        }));
                    }
                    delete question.correctAnswer;
                    return question;
                });
            }

            // Only show student's own submission
            const studentSubmission = assignment.getSubmission(user._id);
            response.submissions = studentSubmission ? [studentSubmission] : [];
            response.hasSubmitted = !!studentSubmission;
            response.canSubmit = assignment.canSubmit();
        } else {
            // For instructors: add statistics
            response.submissionCount = assignment.getSubmissionCount();
        }

        res.status(200).json({ assignment: response });

    } catch (err) {
        console.error('Get assignment error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while fetching assignment' }] });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignmentId } = req.params;
        const instructor = req.instructor;
        const updateData = req.body;

        const assignment = await assignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (assignment.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({
                errors: [{ msg: 'You are not authorized to update this assignment' }]
            });
        }

        if (assignment.submissions.length > 0 && updateData.questions) {
            return res.status(400).json({
                errors: [{ msg: 'Cannot modify questions after students have submitted' }]
            });
        }

        if (updateData.dueDate && new Date(updateData.dueDate) <= new Date()) {
            return res.status(400).json({
                errors: [{ msg: 'Due date must be in the future' }]
            });
        }

        const allowedUpdates = [
            'title',
            'description',
            'questions',
            'dueDate',
            'settings'
        ];

        // Apply updates
        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                assignment[field] = updateData[field];
            }
        });

        assignment.updatedAt = Date.now();
        await assignment.save();

        res.status(200).json({
            msg: 'Assignment updated successfully',
            assignment
        });

    } catch (err) {
        console.error('Update assignment error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while updating assignment' }] });
    }
};

const toggleAssignmentLock = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const instructor = req.instructor;

        const assignment = await assignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (assignment.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({
                errors: [{ msg: 'You are not authorized to modify this assignment' }]
            });
        }

        assignment.isLocked = !assignment.isLocked;
        await assignment.save();

        res.status(200).json({
            msg: `Assignment ${assignment.isLocked ? 'locked' : 'unlocked'} successfully`,
            assignment
        });

    } catch (err) {
        console.error('Toggle assignment lock error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while toggling assignment lock' }] });
    }
};

const publishAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const instructor = req.instructor;

        const assignment = await assignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (assignment.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({
                errors: [{ msg: 'You are not authorized to publish this assignment' }]
            });
        }

        if (assignment.isPublished) {
            return res.status(400).json({
                errors: [{ msg: 'Assignment is already published' }]
            });
        }

        if (!assignment.questions || assignment.questions.length === 0) {
            return res.status(400).json({
                errors: [{ msg: 'Cannot publish assignment without questions' }]
            });
        }

        assignment.isPublished = true;
        assignment.publishedAt = new Date();
        await assignment.save();

        res.status(200).json({
            msg: 'Assignment published successfully',
            assignment
        });

    } catch (err) {
        console.error('Publish assignment error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while publishing assignment' }] });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const instructor = req.instructor;

        const assignment = await assignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (assignment.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({
                errors: [{ msg: 'You are not authorized to delete this assignment' }]
            });
        }

        assignment.isActive = false;
        await assignment.save();

        res.status(200).json({
            msg: 'Assignment deleted successfully',
            assignment
        });

    } catch (err) {
        console.error('Delete assignment error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while deleting assignment' }] });
    }
};

const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const instructor = req.instructor;
        const { page = 1, limit = 20 } = req.query;

        const assignment = await assignmentModel.findById(assignmentId)
            .populate('submissions.student', 'fullname enrollmentNumber email');

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (assignment.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({
                errors: [{ msg: 'You are not authorized to view these submissions' }]
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const submissions = assignment.submissions.slice(skip, skip + parseInt(limit));

        const totalStudents = await studentModel.countDocuments({ batch: assignment.batch });

        res.status(200).json({
            assignment: {
                title: assignment.title,
                batch: assignment.batch,
                totalPoints: assignment.totalPoints,
                dueDate: assignment.dueDate
            },
            submissions,
            statistics: {
                totalStudents,
                totalSubmissions: assignment.submissions.length,
                submissionRate: totalStudents > 0
                    ? ((assignment.submissions.length / totalStudents) * 100).toFixed(2)
                    : '0.00',
                averageScore: assignment.submissions.length > 0
                    ? (assignment.submissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / assignment.submissions.length).toFixed(2)
                    : '0.00'
            },
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(assignment.submissions.length / parseInt(limit)),
                total: assignment.submissions.length
            }
        });

    } catch (err) {
        console.error('Get submissions error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while fetching submissions' }] });
    }
};

const gradeSubmission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignmentId, submissionId } = req.params;
        const { score, feedback } = req.body;
        const instructor = req.instructor;

        const assignment = await assignmentModel.findById(assignmentId)
            .populate('submissions.student', 'email fullname');

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (assignment.instructor.toString() !== instructor._id.toString()) {
            return res.status(403).json({
                errors: [{ msg: 'You are not authorized to grade this assignment' }]
            });
        }

        const submission = assignment.submissions.id(submissionId);

        if (!submission) {
            return res.status(404).json({ errors: [{ msg: 'Submission not found' }] });
        }

        if (score < 0 || score > assignment.totalPoints) {
            return res.status(400).json({
                errors: [{ msg: `Score must be between 0 and ${assignment.totalPoints}` }]
            });
        }

        submission.score = score;
        submission.feedback = feedback || null;
        submission.gradedAt = new Date();
        submission.gradedBy = instructor._id;

        await assignment.save();

        res.status(200).json({
            msg: 'Submission graded successfully',
            submission
        });

    } catch (err) {
        console.error('Grade submission error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while grading submission' }] });
    }
};

const getStudentAssignments = async (req, res) => {
    try {
        const student = req.student;
        const { status, page = 1, limit = 10 } = req.query;

        const query = {
            batch: student.batch,
            isActive: true,
            isPublished: true
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const assignments = await assignmentModel.find(query)
            .sort({ dueDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-submissions -questions.options.isCorrect -questions.correctAnswer');

        const total = await assignmentModel.countDocuments(query);

        let filteredAssignments = assignments.map(assignment => {
            const assignmentObj = assignment.toObject();
            const hasSubmitted = assignment.hasSubmitted(student._id);
            const submission = assignment.getSubmission(student._id);

            assignmentObj.hasSubmitted = hasSubmitted;
            assignmentObj.canSubmit = assignment.canSubmit();
            assignmentObj.mySubmission = submission ? {
                submittedAt: submission.submittedAt,
                score: submission.score,
                feedback: submission.feedback
            } : null;

            return assignmentObj;
        });

        if (status === 'pending') {
            filteredAssignments = filteredAssignments.filter(a => !a.hasSubmitted);
        } else if (status === 'submitted') {
            filteredAssignments = filteredAssignments.filter(a => a.hasSubmitted);
        } else if (status === 'graded') {
            filteredAssignments = filteredAssignments.filter(a => a.mySubmission?.score !== null);
        }

        res.status(200).json({
            assignments: filteredAssignments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalAssignments: total,
                hasMore: skip + assignments.length < total
            }
        });

    } catch (err) {
        console.error('Get student assignments error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while fetching assignments' }] });
    }
};

const submitAssignment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignmentId } = req.params;
        const { answers } = req.body;
        const student = req.student;

        const assignment = await assignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ errors: [{ msg: 'Assignment not found' }] });
        }

        if (assignment.batch !== student.batch) {
            return res.status(403).json({
                errors: [{ msg: 'You are not authorized to submit this assignment' }]
            });
        }

        const canSubmitCheck = assignment.canSubmit();
        if (!canSubmitCheck.allowed) {
            return res.status(400).json({ errors: [{ msg: canSubmitCheck.reason }] });
        }

        if (assignment.hasSubmitted(student._id) && !assignment.settings.allowMultipleAttempts) {
            return res.status(400).json({
                errors: [{ msg: 'You have already submitted this assignment' }]
            });
        }

        const existingSubmissions = assignment.submissions.filter(
            sub => sub.student.toString() === student._id.toString()
        );

        if (assignment.settings.allowMultipleAttempts &&
            existingSubmissions.length >= assignment.settings.maxAttempts) {
            return res.status(400).json({
                errors: [{ msg: `Maximum ${assignment.settings.maxAttempts} attempts allowed` }]
            });
        }

        const submission = {
            student: student._id,
            studentName: `${student.fullname.firstname} ${student.fullname.lastname || ''}`.trim(),
            answers,
            submittedAt: new Date()
        };

        assignment.submissions.push(submission);
        await assignment.save();

        const submissionId = assignment.submissions[assignment.submissions.length - 1]._id;
        const autoGradedScore = assignment.autoGrade(submissionId);
        await assignment.save();

        res.status(200).json({
            msg: 'Assignment submitted successfully',
            submission: assignment.submissions[assignment.submissions.length - 1],
            autoGradedScore
        });

    } catch (err) {
        console.error('Submit assignment error:', err);
        res.status(500).json({ errors: [{ msg: 'Server error while submitting assignment' }] });
    }
};

export default {
    // Instructor controllers
    createAssignment,
    getInstructorAssignments,
    updateAssignment,
    toggleAssignmentLock,
    publishAssignment,
    deleteAssignment,
    getAssignmentSubmissions,
    gradeSubmission,

    // Shared controllers
    getAssignmentById,

    // Student controllers
    getStudentAssignments,
    submitAssignment
};