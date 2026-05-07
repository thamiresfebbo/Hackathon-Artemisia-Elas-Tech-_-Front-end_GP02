import { useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView({ usuario }) {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-view">
      <header className="header-top">
        <div>
          <h1>Olá, {usuario}</h1>

          <p>Esses são seus compromissos</p>
        </div>
      </header>

      <div className="calendar-main-grid">
        <div className="calendar-card">
          <div className="calendar-header-actions">
            <h3>Minha Agenda</h3>
          </div>

          <Calendar onChange={setDate} value={date} />
        </div>

        <aside className="calendar-sidebar-info">
          <div className="reminder-card">
            <h4>Data</h4>

            <p>
              {date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <button className="btn-add-event">Agendar</button>
          </div>

          <div className="reminder-card">
            <h4>Lembrete</h4>

            <p>Reunião em grupo</p>

            <p>11:00 am - 13:00 pm</p>

            <button className="reschedule-btn">Reagendar</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
