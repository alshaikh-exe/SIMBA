// src/pages/Items/ItemShow.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getItemById } from "../../../utilities/items-api";
import Button from "../../../components/Button/Button";
import styles from "./Items.module.scss";
export default function ItemShow({ user, onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
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
      setItemData(res.data);
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
    <main className={styles["item-show"]}>
      <h1>{item.name}</h1>
      {item.image && (
        <img src={item.image} alt={item.name} />
      )}
      <section>
        <h3>Details</h3>
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
      {/* User-only action */}
      {user.role === "user" && item.quantity > 0 && (
        <Button variant="primary" onClick={() => onAddToCart?.(item)}>
          Add to Cart
        </Button>
      )}
      {/* Back button */}
      <Button onClick={() => navigate("/items")} className="secondary">
        ← Back to Item
      </Button>
      {/* Admin-only action */}
      {user.role === "admin" && (
        <Link to={`/items/edit/${item._id}`}>Edit Item</Link>
      )}
    </main>
  );
}









