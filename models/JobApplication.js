import mongoose from "mongoose";
import validator from "validator";

const JobApplication = new mongoose.Schema(
  {
    position: {
      type: String,
      maxlength: 50,
    },
    company: {
      type: String,
      maxlength: 50,
    },
    location: {
      type: String,
      maxlength: 100,
    },
    education: {
      type: String,
      enum: ["Undergraduate", "Graduate", "Masters", "Phd"],
      default: "Undergraduate",
    },

    jobType: {
      type: String,
      enum: ["Remote", "On-location", "Hybrid"],
      default: "Remote",
    },
    experience: {
      type: String,
      default: "No Experience",
    },
    appliedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recruiterID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    Status: {
      type: String,
      enum: ["Accepted", "Pending", "Rejected"],
      default: "Pending",
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobApp", JobApplication);
