import { Router } from "express";
import { 
  listar, 
  criar, 
  frequenciaAvaliacoes, 
  definirFrequencia,
  criarNivelFrequencia,
  removerNivelFrequencia,
  infosUsuario 
} from "../controllers/avaliacoesController.js";

const router = Router();

router.get("/avaliacoes", listar);
router.post("/avaliacoes", criar);
router.get("/frequencia-avaliacoes", frequenciaAvaliacoes);
router.post("/frequencia-avaliacoes", criarNivelFrequencia);
router.put("/frequencia-avaliacoes/:id", definirFrequencia);
router.delete("/frequencia-avaliacoes/:id", removerNivelFrequencia);
router.get("/avaliacoes/info", infosUsuario);

export default router;