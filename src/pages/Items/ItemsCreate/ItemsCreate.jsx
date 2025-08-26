//Zahraa

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItemsCreate.module.scss';
import {createItem} from '../../../utilities/equipment-api'
import { getLocations } from '../../../utilities/location-api';
import Button from '../../../components/Button/Button';

const ItemsCreatePage = ({ user }) => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState ([])

  useEffect (()=>{
    async function getAllLocations (){
      const res = await getLocations() 
      console.log(res)
      setLocations(res.data)
    }
    getAllLocations()
  }, [])
  
  const [saving, setSaving] = useState(false);
  const [equipment, setEquipment] = useState({
    name: '',
    details: '',
    category: '',
    manufacturer: '',
    model: '',
    location: '',
    status: 'available',
    image: '',
    specifications: {},
    requiresApproval: false,
    maintenanceSchedule: '',
    purchaseDate: '',
    warrantyInfo: '',
    operatingInstructions: '',
    safetyNotes: '',
    maxBookingDuration: 4, // hours
    bookingAdvanceLimit: 7 // days
  });
  
  const [specificationInputs, setSpecificationInputs] = useState([
    { key: '', value: '' }
  ]);

  const categories = [
    'Electronics',
    '3D Printing',
    'Machining',
    'Testing',
    'Measurement',
    'Fabrication',
    'Assembly',
    'Safety',
    'General'
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'repair', label: 'In Repair' },
    { value: 'out of order', label: 'Out of Order' }
  ];

//   useEffect(() => {
//     if (isEditing) {
//       fetchEquipment();
//     }
//   }, [id, isEditing]);

  // Check permissions
  useEffect(() => {
    if (user.role !== 'manager' && user.role !== 'admin') {
      navigate('/equipment');
    }
  }, [user.role, navigate]);

//   const fetchEquipment = async () => {
//     try {
//       const response = await fetch(`/api/items/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setEquipment(data);
        
//         // Convert specifications object to input array
//         if (data.specifications && Object.keys(data.specifications).length > 0) {
//           const specs = Object.entries(data.specifications).map(([key, value]) => ({
//             key, value
//           }));
//           setSpecificationInputs([...specs, { key: '', value: '' }]);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching equipment:', error);
//       alert('Error loading equipment data');
//     }
//     setLoading(false);
//   };

  const handleInputChange = (field, value) => {
    setEquipment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specificationInputs];
    newSpecs[index][field] = value;
    
    // Add new empty row if last row is being filled
    if (index === newSpecs.length - 1 && newSpecs[index].key && newSpecs[index].value) {
      newSpecs.push({ key: '', value: '' });
    }
    
    setSpecificationInputs(newSpecs);
  };

  const removeSpecification = (index) => {
    const newSpecs = specificationInputs.filter((_, i) => i !== index);
    if (newSpecs.length === 0) {
      newSpecs.push({ key: '', value: '' });
    }
    setSpecificationInputs(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!equipment.name.trim()) {
        alert('Equipment name is required');
        return;
    }
    
    setSaving(true);
    
    const specifications = {};
    specificationInputs.forEach(spec => {
        if (spec.key && spec.value) {
            specifications[spec.key] = spec.value;
        }
    });
    
    const equipmentData = {
        ...equipment,
        specifications: specifications
    };
    console.log(equipmentData)
    try {
      // Convert specification inputs to object

    const response = await createItem (equipmentData)


      if (response.ok) {
        alert(`Equipment ${isEditing ? 'updated' : 'created'} successfully!`);
        navigate('/equipment');
      } else {
        throw new Error('Failed to save equipment');
      }
    } catch (error) {
      alert('Error saving equipment: ' + error.message);
    }

    setSaving(false);
  };


  return (
    <div className="items-edit-page">
      <div className="page-header">
        <h1>'Add New Equipment'</h1>
        <div className="header-actions">
          <Button onClick={() => navigate('/equipment')} className="secondary">
            ← Back to Equipment
          </Button>
          {/* {isEditing && (
            <Button onClick={handleDelete} className="danger" disabled={saving}>
              Delete Equipment
            </Button>
          )} */}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-sections">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Equipment Name *</label>
                <input
                  type="text"
                  id="name"
                  value={equipment.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter equipment name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={equipment.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="details">Details</label>
              <textarea
                id="details"
                value={equipment.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                placeholder="Describe the equipment's purpose and features"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="manufacturer">Manufacturer</label>
                <input
                  type="text"
                  id="manufacturer"
                  value={equipment.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="Equipment manufacturer"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  value={equipment.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Model number/name"
                />
              </div>
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
                  value={equipment.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                >
                  <option value="">-----</option>
                  {locations?.map((location, i) => (
                    <option key={i} value={location._id}>{location.building}.{location.classroom} {location.campus}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={equipment.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                value={equipment.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="form-section">
            <h2>Technical Specifications</h2>
            
            <div className="specifications-list">
              {specificationInputs.map((spec, index) => (
                <div key={index} className="specification-row">
                  <input
                    type="text"
                    placeholder="Specification name"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                  />
                  {specificationInputs.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="danger small"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Settings */}
          <div className="form-section">
            <h2>Booking Settings</h2>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={equipment.requiresApproval}
                  onChange={(e) => handleInputChange('requiresApproval', e.target.checked)}
                />
                <span className="checkmark"></span>
                Requires manager approval for booking
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="maxBookingDuration">Max Booking Duration (hours)</label>
                <input
                  type="number"
                  id="maxBookingDuration"
                  value={equipment.maxBookingDuration}
                  onChange={(e) => handleInputChange('maxBookingDuration', parseInt(e.target.value))}
                  min="1"
                  max="168"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bookingAdvanceLimit">Booking Advance Limit (days)</label>
                <input
                  type="number"
                  id="bookingAdvanceLimit"
                  value={equipment.bookingAdvanceLimit}
                  onChange={(e) => handleInputChange('bookingAdvanceLimit', parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h2>Additional Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={equipment.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="warrantyInfo">Warranty Information</label>
                <input
                  type="text"
                  id="warrantyInfo"
                  value={equipment.warrantyInfo}
                  onChange={(e) => handleInputChange('warrantyInfo', e.target.value)}
                  placeholder="Warranty details"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="maintenanceSchedule">Maintenance Schedule</label>
              <input
                type="text"
                id="maintenanceSchedule"
                value={equipment.maintenanceSchedule}
                onChange={(e) => handleInputChange('maintenanceSchedule', e.target.value)}
                placeholder="e.g., Monthly calibration, Quarterly cleaning"
              />
            </div>

            <div className="form-group">
              <label htmlFor="operatingInstructions">Operating Instructions</label>
              <textarea
                id="operatingInstructions"
                value={equipment.operatingInstructions}
                onChange={(e) => handleInputChange('operatingInstructions', e.target.value)}
                placeholder="Brief operating instructions or links to manuals"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="safetyNotes">Safety Notes</label>
              <textarea
                id="safetyNotes"
                value={equipment.safetyNotes}
                onChange={(e) => handleInputChange('safetyNotes', e.target.value)}
                placeholder="Important safety information and precautions"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" onClick={() => navigate('/equipment')} className="secondary">
            Cancel
          </Button>
          <Button type="submit" className="primary" disabled={saving}>
            Create Equipment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemsCreatePage;