// src/components/Calendar/Calendar.jsx
import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

        const formatted = data.map((event) => ({
          title: event.title,
          start: new Date(event.date),
          end: new Date(event.date),
          allDay: true,
          type: event.type,
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Failed to load admin calendar:", err);
      }
    };

    fetchAdminCalendar();
  }, []);

  return (
    <div>
      <h2>Admin Order Calendar</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={(event) => {
          const bg = event.type === "pickup" ? "#4caf50" : "#f44336";
          return { style: { backgroundColor: bg } };
        }}
        style={{ height: 500 }}
      />
    </div>
  );
}
