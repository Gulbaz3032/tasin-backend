import { Router } from "express";
import { getProfile, isVerify, loginUser, registerUser } from "../Controllers/userController.js";
import { userLogIn } from "../middleware/userMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", isVerify)
router.get("/get-profeile", userLogIn, getProfile)


export default router