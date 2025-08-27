// components/Orders/OrdersTable.jsx
import React from 'react';
import styles from './Orders.module.scss';

function OrdersTable({
  lines = [],
  editableQty = false,
  onQtyChange,
  showRequestedDays = true,
  requestedDays = {},
  onRequestedDaysChange,
  showAdminDecision = false,
  adminDecisions = {},
  onAdminDecisionChange,
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          {showRequestedDays && <th>Requested Days</th>}
          {showAdminDecision && (
            <>
              <th>Decision</th>
              <th>Approved Days</th>
              <th>Status</th>
              <th>Due</th>
            </>
          )}
          {!showAdminDecision && <><th>Status</th><th>Due</th></>}
        </tr>
      </thead>
      <tbody>
        {lines.map((li) => {
          const id = li.item?._id || li.item;
          const rd = requestedDays[id] ?? li.requestedDays ?? '';
          const admin = adminDecisions[id] || {};

          return (
            <tr key={id}>
              <td>{li.item?.name || id}</td>
              <td>
                {editableQty ? (
                  <input
                    type="number"
                    min={0}
                    value={li.qty}
                    onChange={(e) =>
                      onQtyChange?.(id, Number(e.target.value))
                    }
                    className={styles.number}
                  />
                ) : (
                  li.qty
                )}
              </td>

              {showRequestedDays && (
                <td>
                  {onRequestedDaysChange ? (
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={rd}
                      onChange={(e) =>
                        onRequestedDaysChange?.(id, Number(e.target.value))
                      }
                      className={styles.number}
                    />
                  ) : (
                    <p>{rd || '—'}</p>
                  )}
                </td>
              )}

              {showAdminDecision ? (
                <>
                  <td>
                    <select
                      value={admin.decision || ''}
                      onChange={(e) =>
                        onAdminDecisionChange?.(id, {
                          decision: e.target.value,
                        })
                      }
                    >
                      <option value="">—</option>
                      <option value="return">Return</option>
                      <option value="keep">Keep</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      disabled={admin.decision !== 'return'}
                      value={admin.approvedDays ?? ''}
                      onChange={(e) =>
                        onAdminDecisionChange?.(id, {
                          approvedDays: Number(e.target.value),
                        })
                      }
                      className={styles.number}
                    />
                  </td>
                  <td>{li.status || 'pending'}</td>
                  <td>
                    {li.dueAt
                      ? new Date(li.dueAt).toLocaleString()
                      : '—'}
                  </td>
                </>
              ) : (
                <>
                  <td>{li.status || 'pending'}</td>
                  <td>
                    {li.dueAt
                      ? new Date(li.dueAt).toLocaleDateString()
                      : '—'}
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default OrdersTable;
