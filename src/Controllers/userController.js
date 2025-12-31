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
      emailVerificationExpiry: Date.now() + 60 * 60 * 1000
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


export const isVerify = async (req, res) => {
  try {
    const { token } = req.params;
    if(!token) {
      return res.status(404).json({
        message: "Token not found",
        success: false
      });
    }

    const user = await User.findOne({ emailVerificationToken: token }).select("-password");
    if(!user || user.emailVerificationExpiry < Date.now()) {
      return res.status(401).json({
        message: "Invalid token",
        success: false
      });
    }

    user.isVerified = true;
    user.emailVerificationExpiry = undefined;
    user.emailVerificationToken = undefined;

    await user.save();

    return res.status(200).json({
      message: "Email verification successfully",
      user: user
    });

  } catch (error) {
     return res.status(500).json({
      message: "Failed to verify user, Server error",
      error: error.message,
    });
  }
}

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
