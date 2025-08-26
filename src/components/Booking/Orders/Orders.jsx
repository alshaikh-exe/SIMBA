//Zahraa
import React, { useState } from "react";

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);

  return (
    <div>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div key={index} style={{ padding: "10px", border: "1px solid #ccc", margin: "5px" }}>
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Date: {order.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;