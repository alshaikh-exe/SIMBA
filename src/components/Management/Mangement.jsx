import React, { useState, useEffect } from "react";
// just import the SCSS so its global classes apply
import "./Management.module.scss";

const Management = () => {
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await fetch("/api/items/low-stock");
        const data = await res.json();
        setLowStockItems(data.items || []);
      } catch (error) {
        console.error("Error fetching low stock items: ", error);
      }
    };
    fetchLowStock();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/management/request-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, title, body }),
      });

      if (res.ok) {
        setMessage("Request email sent successfully!");
        setEmail("");
        setTitle("");
        setBody("");
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || "Failed to send request");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-container">
      <h1>Management</h1>

      <form className="management-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Supplier Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          required
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}

      <div className="low-stock-section">
        <h2>Low Stock Items</h2>
        {lowStockItems.length > 0 ? (
          <ul>
            {lowStockItems.map((item) => (
              <li key={item._id}>
                {item.name} – Only {item.quantity} left
              </li>
            ))}
          </ul>
        ) : (
          <p>All items are sufficiently stocked ✅</p>
        )}
      </div>
    </div>
  );
};

export default Management;