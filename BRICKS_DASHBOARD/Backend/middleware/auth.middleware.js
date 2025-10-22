import studentModel from "../models/student.model.js";
import instructorModel from "../models/instructor.model.js";
import jwt from "jsonwebtoken";
import blacklistTokenModel from "../models/blacklistToken.model.js";
const authStudent =  async (req , res , next) =>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({msg:'Unauthorized'});
    }

    const isBlackListed = await blacklistTokenModel.findOne({token:token});

    if(isBlackListed){
        return res.status(401).json({msg:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const student = await studentModel.findById(decoded._id);

        req.student = student;
        next();
    }catch(err){
        return res.status(401).json({msg:'Unauthorized'});
    }
}

const authInstructor = async (req , res , next) =>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({msg:'Unauthorized'});
    }

    const isBlackListed = await blacklistTokenModel.findOne({token:token});

    if(isBlackListed){
        return res.status(401).json({msg:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const instructor = await instructorModel.findById(decoded._id);

        req.instructor = instructor;
        next();
    }catch(err){
        return res.status(401).json({msg:'Unauthorized'});
    }
}

export default {authStudent , authInstructor};