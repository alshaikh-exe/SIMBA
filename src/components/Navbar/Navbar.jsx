import { Link } from "react-router-dom";
import { logOut } from "../../utilities/users-service";

export default function Navbar({ user, setUser }) {
  function handleLogOut() {
    logOut();
    setUser(null);
  }

  if (!user) return null;

  return (
    <div>
      <div>{user.name}</div>
      <div>{user.email}</div>
      {user.role === "admin" ? (
        <>
          <Link to="/analytics">Analytics</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/items">Items</Link>
          <Link to="/stock-request">Stock Request</Link>
          <Link to="/requests">Student Requests</Link>
        </>
      ) : (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/items">Items</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">Cart</Link>
        </>
      )}
      <button onClick={handleLogOut}>LOG OUT</button>
    </div>
  );
}