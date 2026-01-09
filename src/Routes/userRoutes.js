import { Router } from "express";
import { changePassword, forgetPassword, getProfile, isVerify, loginUser, logOut, registerUser, reSendEmailVerification, resetPassword } from "../Controllers/userController.js";
import { userLogIn } from "../middleware/userMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", isVerify)
router.get("/get-profeile", userLogIn, getProfile);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/logout", userLogIn, logOut);
router.post("/change-password", userLogIn, changePassword);
router.get("/reverify", userLogIn, reSendEmailVerification);



export default router