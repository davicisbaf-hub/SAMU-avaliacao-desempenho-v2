import { Router } from "express";
import {
  listarFichas,
  listarFichasVw,
  listarFrequencias,
  listarFluxos,
  listarBases,
  listarEscalaLikert,
  listarPesosAvaliacao,
} from "../controllers/auxiliaresController.js";

const router = Router();

router.get("/fichas", listarFichas);
router.get("/fichasVw", listarFichasVw);
router.get("/frequencias", listarFrequencias);
router.get("/fluxos-avaliacao", listarFluxos);
router.get("/bases", listarBases);
router.get("/escala-likert", listarEscalaLikert);
router.get("/pesos-avaliacao", listarPesosAvaliacao);

export default router;