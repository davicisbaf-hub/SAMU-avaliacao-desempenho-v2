import { Router } from "express";
import { listar, criar, frequenciaAvaliacoes, definirFrequencia } from "../controllers/avaliacoesController.js";

const router = Router();

router.get("/avaliacoes", listar);
router.get("/frequencia-avaliacoes", frequenciaAvaliacoes);
router.put("/frequencia-avaliacoes/:id", definirFrequencia);
router.post("/avaliacoes", criar);

export default router;