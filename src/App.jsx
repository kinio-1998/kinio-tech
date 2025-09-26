import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./pages/MainMenu";
import Registrar from "./pages/Registrar";
import Cotizar from "./pages/Cotizar";
import Consultar from "./pages/Consultar";
import Entregar from "./pages/Entregar";
import Pendientes from "./pages/Pendientes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
  <Route path="/cotizar" element={<Cotizar />} />
  <Route path="/consultar" element={<Consultar />} />
  <Route path="/entregar" element={<Entregar />} />
  <Route path="/pendientes" element={<Pendientes />} />
  <Route path="/registrar" element={<Registrar />} />
      </Routes>
    </Router>
  );
}

export default App;
