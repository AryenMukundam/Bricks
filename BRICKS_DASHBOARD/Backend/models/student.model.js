import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const studentSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type: String,
            required: true,
            minlength: [3, "First name should be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minlength: [3, "Last name should be at least 3 characters long"],
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Email should be at least 3 characters long"],
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    enrollmentNumber:{
        type: String,
        required : true,
        unique:true,
    },
    school:{
        type: String,
        required: true
    },
    grade:{
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    avtarUrl:{
        type: String,
        default: null
    },
    bio:{
        type: String,
        default: "Excited to learn, explore, and grow with BRICKS Bootcamp <3"
    },
    points:{
        type: Number,
        default: 0
    },
    streak:{
        type: Number,
        default: 0
    },
    lastActive:{
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordOtp:{
        type: String,
        default: null
    },
    resetPasswordOtpExpiry:{
        type: Date,
        default: null
    },
    mustChangePassword:{
        type: Boolean,
        default: true
    },
    isFirstLogin:{
        type: Boolean,
        default: true
    },
    passwordChangedAt:{
        type: Date,
        default: null
    },
    otpAttempts:{
        type: Number,
        default: 0,
        select: false
    },
    otpBlockedUntil:{
        type: Date,
        default: null,
        select: false
    }
})

studentSchema.pre('save' , async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 10);

    if(!this.isNew){
        this.passwordChangedAt = Date.now();
    }
    next();
})

studentSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id:this._id
    } , process.env.JWT_SECRET , {expiresIn:'24h'});
    return token;
}

studentSchema.methods.generateTempToken = function(){
    const token = jwt.sign({
        _id:this._id,
        purpose:'password_change',
        enrollmentNumber : this.enrollmentNumber
    } , process.env.JWT_SECRET , {expiresIn:'15m'});
    return token;
}

studentSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

studentSchema.methods.generateOTP = function(){
    const otp = Math.floor(100000 + Math.random()*900000).toString();
    this.resetPasswordOtp = otp;
    this.resetPasswordOtpExpiry = Date.now() + 15*60*1000; // 15 minutes
    return otp;
}

studentSchema.methods.verifyOTP = function(otp){
    if(!this.resetPasswordOtp || !this.resetPasswordOtpExpiry){
        return false;
    }
    if(this.resetPasswordOtpExpiry < Date.now()){
        return false;
    }
    return this.resetPasswordOtp === otp;
}

studentSchema.methods.clearOTP = function(){
    this.resetPasswordOtp = null;
    this.resetPasswordOtpExpiry = null;
    this.otpAttempts = 0;
    this.otpBlockedUntil = null;
}



const studentModel = mongoose.model('student' , studentSchema);

export default studentModel;