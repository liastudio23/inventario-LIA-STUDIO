import { NavLink } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaProjectDiagram, FaSignOutAlt, FaUndo, FaTools, FaChartBar } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Gestión</h2>
      <nav>
        <ul>
          <li><NavLink to="/" className="nav-link"><FaHome /> Panel</NavLink></li>
          <li><NavLink to="/equipos" className="nav-link"><FaBox /> Equipos</NavLink></li>
          <li><NavLink to="/responsables" className="nav-link"><FaUsers /> Responsables</NavLink></li>
          <li><NavLink to="/proyectos" className="nav-link"><FaProjectDiagram /> Proyectos</NavLink></li>
          <li><NavLink to="/salidas" className="nav-link"><FaSignOutAlt /> Salidas</NavLink></li>
          <li><NavLink to="/devoluciones" className="nav-link"><FaUndo /> Devoluciones</NavLink></li>
          <li><NavLink to="/mantenimiento" className="nav-link"><FaTools /> Mantenimiento</NavLink></li>
          <li><NavLink to="/reportes" className="nav-link"><FaChartBar /> Reportes</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
