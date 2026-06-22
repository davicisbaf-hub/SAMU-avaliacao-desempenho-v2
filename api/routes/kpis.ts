import { Router } from "express";
import {
  avaliacoesPorCategoria,
  avaliacoesPorProfissional,
} from "../controllers/kpisController.js";

const router = Router();

router.get("/kpis/avaliacoes-por-categoria", avaliacoesPorCategoria);
router.get("/kpis/avaliacoes-por-profissional", avaliacoesPorProfissional);

export default router;