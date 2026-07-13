import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./Pages/Login.tsx";
import Inicio from "./Pages/Inicio.tsx";
import InstrucoesPage from "./Pages/Como-avaliar.tsx";
import AvaliacaoPage from "./Pages/Avaliacao.tsx";
import {PrivateRoute, PrivateGlobal } from "./components/PrivateRoute";
import FichaAvaliacaoCondutor from "./Fichas/FichaAvaliacaoCondutor.tsx";
import FichaAvaliacaoTecEnf from "./Fichas/FichaAvaliacaoTecEnf.tsx";
import FichaAvaliacaoEnf from "./Fichas/FichaAvaliacaoEnf.tsx";
import FichaAvaliacaoMedico from "./Fichas/FichaAvaliacaoMedico.tsx";
import FichaAvaliacaoLiderancaLiderado from "./Fichas/FichaAvaliacaoLideranca-liderado.tsx";
import FichaAvaliacaoLideradoLideranca from "./Fichas/FichaAvaliacaoLiderado-lideranca.tsx";
import FichaAvaliacaoPar from "./Fichas/FichaAvaliacaoPar.tsx";
import PlanoDesenvolvimento from "./Pages/PlanoDesenvolvimento.tsx";
import Help from "./Pages/Help.tsx";

import CadastroPage from "./Pages/Cadastro.tsx";


import { UserSessionProvider } from "./contexts/UserSession";
import Configuracoes from "./Pages/Configuracoes.tsx";
import BaixarFicha from "./Pages/BaixarFicha.tsx";
import Painel from "./Pages/Painel.tsx";

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
          path="/Autoavaliacao"
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
          path="/avaliacao/lideranca-liderado"
          element={
            <PrivateRoute>
              <FichaAvaliacaoLiderancaLiderado />
            </PrivateRoute>
          }
        />
        <Route
          path="/avaliacao/liderado-lideranca"
          element={
            <PrivateRoute>
              <FichaAvaliacaoLideradoLideranca />
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
            <PrivateGlobal>
              <Configuracoes />
            </PrivateGlobal>
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

        <Route
          path="/painel-kpis"
          element={
            <PrivateRoute>
              <Painel />
            </PrivateRoute>
          }
        />

        <Route
          path="/plano-desenvolvimento"
          element={
            <PrivateRoute>
              <PlanoDesenvolvimento />
            </PrivateRoute>
          }
        />

        <Route
          path="/avaliacao/par"
          element={
            <PrivateRoute>
              <FichaAvaliacaoPar />
            </PrivateRoute>
          }
        />

        <Route
          path="/ajuda"
          element={
            <PrivateRoute>
              <Help/>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </UserSessionProvider>
);