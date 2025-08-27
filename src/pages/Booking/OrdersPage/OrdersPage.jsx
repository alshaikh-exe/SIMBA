// src/pages/Booking/OrdersPage/OrdersPage.jsx (merged)
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getOrders } from '../../../utilities/orders-api';
import OrdersTable from '../../../components/Booking/Orders/Orders';
import styles from './OrdersPage.module.scss';

export default function OrdersPage() {
  const { orderId } = useParams();
  const [groups, setGroups] = useState({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const bucketize = useCallback((orders) => {
    const pending = [];
    const approved = [];
    const rejected = [];
    for (const o of orders) {
      const s = String(o.status || '').toLowerCase();
      if (s === 'approved') approved.push(o);
      else if (s === 'rejected') rejected.push(o);
      else pending.push(o); // includes 'pending', 'requested', 'open', etc.
    }
    return { pending, approved, rejected };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setErr('');
      const res = await getOrders();
      if (!res?.success) throw new Error(res?.message || 'Failed to load orders');
      setGroups(bucketize(res.data || []));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [bucketize]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (loading) return <div className={styles.center}>Loading…</div>;
  if (err) return <div className={styles.error}>{err}</div>;

  // --- Single order view (when :orderId present) ---
  if (orderId) {
    const all = [...groups.pending, ...groups.approved, ...groups.rejected];
    const order = all.find(o => String(o._id) === String(orderId));

    if (!order) {
      return (
        <div className={styles.page}>
          <h1>Order not found</h1>
          <p>We couldn’t find an order with ID <code>{orderId}</code>.</p>
        </div>
      );
    }

    const shortId = (order._id || '').slice(-6).toUpperCase();
    return (
      <div className={styles.page}>
        <h1>Order #{shortId}</h1>
        <div className={styles.card}>
          <header className={styles.header}>
            <strong>Status:</strong>&nbsp;<span className={styles.badge}>{order.status}</span>
            {order.user && (
              <span className={styles.userTag}>
                {order.user.name}{order.user.email ? ` • ${order.user.email}` : ''}
              </span>
            )}
          </header>
          <OrdersTable
            lines={order.lineItems}
            showRequestedDays={true}
            showAdminDecision={false}
          />
          {order.approvedAt && (
            <p className={styles.meta}>
              <strong>Approved at:</strong> {new Date(order.approvedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- List view (bucketed sections) ---
  const Section = ({ title, items }) => (
    <section className={styles.section}>
      <h2>{title}</h2>
      {items.length ? items.map(order => {
        const shortId = (order._id || '').slice(-6).toUpperCase();
        return (
          <div key={order._id} className={styles.card}>
            <header className={styles.header}>
              <strong>Order #{shortId}</strong>
              <span className={styles.badge}>{order.status}</span>
              {order.user && (
                <span className={styles.userTag}>
                  {order.user.name}{order.user.email ? ` • ${order.user.email}` : ''}
                </span>
              )}
            </header>
            <OrdersTable
              lines={order.lineItems}
              showRequestedDays={true}
              showAdminDecision={false}
            />
          </div>
        );
      }) : <p>No {title.toLowerCase()}.</p>}
    </section>
  );

  return (
    <div className={styles.page}>
      <h1>My Orders</h1>
      <Section title="Pending Orders" items={groups.pending} />
      <Section title="Approved Orders" items={groups.approved} />
      <Section title="Rejected Orders" items={groups.rejected} />
    </div>
  );
}
