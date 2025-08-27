// src/pages/OrdersPage/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../../../utilities/orders-api';
import Order from '../../../components/Booking/Orders/Orders';

export default function OrdersPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrderById(orderId);
        if (!res?.success) throw new Error(res?.message || 'Failed to load order');
        setOrder(res.data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: 'crimson' }}>{err}</div>;
  if (!order) return <div>Order not found.</div>;

  const shortId = order.orderId || order._id.slice(-6).toUpperCase();

  return (
    <div>
      <h1>Order #{shortId}</h1>
      <p><strong>Status:</strong> {order.status}</p>
      {order.user && (
        <p>
          <strong>Student:</strong> {order.user.name} ({order.user.email})
        </p>
      )}
      <Order lines={order.lineItems || []} />
      {order.approvedAt && (
        <p>
          <strong>Approved at:</strong> {new Date(order.approvedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
