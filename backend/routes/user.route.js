import express from "express";
import crypto from "crypto"; // for generating unique tokens
import nodemailer from "nodemailer"; // for sending emails
import { User } from "../models/user.model.js";
import { forgotPassword, getSavedJobs, getSingleUser, login, logout, register, removeSavedJob, resetPassword, saveJob, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { profileUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(profileUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, profileUpload, updateProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.get("/saved-jobs", isAuthenticated, getSavedJobs);          // fetch all saved jobs
router.post("/save-job/:jobId", isAuthenticated, saveJob);          // save a job
router.delete("/save-job/:jobId", isAuthenticated, removeSavedJob); // remove a saved job

router.route("/:id").get(isAuthenticated, getSingleUser);


export default router;

