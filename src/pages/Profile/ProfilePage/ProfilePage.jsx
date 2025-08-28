import React from "react";
import UserProfile from "../../../components/Profile/UserProfile";
import AdminProfile from "../../../components/Profile/AdminProfile";

const ProfilePage = ({ user, setUser }) => {
  return (
    <main className="page-container">
      <section className="main-content">
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