import React, { useState, useEffect } from 'react';
import api from '../services/api';
import VehicleModal from '../components/VehicleModal';
import { Plus, Search, Edit3, Trash2, Car, Sparkles } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [categoryFilter]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter) params.category = categoryFilter;

      const response = await api.get('/vehicles', { params });
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      setIsModalOpen(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error) {
      alert('Failed to save vehicle: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        alert('Failed to delete vehicle');
      }
    }
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a192f' }}>
            Maruti Car Inventory Catalog
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage models, pricing, specifications, and availability status.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add New Car</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search car model (e.g. Swift, Brezza)..."
                style={{ paddingLeft: '40px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ width: '180px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Hatchback">Hatchbacks</option>
              <option value="Sedan">Sedans</option>
              <option value="SUV">SUVs</option>
              <option value="EV">Electric (EV)</option>
              <option value="MUV">MUVs</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Car Model</th>
                <th>Category</th>
                <th>Ex-Showroom Price</th>
                <th>Fuel & Transmission</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading vehicle inventory...
                  </td>
                </tr>
              ) : filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <img
                        src={
                          vehicle.imageUrl ||
                          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400'
                        }
                        alt={vehicle.name}
                        className="car-thumb"
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {vehicle.name}
                        {vehicle.isPopular && (
                          <Sparkles
                            size={14}
                            color="#2563eb"
                            style={{ display: 'inline', marginLeft: '6px' }}
                          />
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {vehicle.engineCapacity || 'N/A'} • {vehicle.mileage || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-active">{vehicle.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#003399' }}>
                      ₹ {Number(vehicle.priceExShowroom).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {vehicle.fuelType}
                      <br />
                      <span style={{ color: '#64748b' }}>{vehicle.transmission}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          vehicle.status === 'Active'
                            ? 'badge-active'
                            : 'badge-upcoming'
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(vehicle)}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(vehicle.id, vehicle.name)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No vehicle records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        vehicle={editingVehicle}
      />
    </div>
  );
};

export default Vehicles;
