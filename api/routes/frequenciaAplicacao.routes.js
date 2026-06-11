import {Router} from "express";

import {
  listFrequencias
} from "../controllers/frequenciaAplicacao.controller.js";

export const router = Router();

router.get("/api/frequencias", listFrequencias)

export default router;