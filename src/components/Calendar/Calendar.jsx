// src/components/Calendar/Calendar.jsx
import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./AdminCalendar.module.scss";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAdminCalendar = async () => {
      try {
        const res = await fetch("/api/calendar/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        const formatted = (data || []).map((event) => ({
          title: event.title,
          start: new Date(event.date),
          end: new Date(event.date),
          allDay: true,
          type: event.type, // "pickup" or something else
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Failed to load admin calendar:", err);
      }
    };

    fetchAdminCalendar();
  }, []);

  return (
    <section className={styles.wrap}>
      <header className={styles.head}>
        <h2 className={styles.title}>Admin Order Calendar</h2>

        <div className={styles.legend}>
          <span className={styles.dot} data-variant="pickup" /> Pickup
          <span className={styles.dot} data-variant="return" /> Return
        </div>
      </header>

      <div className={styles.card}>
        <BigCalendar
          className={styles.calendar}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          popup
          eventPropGetter={(event) => {
            // keep your color logic, but let CSS handle the rest
            const bg = event.type === "pickup" ? "#39a067" : "#cf4a4a";
            return {
              style: {
                backgroundColor: bg,
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,.08)",
              },
            };
          }}
          style={{ height: 560 }}
        />
      </div>
    </section>
  );
}
