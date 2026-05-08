import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView({ usuario, onAddTransacao, transacoes }) {
  const [date, setDate] = useState(new Date());

  const [form, setForm] = useState({
    categoria: "",
    valor: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit() {
    if (!form.categoria || !form.valor) return;

    onAddTransacao({
      data: date.toISOString().split("T")[0], // 📅 data automática do calendário
      categoria: form.categoria,
      valor: Number(form.valor),
    });

    setForm({
      categoria: "",
      valor: "",
    });
  }

  // 🔮 previsão do dia selecionado
  const previsaoDia = transacoes
    ?.filter((t) => t.data === date.toISOString().split("T")[0])
    .reduce((acc, t) => acc + t.valor, 0);

  return (
    <div className="calendar-view">
      <header className="header-top">
        <div>
          <h1>Olá, {usuario}</h1>
          <p className="saudacao-header">Planeje seus gastos por dia</p>
        </div>
      </header>

      <div className="calendar-main-grid">
        <div className="calendar-card">
          <h3>Minha Agenda</h3>

          <Calendar onChange={setDate} value={date} />

          <div className="calendar-input-area">
            {" "}
            <h4>Data selecionada:</h4>
            <p>{date.toLocaleDateString("pt-BR")}</p>
            {/* 🔮 PREVISÃO DO DIA */}
            <p className="calendar-previsao">
              <strong>Previsão financeira do dia:</strong>{" "}
              {previsaoDia >= 0 ? "Sobra" : "Déficit"} R$ {previsaoDia}
            </p>
            {/* FORM */}
            <input
              name="categoria"
              placeholder="Categoria (ex: mercado)"
              value={form.categoria}
              onChange={handleChange}
            />
            <input
              name="valor"
              type="number"
              placeholder="Valor (- gasto / + receita)"
              value={form.valor}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Adicionar na data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
