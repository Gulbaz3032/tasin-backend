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
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({
        message: "Fields are required",
        success: false
      })
    }

    const user = await User.findOne({ email });
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "email is not found"
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Email or Password is wrong"
      })
    }

    const jwtToken = await jwt.sign(
      { id: user._id},
      process.env.JWT_SECRET,
      { expiresIn : "1d"}
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    }

    res.cookie("token", jwtToken, cookieOptions)

    return res.status(200).json({
      message: "User login successfully",
      success: true,
      token: jwtToken
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to Login user, Server error",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {

    const user = await User.findOne({ email: req.user.email, _id: req.user._id}).select("-password");
    if(!user) {
      return res.status(401).json({
        message: "user is not loggedin",
        success: false
      });
    }

    return res.status(200).json({
      message: "Get profile successfully",
      success: true,
      user: user
    })


  } catch (error) {

    return res.status(500).json({
      message: "server error, failed to getprofile",
      success: false
    })
  }
}

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if(!email) {
      return res.status(401).json({
        message: "Email is required for forget password",
        success: false,
      });
    }

    const user = await User.findOne({ email }).select("-password");
    if(!user) {
      return res.status(404).json({
        message: "Email is not found",
        success: false,
      });
    }

    const token = crypto.randomBytes(10).toString("hex");
    user.resetVerificationToken = token;
    user.resetVerificationExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    const options = {
      email: email,
      subject: "Reset Password",
      route: "reset-password",
      token: token,
    }

    await sendingEmail(options); 

    return res.status(200).json({
      message: "Reset password successfully",
      success: true,
       user: user
    })

  } catch (error) {
    console.log("Server error, Failed to forget password", error);
    return res.status(500).json({
      message: "Failed to forget password, Server error",
      success: false
    });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and password are required",
        success: false,
      });
    }

    const user = await User.findOne({
      resetVerificationToken: token,
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid token",
        success: false,
      });
    }

    if (user.resetVerificationExpiry < Date.now()) {
      return res.status(400).json({
        message: "Token has expired",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetVerificationToken = undefined;
    user.resetVerificationExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Successfully reset password",
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, failed to reset password",
      success: false,
    });
  }
};


export const logOut = async (req, res) => {
  try {
    res.status(200).cookie("token", "").json({
      message: "User Logout successfully", 
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      message: "Server error, Failed to logout",
      success: false
    })
  }
};



export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if(!id) {
      return res.status(404).json({
        message: "User not found with this id",
        success: false
      });
    }

    const { name, email, password } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      {new: true}
    );
    if(!updateUser) {
      return res.status(400).json({
        message: "Failed to update user",
        success: false
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      updateUser
    })
    

  } catch (error) {
    console.log("Failed to update user, server error", error);
    return res.status(500).json({
      message: "server error, failed to update the user",
      success: false
    })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Passowd is required",
        success: false
      });
    }

    const user = await User.findOne({
      email: req.user.email,
      _id: req.user._id
    });


    if(!user) {
      return res.status(404).json({
        message: "User not found", 
        success: false
      })
    }

    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if(!isMatched) {
      return res.status(401).json({
        message: "Old Password is Invalid",
        success: false
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
     
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
      user: user
    });



  }  catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, failed to change password",
      success: false,
    });
  }
}


