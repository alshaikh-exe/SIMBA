//Zahraa
import React, { useState } from "react";

const StudentRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    item: "",
    description: ""
  });

  const handleChange = (e) => {
    setNewRequest({
      ...newRequest,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New request:", newRequest);
    // Add your request logic here
    setNewRequest({ item: "", description: "" });
  };

  return (
    <div>
      <h2>Student Requests</h2>
      <p>User: {user?.name || "Guest"}</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item:</label>
          <input
            type="text"
            name="item"
            value={newRequest.item}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={newRequest.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Request</button>
      </form>

      <div>
        <h3>Previous Requests</h3>
        {requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          <div>
            {requests.map((request, index) => (
              <div key={index} style={{ padding: "10px", border: "1px solid #ccc", margin: "5px" }}>
                <p>Item: {request.item}</p>
                <p>Status: {request.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRequests;