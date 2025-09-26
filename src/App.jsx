import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./pages/MainMenu";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/cotizar" element={<div className="text-white">Pantalla Cotizar</div>} />
        <Route path="/consultar" element={<div className="text-white">Pantalla Consultar</div>} />
        <Route path="/entregar" element={<div className="text-white">Pantalla Entregar</div>} />
        <Route path="/pendientes" element={<div className="text-white">Pantalla Pendientes</div>} />
        <Route path="/registrar" element={<div className="text-white">Pantalla Registrar</div>} />
      </Routes>
    </Router>
  );
}

export default App;
