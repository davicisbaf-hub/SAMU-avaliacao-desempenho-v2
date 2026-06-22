import { Router } from "express";
import {
  listarPorTipoEAvaliacao,
  listarLider,
  listarLiderado,
  listarAutoavaliacao,
  listarTipos,
  cadastrar,
  atualizar,
  inativar,
} from "../controllers/criteriosController.js";

const router = Router();

router.get("/criterios-avaliacao/:tipo/:avaliacao", listarPorTipoEAvaliacao);
router.get("/criterios-avaliacao-lider/:tipo", listarLider);
router.get("/criterios-avaliacao-liderado/:tipo", listarLiderado);
router.get("/criterios-avaliacao-autoavaliacao/:tipo", listarAutoavaliacao);
router.get("/tipos-avaliacao", listarTipos);
router.post("/criterios-avaliacao", cadastrar);
router.put("/criterios-avaliacao/:id", atualizar);
router.put("/criterios-avaliacao/:id/inativar", inativar);

export default router;