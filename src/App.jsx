import React, { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

import "./styles.css";

import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import CategoryItem from "./components/CategoryItem";
import CalendarView from "./components/CalendarView";

import {
  listarTransacoes,
  adicionarTransacao,
  deletarTransacao,
} from "./services/api";

import dataJson from "./data.json";

function App() {
  const API_KEY = "46b6560d91cd5cfa95eb15881037aa31";

  // =========================
  // STATES
  // =========================

  const [telaAtiva, setTelaAtiva] = useState("dashboard");

  const [data, setData] = useState({
    usuario: "Thamires",
    saldo: 0,
    renda: 0,
    gastos: 0,
    transacoes: [],
  });

  const [form, setForm] = useState({
    data: "",
    categoria: "",
    valor: "",
  });

  const [weather, setWeather] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // =========================
  // TRANSAÇÕES
  // =========================

  async function carregarTransacoes() {
    try {
      const transacoesAPI = await listarTransacoes();

      let saldo = 0;
      let renda = 0;
      let gastos = 0;

      transacoesAPI.forEach((t) => {
        const valor = Number(t.valor);

        saldo += valor;

        if (valor > 0) renda += valor;
        else gastos += Math.abs(valor);
      });

      setData((prev) => ({
        ...prev,
        saldo,
        renda,
        gastos,
        transacoes: transacoesAPI,
      }));
    } catch (error) {
      console.log("Erro ao carregar transações:", error);
    }
  }

  useEffect(() => {
    carregarTransacoes();
  }, []);

  // =========================
  // FORM
  // =========================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddTransacao() {
    if (!form.data || !form.categoria || !form.valor) return;

    await adicionarTransacao({
      data: form.data,
      categoria: form.categoria,
      valor: Number(form.valor),
    });

    setForm({ data: "", categoria: "", valor: "" });

    carregarTransacoes();
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(id) {
    if (!id) return;

    const confirmar = window.confirm("Deseja excluir esta transação?");
    if (!confirmar) return;

    await deletarTransacao(id);
    carregarTransacoes();
  }

  // =========================
  // HORA
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const hora = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const dataAtual = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });

      setCurrentTime(`${dataAtual} - ${hora}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // CLIMA
  // =========================

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Sao Paulo&appid=${API_KEY}&units=metric&lang=pt_br`,
        );

        const weatherData = await response.json();

        setWeather(weatherData);

        const icon = weatherData.weather?.[0]?.icon;

        if (icon) {
          setWeatherIcon(`https://openweathermap.org/img/wn/${icon}@2x.png`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchWeather();
  }, []);

  // =========================
  // CATEGORIAS
  // =========================

  const calcularCategorias = () => {
    const totais = {};
    let gastoTotal = 0;

    data.transacoes.forEach((t) => {
      if (t.valor < 0) {
        const valor = Math.abs(Number(t.valor));

        totais[t.categoria] = (totais[t.categoria] || 0) + valor;
        gastoTotal += valor;
      }
    });

    if (gastoTotal === 0) return [];

    return Object.keys(totais)
      .map((cat) => ({
        nome: cat,
        porcentagem: Math.round((totais[cat] / gastoTotal) * 100),
      }))
      .sort((a, b) => b.porcentagem - a.porcentagem);
  };

  const categoriasProcessadas = calcularCategorias();

  // =========================
  // UI
  // =========================

  return (
    <div className="app-container">
      <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />

      <main className="main-content">
        {telaAtiva === "dashboard" ? (
          <>
            <header className="header-top">
              <div>
                <h1>Olá, {data.usuario}!</h1>
                <p className="saudacao-header">{currentTime}</p>

                {weather && (
                  <div className="weather">
                    {weatherIcon && (
                      <img
                        src={weatherIcon}
                        alt="clima"
                        className="weather-icon"
                      />
                    )}

                    <p>
                      {weather.main.temp}°C -{" "}
                      {weather.weather?.[0]?.description}
                    </p>
                  </div>
                )}
              </div>
            </header>

            {/* CARDS */}
            <div className="cards-grid">
              <Card title="Saldo" value={data.saldo} icon={<Wallet />} />
              <Card title="Receita" value={data.renda} icon={<TrendingUp />} />
              <Card
                title="Gastos"
                value={data.gastos}
                icon={<TrendingDown />}
              />
            </div>

            {/* FORM (AGORA ABAIXO DOS CARDS) */}
            <div className="transaction-form">
              <h2>Nova Transação</h2>

              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
              />

              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria</option>
                {dataJson.categorias.map((cat) => (
                  <option key={cat.nome} value={cat.nome}>
                    {cat.nome}
                  </option>
                ))}
              </select>

              <input
                name="valor"
                type="number"
                placeholder="Valor"
                value={form.valor}
                onChange={handleChange}
              />

              <button onClick={handleAddTransacao}>Adicionar</button>
            </div>

            {/* CATEGORIAS */}
            <div>
              {categoriasProcessadas.map((item) => (
                <CategoryItem
                  key={item.nome}
                  label={item.nome}
                  value={item.porcentagem}
                />
              ))}
            </div>

            {/* EXTRATO */}
            <div className="extrato">
              <h2>Extrato</h2>

              {data.transacoes.map((t) => (
                <div key={t._id} className="extrato-item">
                  <div>
                    <strong>{t.categoria}</strong>
                    <small>{t.data}</small>
                  </div>

                  <div>
                    <span
                      style={{
                        color: t.valor < 0 ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      R$ {Math.abs(t.valor)}
                    </span>

                    <button onClick={() => handleDelete(t._id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <CalendarView
            usuario={data.usuario}
            transacoes={data.transacoes}
            onAddTransacao={async (nova) => {
              await adicionarTransacao(nova);
              carregarTransacoes();
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
