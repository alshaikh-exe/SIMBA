import React from "react";
import NavBar from "../../../components/Navbar/Navbar";
import Management from "../../../components/Management/Mangement";
// import Items from "../../../components/Items/Items";
const StockRequestPage = ({ user, setUser }) => {
  return (
    <main>
      <aside>
        <NavBar user={user} setUser={setUser} />
        <Management/>
      </aside>
      <div>
        <h1>Stonks</h1>
      </div>
    </main>
  );
};
export default StockRequestPage;