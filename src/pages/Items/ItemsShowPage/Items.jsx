// src/pages/Items/ItemShow.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getItemById } from "../../../utilities/equipment-api";
import Button from "../../../components/Button/Button";

export default function ItemShow({ user, onAddToCart }) {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const res = await getItemById(id);
      setItemData(res.data); // backend sends { item, policySummary, datasheetLinks }
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading item...</p>;
  if (error) return <p>{error}</p>;
  if (!itemData?.item) return <p>Item not found</p>;

  const { item, policySummary, datasheetLinks } = itemData;

  return (
    <main className="item-show">
      <h1>{item.name}</h1>

      {item.picture && (
        <img src={item.picture} alt={item.name} style={{ maxWidth: "300px" }} />
      )}

      <section>
        <h3>Description</h3>
        <p>{item.details}</p>
      </section>

      <section>
        <h3>Return Policy</h3>
        <p>{policySummary}</p>
      </section>

      <section>
        <h3>Stock</h3>
        <p>Quantity: {item.quantity}</p>
        <p>Threshold: {item.threshold}</p>
      </section>

      {item.location && (
        <section>
          <h3>Location</h3>
          <p>
            {item.location.campus}, {item.location.building},{" "}
            {item.location.classroom}
          </p>
        </section>
      )}

      {datasheetLinks?.length > 0 && (
        <section>
          <h3>Datasheets</h3>
          <ul>
            {datasheetLinks.map((d) => (
              <li key={d.url}>
                <a href={d.url} target="_blank" rel="noreferrer">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {user && item.quantity > 0 && (
        <Button variant="primary" onClick={() => onAddToCart?.(item)}>
          Add to Cart
        </Button>
      )}
    </main>
  );
}
