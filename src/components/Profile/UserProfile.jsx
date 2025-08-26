import React from "react";


const UserProfile = ({ user }) => {
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      {/* <img
        src={user.profilePic || "/default-avatar.png"}
        alt={`${user.name}'s profile`}
        className="profile-pic"
      /> */}
      <h2>{user.name}</h2>
      {/* <p><strong>ID:</strong> {user._id}</p> */}
      <p><strong>Email:</strong> {user.email}</p>
      {/* <p><strong>Academic Year:</strong> {user.academicYear}</p>
      <p><strong>Major:</strong> {user.major}</p>
      <p><strong>Age:</strong> {user.age}</p> */}
    </div>
  );
};

export default UserProfile;
