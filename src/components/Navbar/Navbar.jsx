//Zahraa
import React from "react";
import { Link } from "react-router-dom";
import { logOut } from '../../utilities/users-service';
export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    logOut();
    setUser(null);
  }
  if (!user) return null;
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>{user.name}</strong> ({user.email})
      </div>
      {/* Common links */}
      <Link to="/analytics" style={{ marginRight: '1rem' }}>Analytics</Link>
      <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
      {/* Role-based links */}
      {user.role === 'admin' && (
        <>
          <Link to="/stock-request" style={{ marginRight: '1rem' }}>Stock Requests</Link>
        </>
      )}
      {user.role === 'user' && (
        <>
          <Link to="/items" style={{ marginRight: '1rem' }}>Items</Link>
          <Link to="/orders" style={{ marginRight: '1rem' }}>Orders</Link>
          <Link to="/cart" style={{ marginRight: '1rem' }}>Cart</Link>
          <Link to="/requests" style={{ marginRight: '1rem' }}>Student Requests</Link>
        </>
      )}
      <button onClick={handleLogOut} style={{ marginLeft: '2rem' }}>LOG OUT</button>
    </nav>
  );
}
// import { Link } from 'react-router-dom';

// const NavBar = props => {
// 	return (
// 		<nav className="NavBar">
// 			{props.routes.map(({ key, path }) => (
// 				<Link key={key} to={path}>
// 					{key}
// 				</Link>
// 			))}
// 		</nav>
// 	);
// };

// export default NavBar;
