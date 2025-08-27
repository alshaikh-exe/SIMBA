import { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar({ user }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch("/api/calendar/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },//who is making the request
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
        console.error("Failed to load calendar:", err);
      }
    };

    fetchCalendar();
  }, [user]);

  return (
    <div>
      <h2>Your Order Calendar</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={(event) => {
          let bg = event.type === "pickup" ? "#4caf50" : "#f44336";
          return { style: { backgroundColor: bg } };
        }}
      />
    </div>
  );
}
