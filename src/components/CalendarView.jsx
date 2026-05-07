import { useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView({ usuario }) {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-view">
      <header className="header-top">
        <div>
          <h1>Hello, {usuario}</h1>

          <p>Organize your schedule</p>
        </div>
      </header>

      <div className="calendar-main-grid">
        <div className="calendar-card">
          <div className="calendar-header-actions">
            <h3>My Calendar</h3>

            <button className="add-btn">+ Add</button>
          </div>

          <Calendar onChange={setDate} value={date} />
        </div>

        <aside className="calendar-sidebar-info">
          <div className="reminder-card">
            <h4>Selected date</h4>

            <p>
              {date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="reminder-card">
            <h4>Reminder</h4>

            <p>Meeting with team</p>

            <p>11:00 am - 13:00 pm</p>

            <button className="reschedule-btn">Reschedule</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
