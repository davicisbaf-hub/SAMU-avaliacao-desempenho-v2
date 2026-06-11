import express from "express";
import cors from "cors";

import fichasRoutes from "./routes/fichasAvaliacao.routes.js";
import frequanciaRoutes from "./routes/frequenciaAplicacao.routes.js"
import fluxoRoutes from "./routes/fluxoAvaliacao.routes.js"

const app = express();
app.use(express.json());
app.use(cors())
const port = process.env.PORT || 3001;


app.use(fichasRoutes);
app.use(frequanciaRoutes);
app.use(fluxoRoutes);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});