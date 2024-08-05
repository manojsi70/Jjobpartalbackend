import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        ref:"Company"
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        
    },
    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        
    },
    companyId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }],
    requirements:{
        type: [toString()],
        required: true
    },
    jobType:{
        type: String,
        
    },
    position:{
        type: Number,
        
    },
    exprence:{
        type: Number,
        required: true
    },

})
export  const Job = mongoose.model('Job', jobSchema);