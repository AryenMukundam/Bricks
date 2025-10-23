import { validationResult } from "express-validator";
import studentModel from "../models/student.model.js";
import classModel from "../models/class.model.js";

const createClass = async(req , res)=>{
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {className , description , batch , googleMeetLink , preReadLinks , scheduledAt , duration} = req.body;

        const instructor = req.instructor;

        if(!instructor.batches.includes(batch)){
            return res.status(403).json({errors:[{msg:'You are not authorized to create classes for this batch'}]});
        }

        if(new Date(scheduledAt)<=new Date()){
            return res.status(400).json({errors:[{msg:'Scheduled date and time must be in the future'}]});
        }

        const newClass = await classModel.create({
            className ,
            description,
            batch,
            instructor:instructor._id,
            instructorName:`${instructor.fullname.firstname} ${instructor.fullname.lastname || ''}`.trim(),
            googleMeetLink,
            preReadLinks: preReadLinks || [],
            scheduledAt,
            duration:duration || 60
        });

        res.status(201).json({
            msg:'Class created successfully',
            class:newClass});

    }catch(err){
        console.error('Create class error:', err);
        res.status(500).json({errors:[{msg:'Server error while creating class'}]});
    }
}

const getInstructorClasses = async(req , res)=>{
    try{

        const instructor = req.instructor;
        const {status , batch , page=1 , limit=10} = req.query;

        const query = {instructor:instructor._id};

        if(status){
            query.status = status;
        }

        if(batch){
            query.batch = batch;
        }

        const skip = (parseInt(page)-1)*parseInt(limit);

        const classes = await classModel.find(query)
        .sort({scheduledAt:-1})
        .skip(skip)
        .limit(parseInt(limit));

        for(let cls of classes){
            cls.updateStatus();
        }

        const total = await classModel.countDocuments(query);
        
        res.status(200).json({classes , 
            pagination:{
                currentPage:parseInt(page),
                totalPages:Math.ceil(total/parseInt(limit)),
                totalClasses:total,
                hasMore:skip+classes.length<total
            }
        });
        
    }catch(err){
        console.error('Get classes error:', err);
        res.status(500).json({errors:[{msg:'Server error while fetching classes'}]});
    }
}

const getStudentClasses = async (req , res)=>{
    try{
        const student = req.student;
        const {status ,  upcoming , page = 1, limit = 10} = req.query

        const query = {
            batch: student.batch,
            isActive: true
        }

        if(status){
            query.status = status
        }

        if(upcoming==='true'){
            query.scheduledAt = {$gte : new Date()}
            query.status = {$in : ['scheduled' , 'ongoing']}
        }

        const skip = (parseInt(page)-1)*parseInt(limit);

        const classes = await classModel.find(query)
        .sort({scheduledAt: upcoming==='true' ? 1 : -1})
        .skip(skip)
        .limit(parseInt(limit))
        .select('-attendees');

        for (let cls of classes){
            cls.updateStatus();
        }

        const total = await classModel.countDocuments(query);
        
        res.status(200).json({classes , 
            pagination:{
                currentPage:parseInt(page),
                totalPages:Math.ceil(total/parseInt(limit)),
                totalClasses:total,
                hasMore:skip+classes.length<total
            }
        });


    }catch(err){
        console.error('Get classes error:', err);
        res.status(500).json({errors:[{msg:'Server error while fetching classes'}]});
    }
}


const getClassById = async (req , res) =>{
    try{

        const {classId} = req.params;
        const user = req.student || req.instructor;
        const userType = req.student ? 'student' : 'instructor'

        const classData = await classModel.findById(classId)

        if(!classData){
            return res.status(404).json({
                errors:[{msg:'Class not found'}]
            })
        }

        if(userType === 'student' && classData.batch !== user.batch){
            return res.status(403).json({
                errors:[{msg:'You are not authorized to view this class'}]
            })
        }

        if(userType === 'instructor' && classData.instructor.toString() !== user._id.toString()){
            return res.status(403).json({
                errors:[{msg:'You are not authorized to view this class'}]
            })
        }

        classData.updateStatus();
        await classData.save()

        const response = classData.toObject();
        if(userType === 'student'){
            delete response.attendees;
        }

        res.status(200).json({class:response});

    }catch(err){
        console.error('Get class error:', err);
        res.status(500).json({errors:[{msg:'Server error while fetching class'}]});
    }
}

const updateClass = async (req , res) =>{
    try{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {classId} = req.params;
        const instructor = req.instructor;
        const updateData = req.body;

        const classData = await classModel.findById(classId);

        if(!classData){
            return res.status(404).json({
                errors:[{msg:'Class not found'}]
            })
        }

        if(classData.instructor.toString() !== instructor._id.toString()){
            return res.status(403).json({
                errors:[{msg:'You are not authorized to update this class'}]
            })
        }

        if(classData.status === 'completed'){
            return res.status(400).json({
                errors:[{msg:'Class is already completed'}]
            })
        }

        if(classData.status === 'cancelled'){
            return res.status(400).json({
                errors:[{msg:'Class is already cancelled'}]
            })
        }

        if(updateData.scheduledAt && new Date(updateData.scheduledAt) <= new Date()){
            return res.status(400).json({errors:[{msg:'Scheduled date and time must be in the future'}]});
        }

        const allowedUpdates = [
            'className',
            'description',
            'googleMeetLink',
            'preReadLinks',
            'scheduledAt',
            'duration',
            'status',
            'materials',
            'recordings',
        ]

        allowedUpdates.forEach(field=>{
            if(updateData[field]!=undefined){
                classData[field] = updateData[field];
            }
        })

        classData.updatedAt = Date.now();
        await classData.save();

        res.status(200).json({
            msg:'Class updated successfully',
            class: classData
        })

    }catch(err){
        console.error('Update class error:', err);
        res.status(500).json({errors:[{msg:'Server error while updating class'}]});
    }
}

const deleteClass = async (req , res)=>{
    try{

        const {classId} = req.params;
        const instructor = req.instructor;

        const classData = await classModel.findById(classId);

        if(!classData){
            return res.status(404).json({
                errors:[{msg:'Class not found'}]
            })
        }

        if(classData.instructor.toString() !== instructor._id.toString()){
            return res.status(403).json({
                errors:[{msg:'You are not authorized to delete this class'}]
            })
        }

        classData.isActive = false;
        classData.status = 'cancelled';
        await classData.save();

        res.status(200).json({
            msg:'Class deleted successfully',
            class: classData
        })

    }catch(err){
        console.error('Delete class error:', err);
        res.status(500).json({errors:[{msg:'Server error while deleting class'}]});
    }
}

const recordAttendance = async (req , res) =>{
    try {
        const {classId} = req.params;
        const student = req.student;

        const classData = await classModel.findById(classId);

        if(!classData){
            return res.status(404).json({
                errors:[{msg:'Class not found'}]
            })
        }

        if(classData.batch !== student.batch){
            return res.status(403).json({
                errors:[{msg:'You are not authorized to record attendance for this class'}]
            })
        }

        const existingAttendance = classData.attendees.find(
            attendee => attendee.student.toString() === student._id.toString()
        );

        if(existingAttendance){
            return res.status(400).json({
                errors:[{msg:'You have already recorded attendance for this class'}]
            })
        }

        if (['completed', 'cancelled'].includes(classData.status)) {
            return res.status(400).json({ errors: [{ msg: 'Cannot record attendance for completed/cancelled class' }] });
        }          

        classData.attendees.push({
            student: student._id,
            joinedAt: Date.now(),
        });

        await classData.save();

        res.status(200).json({
            msg:'Attendance recorded successfully',
            class: classData
        });

    } catch (err) {
        console.error('Record attendance error:', err);
        res.status(500).json({errors:[{msg:'Server error while recording attendance'}]});
    }
}

const getClassStatistics = async(req , res)=>{
    try{

        const {classId} = req.params;
        const instructor = req.instructor;

        const classData = await classModel.findById(classId)
            .populate('attendees.student' , 'fullname enrollmentNumber email');

        if(!classData){
            return res.status(404).json({
                errors:[{msg:'Class not found'}]
            })
        }

        if(classData.instructor.toString() !== instructor._id.toString()){
            return res.status(403).json({
                errors:[{msg:'You are not authorized to view this class statistics'}]
            })
        }

        const totalStudents = await studentModel.countDocuments({batch:classData.batch});

        const statistics = {
            className : classData.className,
            batch:classData.batch,
            scheduledAt: classData.scheduledAt,
            status:classData.status,
            totalStudentsInBatch:totalStudents,
            attendeesCount:classData.attendees.length,
            attendenceRate: totalStudents>0
                ? ((classData.attendees.length/totalStudents)*100).toFixed(2)
                : '0.00%',
            attendees: classData.attendees.map(attendee=>({
                    student:attendee.student,
                    joinedAt:attendee.joinedAt,
                    leftAt:attendee.leftAt
            }))
        }

        res.status(200).json({
            msg:'Class statistics fetched successfully',
            statistics
        })

    }catch(err){
        console.error('Get class statistics error:', err);
        res.status(500).json({errors:[{msg:'Server error while fetching class statistics'}]});
    }
}

export default{
    createClass,
    updateClass,
    deleteClass,
    recordAttendance,
    getClassById,
    getClassStatistics,
    getStudentClasses,
    getInstructorClasses
}