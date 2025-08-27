// src/pages/OrdersPage/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrders } from '../../../utilities/orders-api';
import Order from '../../../components/Booking/Orders/Orders';

export default function OrdersPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState({ pending: [], approved: [], rejected: [] });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrders();
        if (!res?.success) throw new Error(res?.message || 'Failed to load orders');
        // group by status
        const pending = res.data.filter(order => order.status === 'pending');
        const approved = res.data.filter(order => order.status === 'approved');
        const rejected = res.data.filter(order => order.status === 'rejected');
        setOrder({ pending, approved, rejected });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  //   if (loading) return <div>Loading…</div>;
  //   if (err) return <div style={{ color: 'crimson' }}>{err}</div>;
  //   if (!order) return <div>Order not found.</div>;

  //   const shortId = order.orderId || order._id.slice(-6).toUpperCase();

  //   return (
  //     <div>
  //       <h1>Order #{shortId}</h1>
  //       <p><strong>Status:</strong> {order.status}</p>
  //       {order.user && (
  //         <p>
  //           <strong>Student:</strong> {order.user.name} ({order.user.email})
  //         </p>
  //       )}
  //       <Order lines={order.lineItems || []} />
  //       {order.approvedAt && (
  //         <p>
  //           <strong>Approved at:</strong> {new Date(order.approvedAt).toLocaleString()}
  //         </p>
  //       )}
  //     </div>
  //   );
  // }

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: 'crimson' }}>{err}</div>;

  return (
    <div>
      <h1>My Orders</h1>

      <h2>Pending</h2>
      {/* {order.pending.length ? order.pending.map(order => (
      <Order key={order._id} lines={order.lineItems} order={order} />
    )) : <p>No pending orders</p>} */}
      {order.pending.length ? order.pending.map(order => (
        <div key={order._id}>
          <p><strong>Order #{order._id.slice(-6).toUpperCase()}</strong></p>
          <Order lines={order.lineItems} order={order} />
        </div>
      )) : <p>No pending orders</p>}

      <h2>Approved</h2>
      {order.approved.length ? order.approved.map(order => (
        <Order key={order._id} lines={order.lineItems} order={order} />
      )) : <p>No approved orders</p>}

      <h2>Rejected</h2>
      {order.rejected.length ? order.rejected.map(order => (
        <Order key={order._id} lines={order.lineItems} order={order} />
      )) : <p>No rejected orders</p>}
    </div>
  );
}