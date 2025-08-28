// src/pages/Management/StockRequest/StockRequestPage.jsx
import React, { useState, useEffect } from "react";
import styles from "./Management.module.scss";

import sendRequest from "../../utilities/send-request";
import { getLowStock } from "../../utilities/items-api";

const Management = () => {
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);     // for submit button
  const [loadingLow, setLoadingLow] = useState(true); // for low-stock list
  const [message, setMessage] = useState("");
  const [lowErr, setLowErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingLow(true);
        setLowErr("");
        const res = await getLowStock(); // or getLowStock(5) to force a threshold
        const items = res?.data ?? res?.items ?? [];
        if (mounted) setLowStockItems(items);
      } catch (error) {
        console.error("Error fetching low stock items:", error);
        if (mounted) setLowErr(error?.message || "Failed to fetch low stock items");
      } finally {
        if (mounted) setLoadingLow(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await sendRequest("/api/management/request-stock", "POST", { email, title, body });
      setMessage("Request email sent successfully!");
      setEmail(""); setTitle(""); setBody("");
    } catch (error) {
      console.error(error);
      setMessage(error?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-container">
      <h1>Management</h1>

      <form className="management-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Supplier Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Title" value={title} required onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Body" value={body} required onChange={(e) => setBody(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send"}</button>
      </form>

      {message && <p className="status-message">{message}</p>}

      <div className="low-stock-section">
        <h2>Low Stock Items</h2>

        {loadingLow && <p>Loading low-stock items…</p>}
        {!loadingLow && lowErr && <p className="status-message" style={{ color: "crimson" }}>{lowErr}</p>}

        {!loadingLow && !lowErr && (
          lowStockItems.length > 0 ? (
            <ul>
              {lowStockItems.map((item) => (
                <li key={item._id}>
                  {item.name} – Only {item.quantity} left
                </li>
              ))}
            </ul>
          ) : (
            <p>All items are sufficiently stocked ✅</p>
          )
        )}
      </div>
    </div>
  );
};

export default Management;
