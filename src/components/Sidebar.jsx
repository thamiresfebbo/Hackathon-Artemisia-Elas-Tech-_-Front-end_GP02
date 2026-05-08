import React, { useState } from "react";
import logo from "../assets/icons8-money-box-64.png";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Calendar,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({ telaAtiva, setTelaAtiva }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = (tela) => {
    setTelaAtiva(tela);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão menu mobile */}
      <button
        className="menu-mobile-toggle"
        onClick={toggleMenu}
        aria-label="Abrir menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <img src={logo} alt="Logo" className="logo" />

        <nav>
          {/* Dashboard */}
          <button
            className={`nav-btn ${telaAtiva === "dashboard" ? "active" : ""}`}
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          {/* Agenda */}
          <button
            className={`nav-btn ${telaAtiva === "Agenda" ? "active" : ""}`}
            onClick={() => navigate("Agenda")}
          >
            <Calendar size={20} />
            Agenda
          </button>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="nav-btn">
            <Settings size={20} />
            Configurações
          </button>

          <button className="nav-btn">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
