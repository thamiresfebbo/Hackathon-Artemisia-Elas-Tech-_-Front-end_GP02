import React, { useState, useEffect } from "react";

import { Wallet, TrendingUp, TrendingDown, Bell } from "lucide-react";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import dataRaw from "./data.json";
import "./styles.css";

import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import CategoryItem from "./components/CategoryItem";
import CalendarView from "./components/CalendarView";

function App() {
  const [telaAtiva, setTelaAtiva] = useState("dashboard");
  const [data] = useState(dataRaw);

  const [insight, setInsight] = useState("");

  const [weather, setWeather] = useState(null);

  const [currentTime, setCurrentTime] = useState("");
  // sua chave de API do OpenWeatherMap
  const API_KEY = "46b6560d91cd5cfa95eb15881037aa31";

  // =========================
  // INSIGHTS
  // =========================

  useEffect(() => {
    const { clima, evento } = data.contexto;

    if (clima === "Chuva") {
      setInsight(
        `Previsão de ${clima}: cuidado com gastos extras de transporte para o ${evento}!`,
      );
    } else {
      setInsight("O clima está ótimo! Que tal economizar indo a pé?");
    }
  }, [data]);

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
      } catch (error) {
        console.log(error);
      }
    }

    fetchWeather();
  }, []);

  // =========================
  // DATA E HORA
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
  // CATEGORIAS
  // =========================

  const calcularCategorias = () => {
    const totais = {};

    let gastoTotal = 0;

    data.transacoes.forEach((t) => {
      if (t.valor < 0) {
        const valorAbsoluto = Math.abs(t.valor);

        totais[t.categoria] = (totais[t.categoria] || 0) + valorAbsoluto;

        gastoTotal += valorAbsoluto;
      }
    });

    return Object.keys(totais)
      .map((cat) => ({
        nome: cat,
        porcentagem: Math.round((totais[cat] / gastoTotal) * 100),
      }))
      .sort((a, b) => b.porcentagem - a.porcentagem);
  };

  const categoriasProcessadas = calcularCategorias();

  return (
    <div className="app-container">
      <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />

      <main className="main-content">
        {telaAtiva === "dashboard" ? (
          <>
            <header className="header-top">
              <div>
                <h1>Olá, {data.usuario}!</h1>

                <p>{currentTime}</p>

                {weather && (
                  <div className="weather-info">
                    <img
                      className="weather-icon"
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                      alt={weather.weather[0].description}
                    />

                    <div>
                      <p>
                        {weather.main.temp}°C - {weather.weather[0].description}
                      </p>

                      <p>{weather.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="user-profile">
                <Bell size={20} className="icon-btn" />

                <div className="avatar">AL</div>
              </div>
            </header>

            <div className="cards-grid">
              <Card
                title="Total Balance"
                value={data.saldo}
                icon={<Wallet color="#7B61FF" />}
              />

              <Card
                title="Income"
                value={data.renda}
                icon={<TrendingUp color="#4CAF50" />}
              />

              <Card
                title="Expense"
                value={data.gastos}
                icon={<TrendingDown color="#F44336" />}
              />
            </div>

            <div className="insight-banner">
              <Bell size={20} />

              <span>
                <strong>Smart Insight:</strong> {insight}
              </span>
            </div>

            <div className="dashboard-footer-grid">
              <div className="chart-box">
                <h3>Money flow</h3>

                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.transacoes}>
                      <XAxis dataKey="data" />

                      <Tooltip />

                      <Bar
                        dataKey="valor"
                        fill="#7B61FF"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="categories-box">
                <h3>Budget Categories</h3>

                {categoriasProcessadas.map((item, index) => (
                  <CategoryItem
                    key={index}
                    label={item.nome}
                    value={item.porcentagem}
                    color={index === 0 ? "#221560" : "#A594FF"}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <CalendarView
            usuario={data.usuario}
            currentTime={currentTime}
            weather={weather}
          />
        )}
      </main>
    </div>
  );
}

export default App;
