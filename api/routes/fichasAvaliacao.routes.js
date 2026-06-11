import { Router } from "express";
import {
  listarFichasAvaliacao

} from "../controller/fichasAvaliacao.controller.js";

const router = Router();

router.get("/api/fichas", listarFichasAvaliacao);

export default router;