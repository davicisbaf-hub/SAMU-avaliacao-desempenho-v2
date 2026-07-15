import { Router } from "express";
import { login, loginWithEmail, logout } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/login/usuario", loginWithEmail);
router.post("/logout", logout);

export default router;