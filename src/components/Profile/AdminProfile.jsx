import React, { useState, useEffect } from "react";
import { getAdminProfile, updateAdminAvailability } from "../../utilities/users-api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [availability, setAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch current admin profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getAdminProfile();
        setAdmin(profile);
        setAvailability(profile.adminAvailability || false);
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    }
    fetchProfile();
  }, []);

  if (!admin) return <p>Loading profile...</p>;

  async function handleSave() {
    setLoading(true);
    try {
      await updateAdminAvailability(availability);
      // Update local state with saved value from DB
      setAdmin((prev) => ({ ...prev, adminAvailability: availability }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update availability", err);
    } finally {
      setLoading(false);
    }
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
        <strong>Current Availability:</strong> {admin.adminAvailability ? "Yes" : "No"}
      </p>

      <p>
        <strong>Change Availability:</strong>{" "}
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value === "true")}
          disabled={loading}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </p>

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      {saved && <span style={{ marginLeft: "8px" }}>Saved!</span>}
    </div>
  );
};

export default AdminProfile;