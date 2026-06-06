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
import CadastroPage from "./Pages/Cadastro.tsx";



import { UserSessionProvider } from "./contexts/UserSession";

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
          path="/cadastro"
          element={
            <PrivateRoute>
              <CadastroPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </UserSessionProvider>
);