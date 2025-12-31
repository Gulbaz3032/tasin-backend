import { Router } from "express";
import { loginUser, registerUser } from "../Controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", )


export default router