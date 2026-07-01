import express from "express";
import cors from "cors";


// rotas
import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";
import avaliacoesRoutes from "./routes/avaliacoes.js";
import criteriosRoutes from "./routes/criterios.js";
import kpisRoutes from "./routes/kpis.js";
import auxiliaresRoutes from "./routes/auxiliares.js";
import { autenticar } from "./middleware/auth.js";

// swaggerUi

// import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// const swaggerDoc = parse(
//  readFileSync(join(__dirname, "swagger.yaml"), "utf-8")
//);
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


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