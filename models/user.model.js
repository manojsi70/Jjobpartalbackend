import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
   fullname: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   phoneNumber: {
      type: Number,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
      minlength: 8,
   },
   role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
      default: "student",
   },
   profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // URL to resume
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
         type: String,
         default: "",
      },
   },
},{timestamps:true});
export const User = mongoose.model('User',userSchema);