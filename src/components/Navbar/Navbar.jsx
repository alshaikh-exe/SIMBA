import { Link } from "react-router-dom";
import { logOut } from "../../utilities/users-service";
import styles from "./Navbar.module.scss";
import heartsBg from "../../assets/xxxx.gif"; // rename if you like

export default function Navbar({ user, setUser }) {
  if (!user) return null;

  function handleLogOut() {
    logOut();
    setUser(null);
  }

  const initial = user?.name?.[0]?.toUpperCase() || "U";
  const avatarSrc = user?.profilePicture?.trim() ? user.profilePicture : null;

  const AdminLinks = () => (
    <>
      <Link className={styles.btn} to="/profile">Profile</Link>
      <Link className={styles.btn} to="/requests">Student Requests</Link>
      <Link className={styles.btn} to="/items">Items</Link>
      <Link className={styles.btn} to="/stock-request">Stock Request</Link>
      <Link className={styles.btn} to="/analytics">Analytics</Link>
    </>
  );

  const UserLinks = () => (
    <>
      <Link className={styles.btn} to="/profile">Profile</Link>
      <Link className={styles.btn} to="/items">Items</Link>
      <Link className={styles.btn} to="/cart">Cart</Link>
      <Link className={styles.btn} to="/orders">Orders</Link>
    </>
  );

  return (
    <nav
      className={styles.nav}
      style={{ "--bg": `url(${heartsBg})` }} // pass bg via CSS var
    >
      <div className={styles.overlay} />

      <div className={styles.left}>
        <div className={styles.avatar}>
          {avatarSrc ? (
            <img src={avatarSrc} alt={user.name} />
          ) : (
            <span className={styles.initial}>{initial}</span>
          )}
        </div>
        <div className={styles.meta}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.email}>{user.email}</div>
        </div>
      </div>

      <div className={styles.right}>
        {user.role === "admin" ? <AdminLinks /> : <UserLinks />}
        <button className={`${styles.btn} ${styles.logout}`} onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </nav>
  );
}
