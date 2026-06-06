import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./Pages/Login.tsx";
import Inicio from "./Pages/Inicio.tsx";
import InstrucoesPage from "./Pages/Como-avaliar.tsx";
import AvaliacaoPage from "./Pages/Avaliacao.tsx";
import PrivateRoute from "./components/PrivateRoute";


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
      </Routes>
    </BrowserRouter>
  </UserSessionProvider>
);