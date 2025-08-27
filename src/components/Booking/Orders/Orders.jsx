// src/pages/Orders/Orders.jsx (or wherever you keep it)
import React from "react";
import styles from "./Orders.module.scss";

export default function Orders({ user, orders = [] }) {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleString() : "—";

  const statusClass = (s = "") => {
    const k = s.toLowerCase();
    if (k.includes("approved") || k.includes("accepted") || k.includes("confirmed")) return styles.badgeApproved;
    if (k.includes("rejected") || k.includes("declined")) return styles.badgeRejected;
    if (k.includes("fulfilled") || k.includes("completed")) return styles.badgeFulfilled;
    if (k.includes("pending")) return styles.badgePending;
    return styles.badgeDefault;
  };

  return (
    <section className={styles.orders}>
      <header className={styles.head}>
        <h2>My Orders</h2>
        <span className={styles.count}>{orders.length}</span>
      </header>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🧺</div>
          <h3>No orders yet</h3>
          <p>Browse items and add them to your cart to create your first order.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => {
            const items = order.items || [];
            const idShort = (order.id || order._id || "").toString().slice(-6);
            return (
              <article key={order.id || order._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.orderId}>
                    <span className={styles.hash}>#</span>
                    {idShort || "—"}
                  </div>
                  <span className={`${styles.badge} ${statusClass(order.status)}`}>
                    {order.status || "Unknown"}
                  </span>
                </div>

                <div className={styles.meta}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}>📅</span>
                    <span className={styles.metaText}>{formatDate(order.date)}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaIcon}>📦</span>
                    <span className={styles.metaText}>
                      {items.length} item{items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  {order.note && (
                    <div className={`${styles.metaRow} ${styles.note}`}>
                      <span className={styles.metaIcon}>📝</span>
                      <span className={styles.metaText}>{order.note}</span>
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <ul className={styles.items}>
                    {items.slice(0, 4).map((it, idx) => (
                      <li key={idx} className={styles.itemRow}>
                        <span className={styles.dot} />
                        <span className={styles.itemName}>
                          {it.name || it.title || "Item"}
                        </span>
                        {it.quantity != null && (
                          <span className={styles.itemQty}>×{it.quantity}</span>
                        )}
                      </li>
                    ))}
                    {items.length > 4 && (
                      <li className={styles.more}>+{items.length - 4} more…</li>
                    )}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
