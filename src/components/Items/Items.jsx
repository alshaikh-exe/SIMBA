//Zahraa
// src/components/Items/Items.jsx
import React, { useState, useEffect } from 'react';
import { getItems, addItemToCart } from '../../utilities/equipment-api';
import Button from '../Button/Button';
import './Items.scss';

export default function Items({ user, onAddToCart }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, categoryFilter, statusFilter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const itemsData = await getItems();
      setItems(itemsData);
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  };

  const handleAddToCart = async (item) => {
    try {
      await onAddToCart(item);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Reserved':
        return 'status-reserved';
      case 'Under Maintenance':
        return 'status-maintenance';
      case 'In Repair':
        return 'status-repair';
      default:
        return 'status-unknown';
    }
  };

  const categories = [...new Set(items.map(item => item.category))];

  if (loading) return <div className="items-loading">Loading equipment...</div>;

  return (
    <div className="items-container">
      <div className="items-header">
        <h2>Equipment Catalog</h2>
        <div className="items-filters">
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="In Repair">In Repair</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item._id} className="item-card">
            <div className="item-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-details">
                <span className="item-category">{item.category}</span>
                <span className={`item-status ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              {item.specifications && (
                <div className="item-specs">
                  <h4>Specifications:</h4>
                  <ul>
                    {Object.entries(item.specifications).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="item-actions">
                <Button
                  variant="secondary"
                  onClick={() => window.open(`/items/${item._id}`, '_blank')}
                >
                  View Details
                </Button>
                
                {item.status === 'Available' && user && (
                  <Button
                    variant="primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="no-items">
          <p>No equipment found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}