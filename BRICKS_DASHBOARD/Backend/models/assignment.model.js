import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Title should be at least 3 characters long"],
        maxlength: [200, "Title can be at most 200 characters long"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Description can be at most 1000 characters long"]
    },
    batch: {
        type: String,
        required: true,
        index: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true,
        index: true
    },
    instructorName: {
        type: String,
        required: true
    },
    assignmentType: {
        type: String,
        enum: ['mcq', 'multiple_correct', 'text', 'image_upload', 'mixed'],
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true,
            trim: true
        },
        questionImage: {
            type: String,
            default: null
        },
        questionType: {
            type: String,
            enum: ['mcq', 'multiple_correct', 'text', 'image_upload'],
            required: true
        },
        options: [{
            optionText: String,
            optionImage: String,
            isCorrect: Boolean
        }],
        correctAnswer: String,
        points: {
            type: Number,
            default: 1,
            min: 0
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    totalPoints: {
        type: Number,
        default: 0
    },
    dueDate: {
        type: Date,
        required: true,
        index: true
    },
    isLocked: {
        type: Boolean,
        default: false,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true
    },
    publishedAt: {
        type: Date,
        default: null
    },
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
            required: true
        },
        studentName: String,
        answers: [{
            questionId: mongoose.Schema.Types.ObjectId,
            answerType: {
                type: String,
                enum: ['mcq', 'multiple_correct', 'text', 'image_upload']
            },
            selectedOption: Number,
            selectedOptions: [Number],
            textAnswer: String,
            imageAnswer: String
        }],
        submittedAt: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number,
            default: null
        },
        feedback: {
            type: String,
            default: null
        },
        gradedAt: {
            type: Date,
            default: null
        },
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Instructor',
            default: null
        }
    }],
    settings: {
        shuffleQuestions: {
            type: Boolean,
            default: false
        },
        shuffleOptions: {
            type: Boolean,
            default: false
        },
        showCorrectAnswers: {
            type: Boolean,
            default: true
        },
        allowMultipleAttempts: {
            type: Boolean,
            default: false
        },
        maxAttempts: {
            type: Number,
            default: 1,
            min: 1
        },
        timeLimit: {
            type: Number,
            default: null
        }
    }
}, { timestamps: true });

// Indexes
assignmentSchema.index({ batch: 1, dueDate: -1 });
assignmentSchema.index({ instructor: 1, createdAt: -1 });
assignmentSchema.index({ isPublished: 1, isLocked: 1, isActive: 1 });
assignmentSchema.index({ 'submissions.student': 1 });

// Calculate total points before saving
assignmentSchema.pre('save', function(next) {
    if (this.isModified('questions')) {
        this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    }
    next();
});

// Check if assignment is accessible
assignmentSchema.methods.isAccessible = function() {
    return this.isActive && this.isPublished && !this.isLocked;
};

// Check if student can submit
assignmentSchema.methods.canSubmit = function() {
    const now = new Date();

    if (!this.isAccessible()) {
        return { allowed: false, reason: 'Assignment is not accessible' };
    }

    if (this.dueDate && now > this.dueDate) {
        return { allowed: false, reason: 'Assignment deadline has passed' };
    }

    return { allowed: true };
};

// Check if student has submitted
assignmentSchema.methods.hasSubmitted = function(studentId) {
    return this.submissions.some(sub => sub.student.toString() === studentId.toString());
};

// Get student's submission
assignmentSchema.methods.getSubmission = function(studentId) {
    return this.submissions.find(sub => sub.student.toString() === studentId.toString());
};

// Get submission count
assignmentSchema.methods.getSubmissionCount = function() {
    return this.submissions.length;
};

// Auto-grade objective questions
assignmentSchema.methods.autoGrade = function(submissionId) {
    const submission = this.submissions.id(submissionId);
    if (!submission) return null;

    let totalScore = 0;

    submission.answers.forEach(answer => {
        const question = this.questions.id(answer.questionId);
        if (!question) return;

        if (answer.answerType === 'mcq') {
            const correctOption = question.options.findIndex(opt => opt.isCorrect);
            if (answer.selectedOption === correctOption) {
                totalScore += question.points;
            }
        } else if (answer.answerType === 'multiple_correct') {
            const correctOptions = question.options
                .map((opt, idx) => opt.isCorrect ? idx : -1)
                .filter(idx => idx !== -1);

            const isCorrect = correctOptions.length === answer.selectedOptions.length &&
                correctOptions.every(opt => answer.selectedOptions.includes(opt));

            if (isCorrect) {
                totalScore += question.points;
            }
        }
    });

    submission.score = totalScore;
    return totalScore;
};

const assignmentModel = mongoose.model('Assignment', assignmentSchema);

export default assignmentModel;