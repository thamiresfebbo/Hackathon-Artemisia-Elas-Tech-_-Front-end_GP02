import React, { useState } from "react";
import {
  LayoutDashboard,
  ReceiptText,
  Wallet2,
  PieChart,
  Settings,
  LogOut,
  Calendar,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({ telaAtiva, setTelaAtiva }) => {
  // Estado para controlar se o menu está aberto no mobile
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Função para mudar de tela e fechar o menu automaticamente
  const navigate = (tela) => {
    setTelaAtiva(tela);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão Hambúrguer: aparece apenas via CSS Media Query no mobile */}
      <button
        className="menu-mobile-toggle"
        onClick={toggleMenu}
        aria-label="Abrir menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay: escurece o fundo ao abrir o menu no mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">FinSet</div>

        <nav>
          <button
            className={`nav-btn ${telaAtiva === "dashboard" ? "active" : ""}`}
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            className={`nav-btn ${telaAtiva === "schedule" ? "active" : ""}`}
            onClick={() => navigate("schedule")}
          >
            <Calendar size={20} />
            Schedule
          </button>

          <button className="nav-btn" onClick={() => setIsOpen(false)}>
            <ReceiptText size={20} />
            Transactions
          </button>

          <button className="nav-btn" onClick={() => setIsOpen(false)}>
            <Wallet2 size={20} />
            Wallet
          </button>

          <button className="nav-btn" onClick={() => setIsOpen(false)}>
            <PieChart size={20} />
            Analytics
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-btn">
            <Settings size={20} />
            Settings
          </button>

          <button className="nav-btn">
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
