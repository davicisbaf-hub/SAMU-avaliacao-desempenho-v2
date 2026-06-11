import { Router } from "express";
import {
  listarFluxoAvaliacao
} from "../controller/fluxoAvaliacao.controller.js";

const router = Router();

app.get("/api/fluxos-avaliacao", listarFluxoAvaliacao)

export default router