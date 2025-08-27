import React from "react";
import styles from "./UserProfile.module.scss";

export default function UserProfile({ user }) {
  if (!user) return <p>Loading profile...</p>;

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <section className={styles.profile}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={`${user.name}'s profile`} />
            ) : (
              <span className={styles.initial}>{initial}</span>
            )}
          </div>

          <div className={styles.idBlock}>
            <h2 className={styles.name}>{user.name}</h2>
            <div className={styles.badges}>
              {user.major && <span className={`${styles.badge} ${styles.badgeMain}`}>{user.major}</span>}
              {user.academicYear && (
                <span className={styles.badge}>Year {user.academicYear}</span>
              )}
            </div>
          </div>
        </div>

        {/* Meta grid */}
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>User ID</span>
            <span className={styles.value} title={user._id}>{user._id}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Email</span>
            <a className={styles.valueLink} href={`mailto:${user.email}`}>{user.email}</a>
          </div>
          {user.studentId && (
            <div className={styles.field}>
              <span className={styles.label}>Student ID</span>
              <span className={styles.value}>{user.studentId}</span>
            </div>
          )}
          {user.age && (
            <div className={styles.field}>
              <span className={styles.label}>Age</span>
              <span className={styles.value}>{user.age}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}