import { Router } from "express";
import {
  listar,
  listarPorBase,
  cadastrar,
  atualizar,
  inativar,
} from "../controllers/usuariosController.js";

const router = Router();

router.get("/usuarios", listar);
router.get("/usuarios/base/:base", listarPorBase);
router.post("/usuarios", cadastrar);
router.put("/usuarios/:id", atualizar);
router.put("/usuarios/:id/inativar", inativar);

export default router;