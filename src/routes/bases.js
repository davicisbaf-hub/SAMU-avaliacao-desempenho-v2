import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/api/bases", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM bases
    ORDER BY nome
  `);

  res.json(rows);
});

export default router;