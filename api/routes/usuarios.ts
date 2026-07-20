import { Router } from "express";
import {
  listar,
  listarPorBase,
  cadastrar,
  atualizar,
  inativar,
  getMe,
  senhaMaster,
  resetSenha
} from "../controllers/usuariosController.js";

const router = Router();

router.get("/usuarios", listar);
router.get("/usuarios/base/:base", listarPorBase);
router.get("/me", getMe);

router.post("/usuarios", cadastrar);

router.put("/usuarios/senhaMaster/:id", senhaMaster);
router.put("/usuarios/resetSenha/:id", resetSenha);
router.put("/usuarios/:id/inativar", inativar);
router.put("/usuarios/:id", atualizar);

export default router;