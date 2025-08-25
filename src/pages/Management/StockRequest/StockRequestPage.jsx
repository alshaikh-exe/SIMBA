
// import React from "react";
// import Management from "../../../components/Management/Mangement";
// import Navbar from "../../../components/Navbar/Navbar";

// const StockRequestPage = () => {
//     return (
//         <div className="page-container">
//             <Navbar />
//             <div className="main-content">
//                 <Management />
//             </div>
//         </div>
//     );
// };

// export default StockRequestPage;

import React from "react";
import NavBar from "../../../components/Navbar/Navbar";
import Management from "../../../components/Management/Mangement";
const StockRequestPage = ({ user, setUser }) => {
  return (
    <main className="page-container">
        <NavBar user={user} setUser={setUser} />
        <section className="main-content">
        <h1>Stocks</h1>
        <Management/>
        </section>
    </main>
  );
};

export default StockRequestPage;