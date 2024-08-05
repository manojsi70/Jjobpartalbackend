import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
   try {
      const { fullname, email, phoneNumber, password, role } = req.body;
     

      if (!fullname || !email || !phoneNumber || !password || !role) {
         return res.status(400).json({
            message: "All fields are required",
            success: false,
         });
      }
      const userExists = await User.findOne({ email });
      if (userExists) {
         return res.status(409).json({
            message: "Email already exists",
            success: false,
         });
      }
      const hashedPassword = await bcrypt.hash(password, 8);
      await User.create({
         fullname,
         email,
         phoneNumber,
         password: hashedPassword,
         role,
      });
      return res.status(201).json({
         message: "User registered successfully",
         success: true,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};

export const login = async (req, res) => {
   try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
         return res.status(400).json({
            message: "All fields are required",
            success: false,
         });
      }
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(401).json({
            message: "Invalid credentials",
            success: false,
         });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
         return res.status(401).json({
            message: "Somthing is Wrong",
            success: false,
         });
      }
      if (role !== user.role) {
         return res.status(400).json({
            message: "Invalid role",
            success: false,
         });
      }
      const tokenData = { userId: user._id };
      const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
         expiresIn: "1d",
      });

      return res
         .status(200)
         .cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
         })
         .json({
            message: "Welcome Back ${user.fullname}",
            user,
            success: true,
         });
   } catch (error) {
      console.error(error);
     
   }
};

export const logout = async (req, res) => {
   try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
         message: "Logged out successfully",
         success: true,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};

export const updateProfile = async (req, res) => {
   try {
      const { fullname, email, phoneNumber, bio, skills } = req.body;

      //cloudinary profile
      let skillsArray;
      if (skills) {
         skillsArray = skills.split(",");
      }
      const userId = req.userId; // Assuming the middleware sets req.userId

      let user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({
            message: "User not found",
            success: false,
         });
      }
      //Data updateding
      if (fullname) user.fullname = fullname;
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (bio) user.profile.bio = bio;
      if (skills) user.profile.skills = skillsArray;

      await user.save();

      return res.status(200).json({
         message: "Profile updated successfully",
         success: true,
         user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
         },
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};
