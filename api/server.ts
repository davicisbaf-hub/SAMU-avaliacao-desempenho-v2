import express from "express";
import cors from "cors";
import { parse } from "yaml";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// rotas
import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";
import avaliacoesRoutes from "./routes/avaliacoes.js";
import criteriosRoutes from "./routes/criterios.js";
import kpisRoutes from "./routes/kpis.js";
import auxiliaresRoutes from "./routes/auxiliares.js";
import { autenticar } from "./middleware/auth.js";


import { apiReference } from "@scalar/express-api-reference";
import { readFileSync } from "fs";




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
    "http://localhost:8765",
    "http://127.0.0.1:8765",
    "https://avaliacao360.cisbaf.org.br",
  ],
}));

const ScalarDocs = parse(
  readFileSync(join(__dirname, "ScalarDocs.yaml"), "utf-8")
);

app.get("/openapi.json", (req, res) => {
  res.json(ScalarDocs);
});

app.use(
  "/docs",
  apiReference({
    url: "/openapi.json",

    theme: "moon",
    layout: "modern",
    title: "API #1",
    showSidebar: true,
    defaultOpenFirstTag: true,
    showDeveloperTools: "never"
  })
);

// Rotas da API

app.use("/", authRoutes);

app.use(autenticar);
app.use("/", usuariosRoutes);
app.use("/", avaliacoesRoutes);
app.use("/", criteriosRoutes);
app.use("/", kpisRoutes);
app.use("/", auxiliaresRoutes);

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
  console.log(`Swagger UI:       http://localhost:${port}/docs`);
});