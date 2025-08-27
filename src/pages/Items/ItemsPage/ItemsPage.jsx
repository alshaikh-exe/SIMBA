//Zahraa
//user permissions aka user.role for 'add to cart' for only the user and edit/delete for only the admin in show page and index, add delete link
import React, { useState, useEffect } from 'react';
import { getItems, addToCart } from '../../../utilities/items-api';
import { Link } from 'react-router-dom';
import ItemCard from "../../../components/Items/ItemCard";

const ItemsPage = ({ user, setUser }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await getItems();
      setItems(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  };

  const handleAddToCart = async (item) => {
    try {      // Decrement quantity in database
      /*await fetch(`/api/items/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ quantity: item.quantity - 1 })
      });*/
      await addToCart(item._id)
      // Update items page locally
      setItems(prev =>
        prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity - 1 } : i)
      );


      // Add to localStorage cart

      // const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      // const existing = savedCart.find(i => i._id === item._id);

      // let updatedCart;
      // if (existing) {
      //   updatedCart = savedCart.map(i =>
      //     i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      //   );
      // } else {
      //   updatedCart = [...savedCart, { ...item, quantity: 1 }];
      // }

      // localStorage.setItem('cart', JSON.stringify(updatedCart));
      // onAddToCart && onAddToCart(); // notify parent

      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = savedCart.find(i => i._id === item._id);
      
      let updatedCart;
      if (existing) {
        updatedCart = savedCart.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [...savedCart, { ...item, quantity: 1 }];
      }
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));


    } catch (err) {
      console.error(err);
      setError('Failed to add item to cart');
    }
  };

  if (loading) return <div className="items-loading">Loading equipment...</div>;

  return (
    <main>
      <h1>Items</h1>
      <div className="items-container">
        <div className="items-header">
          <h2>Items Catalog</h2>
           {user.role === "admin" ? <Link to= '/items/create'>Add New Item</Link> : ""}
         
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="items-grid">
          {filteredItems.map(item => (
            <ItemCard user={user} item={item} loading={loading} handleAddToCart={handleAddToCart} />
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="no-items">
            <p>No equipment found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  )
};

export default ItemsPage;
