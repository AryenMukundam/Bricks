import { validationResult } from "express-validator";
import instructorModel from "../models/instructor.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import bcrypt from 'bcrypt';

const register = async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {firstname, lastname, email, password, instructorId, bio, batches} = req.body;

        const existingInstructor = await instructorModel.findOne({
            $or: [{email}, {instructorId}]
        });

        if(existingInstructor){
            if(existingInstructor.email === email){
                return res.status(400).json({errors: [{msg: 'Email already registered'}]});
            }
            if(existingInstructor.instructorId === instructorId){
                return res.status(400).json({errors: [{msg: 'Instructor ID already registered'}]});
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const instructor = await instructorModel.create({
            fullname: {
                firstname,
                lastname
            },
            email,
            password: hashedPassword,
            instructorId,
            bio: bio || "Passionate educator dedicated to inspiring and empowering students.",
            batches: batches || []
        });

        const token = instructor.generateAuthToken();
        res.cookie('token', token);

        const instructorResponse = instructor.toObject();
        delete instructorResponse.password;

        res.status(201).json({
            msg: 'Instructor registered successfully',
            token,
            instructor: instructorResponse
        });

    } catch(err) {
        console.error('Register error:', err);
        res.status(500).json({errors: [{msg: 'Server error during registration'}]});
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {instructorId , password} = req.body;
    const instructor = await instructorModel.findOne({instructorId}).select('+password');

    if(!instructor){
        return res.status(400).json({errors:[{msg:'Invalid instructor ID or password'}]});
    }

    const isMatch = await bcrypt.compare(password , instructor.password);
    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid instructor ID or password'}]});
    }

    const token = instructor.generateAuthToken();
    res.cookie('token' , token);
    res.status(200).json({token , instructor});
}

const getProfile = async (req, res) => {
    const instructor = req.instructor;
    res.status(200).json({ instructor });
}

const logout = async(req , res) =>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({token});
    res.status(200).json({msg:'Logged out successfully'});
}

export default { login, getProfile , logout , register};
