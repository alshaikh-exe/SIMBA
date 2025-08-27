import React from "react";
import Management from "../../../components/Management/Mangement";
const StockRequestPage = ({ user, setUser }) => {
  return (
    <main className="page-container">
      <section className="main-content">
        <h1>Stocks</h1>
        <Management />
      </section>
    </main>
  );
};

export default StockRequestPage;