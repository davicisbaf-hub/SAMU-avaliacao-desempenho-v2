import { Router } from "express";
import { listar, criar } from "../controllers/avaliacoesController.js";

const router = Router();

router.get("/avaliacoes", listar);
router.post("/avaliacoes", criar);

export default router;