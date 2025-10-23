import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className:{
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Class name should be at least 3 characters long"],
    },
    description:{
        type: String,
        trim: true,
        maxlength: [500, "Description can be at most 500 characters long"]
    },
    batch:{
        type: String,
        required: true,
        index: true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    instructorName: {
        type: String,
        required: true
    },
    googleMeetLink:{
        type: String,
        required: true,
        trim: true,
    },
    preReadLinks:[{
        title:{
            type: String,
            required: true,
            trim: true,
        },
        url:{
            type: String,
            required: true,
            trim: true
        },
        description:{
            type: String,
            trim: true,
            maxlength: [500, "Description can be at most 500 characters long"]
        }
    }],
    scheduledAt:{
        type: Date,
        required: true,
        index: true
    },
    duration:{
        type: Number,
        default: 60
    },
    status:{
        type: String,
        enum: ['scheduled' , 'ongoing' , 'completed' , 'cancelled'],
        default: 'scheduled',
        index: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
    attendees:[{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
        },
        joinedAt: {
            type: Date,
        },
        leftAt: {
            type: Date,
        }
    }],
    materials:[{
        title:String,
        url:String,
        uploadedAt:{
            type: Date,
            default: Date.now
        }
    }],
    recordings:[{
        title:String,
        url:String,
        uploadedAt:{
            type: Date,
            default: Date.now
        }
    }],
},{timestamps: true});


classSchema.index({batch:1 , scheduledAt:-1});
classSchema.index({instructor:1 , scheduledAt:-1});
classSchema.index({status:1 , scheduledAt:1});

classSchema.methods.updateStatus=function(){
    const now = Date.now()
    const classEnd = new Date(this.scheduledAt.getTime()+this.duration*60*1000);
    if(this.status==='cancelled'){
        return this.status;
    }
    if(now < this.scheduledAt){
        this.status = 'scheduled';
    }else if(now >= this.scheduledAt && now < classEnd){
        this.status = 'ongoing';
    }else if(now >= classEnd){
        this.status = 'completed';
    }
    return this.status;
}

const classModel = mongoose.model('Class' , classSchema);

export default classModel;