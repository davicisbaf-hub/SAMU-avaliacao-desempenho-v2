import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";
import avaliacoesRoutes from "./routes/avaliacoes.js";
import criteriosRoutes from "./routes/criterios.js";
import fichasRoutes from "./routes/fichas.js";
import configuracoesRoutes from "./routes/configuracoes.js";
import basesRoutes from "./routes/bases.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.1.10:5173",
    ],
  })
);

app.use(authRoutes);
app.use(usuariosRoutes);
app.use(avaliacoesRoutes);
app.use(criteriosRoutes);
app.use(fichasRoutes);
app.use(configuracoesRoutes);
app.use(basesRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});