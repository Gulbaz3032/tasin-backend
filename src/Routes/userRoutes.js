import { Router } from "express";
import { isVerify, loginUser, registerUser } from "../Controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", isVerify)


export default router