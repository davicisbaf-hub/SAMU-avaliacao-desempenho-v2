import { Router } from "express";
import { login, loginWithEmail } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/login/usuario", loginWithEmail);

export default router;