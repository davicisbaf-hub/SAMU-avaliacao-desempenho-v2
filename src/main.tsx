import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./Pages/Login.tsx";
import Inicio from "./Pages/Inicio.tsx";
import InstrucoesPage from "./Pages/Como-avaliar.tsx";
import AvaliacaoPage from "./Pages/Avaliacao.tsx";
import PrivateRoute from "./components/PrivateRoute";
import FichaAvaliacaoCondutor from "./Fichas/FichaAvaliacaoCondutor.tsx";
import FichaAvaliacaoTecEnf from "./Fichas/FichaAvaliacaoTecEnf.tsx";
import FichaAvaliacaoEnf from "./Fichas/FichaAvaliacaoEnf.tsx";
import FichaAvaliacaoMedico from "./Fichas/FichaAvaliacaoMedico.tsx";
import FichaAvaliacaoLideranca from "./Fichas/FichaAvaliacaoLideranca.tsx";
import FichaAvaliacaoBpTeam from "./Fichas/FichaAvaliacaoBpTeam.tsx";


import CadastroPage from "./Pages/Cadastro.tsx";



import { UserSessionProvider } from "./contexts/UserSession";
import Configuracoes from "./Pages/Configuracoes.tsx";
import BaixarFicha from "./Pages/BaixarFicha.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <UserSessionProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<App />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Inicio />
            </PrivateRoute>
          }
        />

         <Route
          path="/instrucao"
          element={
            <PrivateRoute>
              <InstrucoesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/avaliacao"
          element={
            <PrivateRoute>
              <AvaliacaoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/avaliacao/condutor-socorrista"
          element={
            <PrivateRoute>
              <FichaAvaliacaoCondutor />
            </PrivateRoute>
          }
        />
        <Route
          path="/avaliacao/tecnico-enfermagem"
          element={
            <PrivateRoute>
              <FichaAvaliacaoTecEnf />
            </PrivateRoute>
          }
        />

        <Route
          path="/avaliacao/enfermeiro"
          element={
            <PrivateRoute>
              <FichaAvaliacaoEnf />
            </PrivateRoute>
          }
        />

        <Route
          path="/avaliacao/medico-intervencionista"
          element={
            <PrivateRoute>
              <FichaAvaliacaoMedico />
            </PrivateRoute>
          }
        />

        <Route
          path="/avaliacao/lideranca-coordenacao"
          element={
            <PrivateRoute>
              <FichaAvaliacaoLideranca />
            </PrivateRoute>
          }
        />

        <Route
          path="/avaliacao/bp-team"
          element={
            <PrivateRoute>
              <FichaAvaliacaoBpTeam />
            </PrivateRoute>
          }
        />

        <Route
          path="/cadastro"
          element={
            <PrivateRoute>
              <CadastroPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/configuracoes"
          element={
            <PrivateRoute>
              <Configuracoes />
            </PrivateRoute>
          }
        />

        <Route
          path="/BaixarFicha"
          element={
            <PrivateRoute>
              <BaixarFicha />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </UserSessionProvider>
);