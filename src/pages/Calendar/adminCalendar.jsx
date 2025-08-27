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

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

        const formatted = data.flatMap((order) => [
          {
            title: `Pickup Order #${order.orderId}`,
            start: new Date(order.pickupDate),
            end: new Date(order.pickupDate),
            allDay: true,
            type: "pickup",
          },
          {
            title: `Return Order #${order.orderId}`,
            start: new Date(order.returnDate),
            end: new Date(order.returnDate),
            allDay: true,
            type: "return",
          },
        ]);

        setEvents(formatted);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };

    fetchOrders();
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
      />
    </div>
  );
}
