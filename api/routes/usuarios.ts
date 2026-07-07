import { Router } from "express";
import {
  listar,
  listarPorBase,
  cadastrar,
  atualizar,
  inativar,
  getMe
} from "../controllers/usuariosController.js";

const router = Router();

router.get("/usuarios", listar);
router.get("/usuarios/base/:base", listarPorBase);
router.get("/me", getMe);

router.post("/usuarios", cadastrar);

router.put("/usuarios/:id", atualizar);
router.put("/usuarios/:id/inativar", inativar);

export default router;