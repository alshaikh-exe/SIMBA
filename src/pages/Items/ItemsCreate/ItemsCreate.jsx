//Zahraa
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemsCreate.module.scss';
import { createItem } from '../../../utilities/items-api'
import { getLocations } from '../../../utilities/location-api';
import Button from '../../../components/Button/Button';

const ItemsCreatePage = ({ user }) => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([])

  useEffect(() => {
    async function getAllLocations() {
      const res = await getLocations()
      setLocations(res.data)
    }
    getAllLocations()
  }, [])

  const [item, setItem] = useState({
    name: '',
    details: '',
    image: '',
    values: '',
    location: '',
    status: 'available',
    category: 'electronics',
    maintenanceSchedule: '',
    returnPolicy: '',
    deadline: 7,
    quantity: 0
  });

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: '3d printing', label: '3D Printing' },
    { value: 'machining', label: 'Machining' },
    { value: 'testing', label: 'Testing' },
    { value: 'measurement', label: 'Measurement' },
    { value: 'fabrication', label: 'Fabrication' },
    { value: 'assembly', label: 'Assembly' },
    { value: 'safety', label: 'Safety' },
    { value: 'general', label: 'General' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'repair', label: 'In Repair' },
    { value: 'out of order', label: 'Out of Order' },
    { value: 'out of stock', label: 'Out of Stock' }
  ];

  const returnPolicyOptions = [
    { value: 'returnable', label: 'Returnable' },
    { value: 'nonreturnable', label: 'Non-Returnable' }
  ];

  useEffect(() => {
    if (user.role !== 'manager' && user.role !== 'admin') {
      navigate('/items');
    }
  }, [user.role, navigate]);

  const handleInputChange = (field, value) => {
    setItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name.trim()) {
      alert('Item name is required');
      return;
    }

    try {
      const response = await createItem(item)
      alert(`Item created successfully!`);
      navigate('/items');
    } catch (error) {
      alert('Error saving item: ' + error.message);
    }
  };

  return (
    <div className="items-edit-page">
      <div className="page-header">
        <h1>'Add New Item'</h1>
        <div className="header-actions">
          <Button onClick={() => navigate('/items')} className="secondary">
            ← Back to Item
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-sections">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Item Name *</label>
                <input
                  type="text"
                  id="name"
                  value={item.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={item.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="values">Item Values</label>
                <input
                  type="text"
                  id="values"
                  value={item.values}
                  onChange={(e) => handleInputChange('values', e.target.value)}
                  placeholder="Enter item values"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="details">Details</label>
              <textarea
                id="details"
                value={item.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                placeholder="Describe the item's purpose and features"
                rows="3"
              />
            </div>
          </div>

          {/* Location and Status */}
          <div className="form-section">
            <h2>Location and Status</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <select
                  id="location"
                  value={item.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations?.map((location, i) => (
                    <option key={i} value={location._id}>{location.building}.{location.classroom} {location.campus}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={item.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={item.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                value={item.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Booking Settings */}
          <div className="form-section">
            <h2>Booking Settings</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deadline">Deadline (days)</label>
                <input
                  type="number"
                  id="deadline"
                  value={item.deadline}
                  onChange={(e) => handleInputChange('deadline', parseInt(e.target.value))}
                  min="1"
                  max="70"
                />
              </div>

              <div className="form-group">
                <label htmlFor="returnPolicy">Return Policy</label>
                <select
                  id="returnPolicy"
                  value={item.returnPolicy}
                  onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                >
                  {returnPolicyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h2>Additional Information</h2>

            <div className="form-group">
              <label htmlFor="maintenanceSchedule">Maintenance Schedule</label>
              <input
                type="text"
                id="maintenanceSchedule"
                value={item.maintenanceSchedule}
                onChange={(e) => handleInputChange('maintenanceSchedule', e.target.value)}
                placeholder="e.g., Monthly calibration, Quarterly cleaning"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" onClick={() => navigate('/items')} className="secondary">
            Cancel
          </Button>
          <Button type="submit" className="primary">
            Create Item
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemsCreatePage;