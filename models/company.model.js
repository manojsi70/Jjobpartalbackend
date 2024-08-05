import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true ,
        unique: true
    },
    description: { 
        type: String, 
        
    },
    website: { 
        type: String, 
        
    },
    location: { 
        type: String, 
       
    },
    logo: { 
        type: String, //url string
        
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // references User model by id
      required: true,
      unique: true
    }
} , {timestamps: true})

export const Company = mongoose.model("Company", companySchema);