// components/Booking/StudentRequests/StudentRequests.jsx
import React, { useEffect, useState } from "react";
import styles from "./StudentRequestsPage.module.scss";
import {
  getStudentRequests,   // now -> GET /api/orders?scope=requested
  getMyRequests,        // now -> GET /api/orders
  approveOrder,         // <-- added in requests-api.js
} from "../../../utilities/requests-api";

const StudentRequests = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = isAdmin ? await getStudentRequests() : await getMyRequests();
      const data = Array.isArray(res?.data) ? res.data : [];
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [isAdmin]);

  // --- Admin actions ---
  async function handleApproveAll(order) {
  try {
    const decisions = (order.lineItems || []).map((li) => ({
      item: li.item?._id || li.item,
      decision: "return",
      approvedDays: li.requestedDays || 1,
    }));

    // Optimistically remove from list
    setOrders(prev => prev.filter(o => o._id !== order._id));

    await approveOrder(order._id, { decisions });

    // Safety reload to reflect any other changes
    await load();
  } catch (e) {
    // On error, reload to restore
    await load();
    setError(e.message || "Failed to approve order.");
  }
}

async function handleReject(order) {
  try {
    setOrders(prev => prev.filter(o => o._id !== order._id));
    await approveOrder(order._id, { reject: true });
    await load();
  } catch (e) {
    await load();
    setError(e.message || "Failed to reject order.");
  }
}


  async function handleReject(order) {
    try {
      await approveOrder(order._id, { reject: true });
      await load();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to reject order.");
    }
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Student Requests</h2>
      <p className={styles.userline}>User: {user?.name || "Guest"}</p>

      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loading}>Loading…</div>}

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>{isAdmin ? "All Student Requests" : "My Orders"}</h3>
          <span className={styles.count}>{orders.length}</span>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>🧰</div>
            <div className={styles.emptyTitle}>No orders found</div>
            <div className={styles.emptySub}>
              {isAdmin ? "No pending orders to approve." : "Create an order from the items catalog."}
            </div>
          </div>
        ) : (
          <div className={styles.reqList}>
            {orders.map((order) => (
              <article key={order._id} className={styles.reqCard}>
                <div className={styles.reqMeta}>
                  <div className={styles.reqItem}>
                    {/* Top line: requester (admin sees who requested) */}
                    {isAdmin ? (order.user?.name || order.user?.email || "Unknown user") : "Order"}
                  </div>
                  <span className={`${styles.badge} ${styles[order.status || "pending"]}`}>
                    {order.status || "pending"}
                  </span>
                </div>

                {/* Lines/items */}
                <div className={styles.reqBody}>
                  {(order.lineItems || []).length === 0 ? (
                    <div>—</div>
                  ) : (
                    <ul className={styles.lines}>
                      {order.lineItems.map((li, idx) => (
                        <li key={li._id || idx} className={styles.line}>
                          <div className={styles.lineMain}>
                            <span className={styles.lineName}>
                              {li.item?.name || "Unnamed item"}
                            </span>
                            <span className={styles.lineInfo}>
                              requestedDays: {li.requestedDays ?? "—"}
                            </span>
                          </div>
                          {li.status && (
                            <span className={`${styles.badge} ${styles[li.status]}`}>
                              {li.status}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.reqFooter}>
                  <span className={styles.date}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
                  </span>

                  {/* Admin actions for pending orders */}
                  {isAdmin && order.status === "requested" && (
                    <div className={styles.actions}>
                      <button
                        className={styles.primaryBtn}
                        onClick={() => handleApproveAll(order)}
                        title="Approve all lines for their requested days"
                      >
                        Approve All
                      </button>
                      <button
                        className={styles.primaryBtn}
                        onClick={() => handleReject(order)}
                      >
                        Reject Order
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentRequests;