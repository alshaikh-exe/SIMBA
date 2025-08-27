//Zahraa
import React from "react";
import Items from "../../../components/Items/Items";

const ItemsPage = ({ user, setUser }) => {
  return (
    <main>
      <div>
        <h1>Items</h1>
        <Items user={user} />
      </div>
    </main>
  );
};

export default ItemsPage;