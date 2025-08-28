// StudentRequests.jsx
import React, { useState } from "react";
import styles from "./StudentRequests.module.scss";   // <— add this

const StudentRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ item: "", description: "" });

  const handleChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New request:", newRequest);
    setNewRequest({ item: "", description: "" });
  };

  const canRequest = user?.role !== "admin";

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Student Requests</h2>
      <p className={styles.userline}>User: {user?.name || "Guest"}</p>

      {canRequest && (
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Item</label>
            <input
              type="text"
              name="item"
              value={newRequest.item}
              onChange={handleChange}
              placeholder="e.g. Digital Oscilloscope"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              value={newRequest.description}
              onChange={handleChange}
              placeholder="Briefly describe your use case, time window, etc."
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryBtn}>
              Submit Request
            </button>
          </div>
        </form>
      )}

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>Previous Requests</h3>
          <span className={styles.count}>{requests.length}</span>
        </div>

        {requests.length === 0 ? (
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>🧰</div>
            <div className={styles.emptyTitle}>No requests found</div>
            <div className={styles.emptySub}>
              {canRequest
                ? "Submit a request using the form above to get started."
                : "Students haven’t submitted any requests yet."}
            </div>
          </div>
        ) : (
          <div className={styles.reqList}>
            {requests.map((request, index) => (
              <article key={index} className={styles.reqCard}>
                <div className={styles.reqMeta}>
                  <div className={styles.reqItem}>{request.item}</div>
                  <span className={`${styles.badge} ${styles[request.status || "pending"]}`}>
                    {request.status || "pending"}
                  </span>
                </div>
                <div className={styles.reqBody}>
                  {request.description || "—"}
                </div>
                <div className={styles.reqFooter}>
                  <span className={styles.date}>
                    {request.date || "—"}
                  </span>
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
