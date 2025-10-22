import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const instructorSchema = new mongoose.Schema({
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
    instructorId:{
        type: String,
        required : true,
        unique:true,
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    avatarUrl:{
        type: String,
        default: null
    },
    bio:{
        type: String,
        default: "Passionate educator dedicated to inspiring and empowering students."
    },
    batches:[{type:String}],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

instructorSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id:this._id} , process.env.JWT_SECRET , {expiresIn:'24h'});
}

instructorSchema.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

const instructorModel = mongoose.model('Instructor' , instructorSchema);

export default instructorModel;