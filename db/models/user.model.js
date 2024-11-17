import { Schema, model } from "mongoose";
import { role } from "../../src/types/user.role.js";
import { credentials } from "../../src/types/credentials.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 8
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 8
    },
    userName:{
      type: String
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    recoveryEmail: {
      type: String,
    },
    DOB: {
      type: Date,
      required: true
    },
    mobileNumber: {
      type: String,
      unique: true
    },
    role: {
      type: String,
      enum: Object.values(role),
    },
    status: {
      type: String,
      default: "offline"
    },
    isConfirmed:{
      type: Boolean,
      default: false
    },
    loginMethod:{
      type: String,
      enum: Object.values(credentials)
    },
    loginMethodData:{
      type: String
    },
    otp:{
      type: String
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
