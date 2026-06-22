import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";
import avaliacoesRoutes from "./routes/avaliacoes.js";
import criteriosRoutes from "./routes/criterios.js";
import kpisRoutes from "./routes/kpis.js";
import auxiliaresRoutes from "./routes/auxiliares.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.10:5173",
    "http://192.168.1.10:8766",
    "http://192.168.1.10:8026",
    "https://avaliacao360.cisbaf.org.br",
  ],
}));

app.use("/", authRoutes);
app.use("/", usuariosRoutes);
app.use("/", avaliacoesRoutes);
app.use("/", criteriosRoutes);
app.use("/", kpisRoutes);
app.use("/", auxiliaresRoutes);

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});