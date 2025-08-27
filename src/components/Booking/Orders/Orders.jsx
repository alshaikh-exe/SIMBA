// src/components/Orders/Order.jsx
import React from 'react';
import styles from './Orders.module.scss';

export default function Order({ lines = [] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Requested Days</th>
          <th>Status</th>
          <th>Decision</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((li) => {
          const id = li.item?._id || li.item;
          return (
            <tr key={id}>
              <td>{li.item?.name || id}</td>
              <td>{li.qty}</td>
              <td>{li.requestedDays ?? '—'}</td>
              <td>{li.status}</td>
              <td>{li.decision}</td>
              <td>{li.dueAt ? new Date(li.dueAt).toLocaleString() : '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
