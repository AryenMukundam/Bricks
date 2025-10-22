import studentModel from "../models/student.model.js";
import {validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import blacklistTokenModel from "../models/blacklistToken.model.js";
import otpService from "../services/otp.service.js";

const login = async(req , res) =>{
    try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {enrollmentNumber , password} = req.body;
    const student = await studentModel.findOne({enrollmentNumber}).select('+password');

    if(!student){
        return res.status(400).json({errors:[{msg:'Invalid enrollment number or password'}]});
    }

    const isMatch = await bcrypt.compare(password , student.password);

    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid enrollment number or password'}]});
    }

    if(student.mustChangePassword || student.isFirstLogin){
        const tempToken = student.generateTempToken();

        return res.status(200).json({
            mustChangePassword:true,
            isFirstLogin:student.isFirstLogin,
            tempToken,
            message:'Password change required. Please proceed to change your password.',
            enrollmentNumber:student.enrollmentNumber,
            email: student.email
        })
    }

    const token = student.generateAuthToken();
    res.cookie('token' , token);

    student.lastActive = Date.now();
    await student.save();

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(200).json({token , student:studentResponse , message:'Login successful'});
}catch(err){
    console.error(err);
    res.status(500).json({errors:[{msg:'Server error during login'}]});
}
}

const getProfile = async(req , res) =>{
    try{
    const student = req.student;

    if(student.mustChangePassword){
        return res.status(403).json({mustChangePassword:true , msg:'Password change required. Please change your password to access your profile.'});
    }
    
    res.status(200).json({student});
}catch(err){
    console.error('Get profile error:', err);
    res.status(500).json({errors:[{msg:'Server error while fetching profile'}]});
}
}


const logout = async(req , res) =>{
    try{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({token});
    res.status(200).json({msg:'Logged out successfully'});
    }catch(err){
        console.error('Logout error:', err);
        res.status(500).json({errors:[{msg:'Server error during logout'}]});
    }
}

const requestPasswordChangeOTP = async(req , res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {enrollmentNumber , tempToken} = req.body;

        const jwt = (await import('jsonwebtoken')).default;
        let decoded;
        try{
            decoded = jwt.verify(tempToken , process.env.JWT_SECRET);
            if(decoded.purpose !== 'password_change' || decoded.enrollmentNumber !== enrollmentNumber){
                return res.status(400).json({errors:[{msg:'Invalid token or enrollment number'}]});
            }
        }catch(err){
            return res.status(400).json({errors:[{msg:'Invalid token or enrollment number'}]});
        }

        const student = await studentModel.findOne({enrollmentNumber}).select('+otpAttempts +otpBlockedUntil');

        if(!student){
            return res.status(400).json({errors:[{msg:'Student not found'}]});
        }

        if(student.otpBlockedUntil && Date.now() < student.otpBlockedUntil){
            const minutesLeft = Math.ceil((student.otpBlockedUntil - Date.now()) / 60000);
            return res.status(429).json({errors:[{msg:`Too many OTP requests. Please try again in ${minutesLeft} minutes.`}]});
        }

        const otp = student.generateOTP();
        await student.save();

        const emailResult = await otpService.sendOTP(student.email , otp , student.fullname.firstname);
        if(!emailResult.success){
            return res.status(500).json({errors:[{msg:'Failed to send OTP email. Please try again later.'}]});
        }

        res.status(200).json({msg:'OTP sent successfully'});

    }catch(err){
        console.error('Request OTP error:', err);
        res.status(500).json({errors:[{msg:'Server error during OTP request'}]});
    }
}

const verifyOTPAndChangePassword = async(req , res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {enrollmentNumber , otp , newPassword , tempToken} = req.body;

        const jwt = (await import('jsonwebtoken')).default;
        let decoded;
        try{
            decoded = jwt.verify(tempToken , process.env.JWT_SECRET);
            if(decoded.purpose !== 'password_change' || decoded.enrollmentNumber !== enrollmentNumber){
                return res.status(400).json({errors:[{msg:'Invalid token or enrollment number'}]});
            }
        }catch(err){
            return res.status(400).json({errors:[{msg:'Invalid token or enrollment number'}]});
        }

        const student = await studentModel.findOne({enrollmentNumber}).select('+resetPasswordOtp +resetPasswordOtpExpiry +otpAttempts +otpBlockedUntil +password');
        if(!student){
            return res.status(404).json({errors:[{msg:'Student not found'}]});
        }

        if(student.otpBlockedUntil && Date.now() < student.otpBlockedUntil){
            const minutesLeft = Math.ceil((student.otpBlockedUntil - Date.now()) / 60000);
            return res.status(429).json({errors:[{msg:`Too many OTP attempts. Please try again in ${minutesLeft} minutes.`}]});
        }

        if(!student.verifyOTP(otp)){
            student.otpAttempts = (student.otpAttempts || 0) + 1;
            if(student.otpAttempts >=5){
                student.otpBlockedUntil = Date.now() + 30*60*1000; // Block for 30 minutes
                await student.save();
                return res.status(429).json({errors:[{msg:'Too many incorrect OTP attempts. You are blocked for 30 minutes.'}]});
            }
            await student.save();
            return res.status(400).json({errors:[{msg:`Invalid or expired OTP. ${5 - student.otpAttempts} attempts left.`}]});
        }

        const isSamePassword = await bcrypt.compare(newPassword , student.password);
        if(isSamePassword){
            return res.status(400).json({errors:[{msg:'New password cannot be the same as the old password.'}]});
        }

        student.password = newPassword;
        student.mustChangePassword = false;
        student.isFirstLogin = false;
        student.passwordChangedAt = Date.now();
        student.clearOTP();

        await student.save();

        await otpService.sendPasswordChangeConfirmation(student.email , student.fullname.firstname);

        const token = student.generateAuthToken();
        res.cookie('token' , token);
        
        const studentResponse = student.toObject();
        delete studentResponse.password;
        delete studentResponse.resetPasswordOtp;
        delete studentResponse.resetPasswordOtpExpiry;

        res.status(200).json({msg:'Password changed successfully', token , student:studentResponse});


    }catch(err){
        console.error('Verify OTP error:', err);
        res.status(500).json({errors:[{msg:'Server error during OTP verification'}]});
    }
}

const forgotPassword = async(req , res) =>{
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {enrollmentNumber , email} = req.body;


        const student = await studentModel.findOne({enrollmentNumber , email}).select('+otpAttempts +otpBlockedUntil');
        if(!student){
            return res.status(404).json({errors:[{msg:'Student not found'}]});
        }

        if(student.otpBlockedUntil && Date.now() < student.otpBlockedUntil){
            const minutesLeft = Math.ceil((student.otpBlockedUntil - Date.now()) / 60000);
            return res.status(429).json({errors:[{msg:`Too many OTP requests. Please try again in ${minutesLeft} minutes.`}]});
        }

        const otp = student.generateOTP();
        await student.save();
        const emailResult = await otpService.sendOTP(student.email , otp , student.fullname.firstname);
        if(!emailResult.success){
            return res.status(500).json({errors:[{msg:'Failed to send OTP email. Please try again later.'}]});
        }
        res.status(200).json({msg:'OTP sent successfully'});

    }catch(err){
        console.error('Forgot password error:', err);
        res.status(500).json({errors:[{msg:'Server error during forgot password process'}]});
    }
}

const resetPassword = async(req , res) =>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {enrollmentNumber , otp , newPassword} = req.body;

        const student = await studentModel.findOne({enrollmentNumber}).select('+resetPasswordOtp +resetPasswordOtpExpiry +otpAttempts +otpBlockedUntil +password');
        if(!student){
            return res.status(404).json({errors:[{msg:'Student not found'}]});
        }

        if(student.otpBlockedUntil && Date.now() < student.otpBlockedUntil){
            const minutesLeft = Math.ceil((student.otpBlockedUntil - Date.now()) / 60000);
            return res.status(429).json({errors:[{msg:`Too many OTP attempts. Please try again in ${minutesLeft} minutes.`}]});
        }

        if(!student.verifyOTP(otp)){
            student.otpAttempts = (student.otpAttempts || 0) + 1;
            if(student.otpAttempts >=5){
                student.otpBlockedUntil = Date.now() + 30*60*1000; // Block for 30 minutes
                await student.save();
                return res.status(429).json({errors:[{msg:'Too many incorrect OTP attempts. You are blocked for 30 minutes.'}]});
            }
            await student.save();
            return res.status(400).json({errors:[{msg:`Invalid or expired OTP. ${5 - student.otpAttempts} attempts left.`}]});
        }

        student.password = newPassword;
        student.passwordChangedAt = Date.now();
        student.clearOTP();

        await student.save();
        await otpService.sendPasswordChangeConfirmation(student.email , student.fullname.firstname);
        res.status(200).json({msg:'Password reset successfully. You can now log in with your new password.'});

    }catch(err){
        console.error('Reset password error:', err);
        res.status(500).json({errors:[{msg:'Server error during reset password process'}]});
    }
}

export default {login , getProfile , logout , forgotPassword , resetPassword , requestPasswordChangeOTP , verifyOTPAndChangePassword};