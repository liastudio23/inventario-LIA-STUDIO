import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Equipos from "./pages/Equipos";
import Responsables from "./pages/Responsables";
import Proyectos from "./pages/Proyectos";
import Salidas from "./pages/Salidas";
import Devoluciones from "./pages/Devoluciones";
import Mantenimiento from "./pages/Mantenimiento.jsx";
import Reportes from "./pages/Reportes.jsx";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/responsables" element={<Responsables />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/salidas" element={<Salidas />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
