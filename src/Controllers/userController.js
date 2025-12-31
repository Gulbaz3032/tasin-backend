import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../Models/userModels.js";
import { sendingEmail } from "../Utils/sendingEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const token = crypto.randomBytes(30).toString("hex");

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      emailVerificationToken: token,
    });

    if (!newUser) {
      return res.status(400).json({
        message: "User not registered",
        success: false,
      });
    }

    // sending email

    const options = {
      email: email,
      subject: "Email verification",
      route: "Verify",
      token: token,
    };

    await sendingEmail(options)

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to register user, Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Login user, Server error",
      error: error.message,
    });
  }
};

export const logOut = async (req, res) => {};
