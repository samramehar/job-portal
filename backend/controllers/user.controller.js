import { User } from "../models/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
     
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Enter all fields!",
        success: false
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email.',
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Default profile photo
    let profilePhoto = null; // default in backend assets
    // Optional resume URL
    let resumeUrl = null;
    let resumeOriginalName = null;

    // Handle uploaded files
    if (req.files?.profilePhoto?.[0]) {
      const fileUri = getDataUri(req.files.profilePhoto[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    if (req.files?.resume?.[0]) {
      const resumeUri = getDataUri(req.files.resume[0]);
      const resumeUpload = await cloudinary.uploader.upload(resumeUri.content, { resource_type: "raw" });
      resumeUrl = resumeUpload.secure_url;
      resumeOriginalName = req.files.resume[0].originalname;
    }

    //here a new user is created
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto,
        resume: resumeUrl,
        resumeOriginalName,
      }
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


<<<<<<< HEAD
=======


>>>>>>> 9b6dc7d1ab847e124354572d203200080a7b08c5
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Enter all fields!",
                success: false
            });
        };
        let user = await User.findOne({ email }).populate({
            path: "savedJobs",
            select: "_id" // we only need the job IDs to mark bookmarks
        });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "User doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            savedJobs: user.savedJobs.map(job => job._id) 
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, position } = req.body;

    console.log("FILES:", req.files);

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Common fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Profile photo upload
    if (req.files?.profilePhoto?.[0]) {
      const photoUri = getDataUri(req.files.profilePhoto[0]);
      const photoUpload = await cloudinary.uploader.upload(photoUri.content);
      user.profile.profilePhoto = photoUpload.secure_url;
    }

    // Student fields
    if (user.role === "student") {
      if (bio) user.profile.bio = bio;
      if (skills) user.profile.skills = skills.split(",");

      if (req.files?.resume?.[0]) {
        const resumeUri = getDataUri(req.files.resume[0]);
        const resumeUpload = await cloudinary.uploader.upload(
          resumeUri.content,
          { resource_type: "raw" }
        );
        user.profile.resume = resumeUpload.secure_url;
        user.profile.resumeOriginalName = req.files.resume[0].originalname;
      }
    }

    // Recruiter fields
    if (user.role === "recruiter" && position) {
      user.profile.position = position;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};


export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email.", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token and expiry to user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset link
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link valid for 1 hour.</p>`,
    });

    return res.status(200).json({ message: "Password reset link sent to your email.", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};
// controllers/user.controller.js


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Please provide a new password.", success: false });
    }

    // Find user with matching token and not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token.", success: false });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear token and expiry
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful. You can now login.", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

export const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const jobId = req.params.jobId;

    if (!user.savedJobs) user.savedJobs = [];

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.status(200).json({ 
      success: true, 
      message: "Job saved successfully",
      savedJobs: user.savedJobs // return updated array
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to save job" });
  }
};


export const getSavedJobs = async (req, res) => {
  try {
    // Get user and populate savedJobs, including the company inside each job
    const user = await User.findById(req.id).populate({
      path: "savedJobs",
      populate: {
        path: "company", // populate the company field in the job
        select: "name logo", // get only name and logo
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, jobs: user.savedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch saved jobs" });
  }
};


export const removeSavedJob = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const jobId = req.params.jobId;
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Job removed from saved jobs",
      savedJobs: user.savedJobs // return updated array
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to remove job" });
  }
};

