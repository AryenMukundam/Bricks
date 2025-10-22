import { validationResult } from "express-validator";
import instructorModel from "../models/instructor.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import bcrypt from 'bcrypt';

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

export default { login, getProfile , logout};
