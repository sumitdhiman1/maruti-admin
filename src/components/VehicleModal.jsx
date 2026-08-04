import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const VehicleModal = ({ isOpen, onClose, onSave, vehicle = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hatchback',
    priceExShowroom: '',
    fuelType: 'Petrol / CNG',
    transmission: 'Manual / Automatic',
    mileage: '',
    engineCapacity: '',
    imageUrl: '',
    isPopular: false,
    status: 'Active',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        category: vehicle.category || 'Hatchback',
        priceExShowroom: vehicle.priceExShowroom || '',
        fuelType: vehicle.fuelType || 'Petrol / CNG',
        transmission: vehicle.transmission || 'Manual / Automatic',
        mileage: vehicle.mileage || '',
        engineCapacity: vehicle.engineCapacity || '',
        imageUrl: vehicle.imageUrl || '',
        isPopular: vehicle.isPopular || false,
        status: vehicle.status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        category: 'Hatchback',
        priceExShowroom: '',
        fuelType: 'Petrol / CNG',
        transmission: 'Manual / Automatic',
        mileage: '',
        engineCapacity: '',
        imageUrl: '',
        isPopular: false,
        status: 'Active',
      });
    }
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{vehicle ? 'Edit Vehicle' : 'Add New Maruti Vehicle'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Vehicle Name & Variant</label>
            <input
              type="text"
              name="name"
              required
              className="form-control"
              placeholder="e.g. Swift ZXi+ 2024"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="EV">EV</option>
                <option value="MUV">MUV</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ex-Showroom Price (₹)</label>
              <input
                type="number"
                name="priceExShowroom"
                step="1000"
                required
                className="form-control"
                placeholder="e.g. 849000"
                value={formData.priceExShowroom}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <input
                type="text"
                name="fuelType"
                className="form-control"
                placeholder="Petrol / CNG / Hybrid"
                value={formData.fuelType}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Transmission</label>
              <input
                type="text"
                name="transmission"
                className="form-control"
                placeholder="Manual / Automatic / AGS"
                value={formData.transmission}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mileage</label>
              <input
                type="text"
                name="mileage"
                className="form-control"
                placeholder="e.g. 25.75 kmpl"
                value={formData.mileage}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="isPopular"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleChange}
            />
            <label htmlFor="isPopular" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
              Highlight as Popular Model
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {vehicle ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
