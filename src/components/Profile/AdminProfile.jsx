import React, { useState, useEffect } from "react";

const AdminProfile = ({ admin }) => {
  const [availability, setAvailability] = useState(admin?.adminAvailability || false);

  useEffect(() => {
    setAvailability(admin?.adminAvailability || false);
  }, [admin]);

  if (!admin) return <p>Loading profile...</p>;

  function handleChange(e) {
    const value = e.target.value === "true";
    setAvailability(value);
  }

  return (
    <div className="profile-container">
      <img
        src={admin.profilePicture || "/default-avatar.png"}
        alt={`${admin.name}'s profile`}
        className="profile-pic"
      />
      <h2>{admin.name}</h2>
      <p><strong>ID:</strong> {admin._id}</p>
      <p><strong>Email:</strong> {admin.email}</p>
      <p><strong>Campus:</strong> {admin.adminCampus}</p>
      <p><strong>Office Hours:</strong> {admin.adminOfficeHours}</p>
      <p>
        <strong>Availability:</strong>{" "}
        <select value={availability} onChange={handleChange}>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </p>
    </div>
  );
};

export default AdminProfile;
