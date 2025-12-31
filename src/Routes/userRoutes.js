import { Router } from "express";
import { isVerify, loginUser, registerUser } from "../Controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify/:token", isVerify)


export default router