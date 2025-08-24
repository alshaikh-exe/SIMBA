import React from "react";

function Profile({ user }) {
    return (
        <div className="profile-container">
            <h1>My Profile</h1>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="user-role">{user.role}</p>

            <div className="profile-btns">
                <a href="/users/edit" className="profile-edit-btn">Edit Profile</a>
            </div>
            </div>
    )
}

export default Profile;