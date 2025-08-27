// src/pages/Profile/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import { getAdminProfile, updateAdminAvailability } from "../../utilities/users-api";
import styles from "./AdminProfile.module.scss";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [availability, setAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getAdminProfile();
        setAdmin(profile);
        setAvailability(Boolean(profile.adminAvailability));
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    }
    fetchProfile();
  }, []);

  if (!admin) {
    return (
      <div className={styles.wrap}>
        <section className={styles.card}>
          <div className={styles.loading}>Loading profile…</div>
        </section>
      </div>
    );
  }

  async function handleSave() {
    setLoading(true);
    try {
      await updateAdminAvailability(availability);
      setAdmin(prev => ({ ...prev, adminAvailability: availability }));
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      console.error("Failed to update availability", err);
    } finally {
      setLoading(false);
    }
  }

  const initial = admin?.name?.[0]?.toUpperCase() || "A";

  return (
    <div className={styles.wrap}>
      <section className={styles.card}>
        {/* header */}
        <header className={styles.header}>
          <div className={styles.avatar}>
            {admin.profilePicture ? (
              <img src={admin.profilePicture} alt={`${admin.name} avatar`} />
            ) : (
              <span className={styles.initial}>{initial}</span>
            )}
          </div>
          <div className={styles.headMeta}>
            <h2 className={styles.name}>{admin.name}</h2>
            <p className={styles.role}>Administrator</p>
          </div>
        </header>

        {/* details */}
        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.label}>ID</span>
            <span className={styles.value} title={admin._id}>{admin._id}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{admin.email}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>Campus</span>
            <span className={styles.value}>{admin.adminCampus || "—"}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>Office Hours</span>
            <span className={styles.value}>{admin.adminOfficeHours || "—"}</span>
          </div>
        </div>

        {/* availability */}
        <div className={styles.availBlock}>
          <span className={styles.label}>Availability</span>

          <div className={styles.toggle} role="group" aria-label="Availability">
            <input
              id="avail-yes"
              type="radio"
              name="availability"
              checked={availability === true}
              onChange={() => setAvailability(true)}
            />
            <label htmlFor="avail-yes">Available</label>

            <input
              id="avail-no"
              type="radio"
              name="availability"
              checked={availability === false}
              onChange={() => setAvailability(false)}
            />
            <label htmlFor="avail-no">Unavailable</label>

            <span
              className={styles.toggleBg}
              data-pos={availability ? "right" : "left"}
            />
          </div>

          <span
            className={`${styles.badge} ${availability ? styles.badgeOn : styles.badgeOff}`}
            aria-live="polite"
          >
            {availability ? "Yes" : "No"}
          </span>
        </div>

        {/* actions */}
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving…" : "Save changes"}
          </button>

          {saved && <span className={styles.saved}>Saved!</span>}
        </div>
      </section>
    </div>
  );
}