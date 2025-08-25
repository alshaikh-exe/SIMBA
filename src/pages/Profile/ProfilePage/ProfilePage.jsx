import React from "react";
import NavBar from "../../../components/Navbar/Navbar";
import UserProfile from "../../../components/Profile/UserProfile";
import AdminProfile from "../../../components/Profile/AdminProfile";

const ProfilePage = ({ user, setUser }) => {
  return (
    <main className="page-container">
      <NavBar user={user} setUser={setUser} />
      <section className="main-content">
        <h1>Profile</h1>
        {user?.role === "admin" ? (
          <AdminProfile admin={user} />
        ) : (
          <UserProfile user={user} />
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
