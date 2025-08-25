import React from "react";

const AdminProfile = ({ admin }) => {
  if (!admin) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <img
        src={admin.profilePic || "/default-avatar.png"}
        alt={`${admin.name}'s profile`}
        className="profile-pic"
      />
      <h2>{admin.name}</h2>
      <p><strong>ID:</strong> {admin._id}</p>
      <p><strong>Email:</strong> {admin.email}</p>
      <p><strong>Campus:</strong> {admin.campus}</p>
      <p><strong>Office Hours:</strong> {admin.officeHours}</p>
      <p><strong>Availability:</strong> {admin.availability ? "Available ✅" : "Not Available ❌"}</p>
    </div>
  );
};

export default AdminProfile;
