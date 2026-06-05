import './index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
const root = document.getElementById("root");

import App from './Pages/Login.tsx'
import Inicio from './Pages/Inicio.tsx';
import InstrucoesPage from './Pages/Como-avaliar.tsx'


ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<App />} />
      <Route path="/" element={<Inicio />} />
      <Route path="/instrucao" element={<InstrucoesPage />} />
    </Routes>
  </BrowserRouter>,
);