import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';
import './Admin.css';

const AdminStudios = () => {
  const [studios, setStudios] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    capacity: '',
    branch_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studiosRes, branchesRes] = await Promise.all([
        adminAPI.getStudios(),
        adminAPI.getBranches()
      ]);
      setStudios(studiosRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createStudio({
        ...formData,
        floor: parseInt(formData.floor),
        capacity: parseInt(formData.capacity)
      });
      alert('Studio created successfully!');
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating studio:', error);
      alert(error.response?.data?.detail || 'Failed to create studio');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      floor: '',
      capacity: '',
      branch_id: ''
    });
    setShowForm(false);
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  if (loading) {
    return <div className="admin-container"><div className="loading">Loading studios...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🎭 Manage Studios</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Studio'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h2>Create New Studio</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Studio Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Yoga Studio A"
                />
              </div>
              <div className="form-group">
                <label>Branch *</label>
                <select
                  name="branch_id"
                  value={formData.branch_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Floor *</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g., 1"
                />
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g., 20"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Create Studio
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <h2>All Studios ({studios.length})</h2>
        {studios.length === 0 ? (
          <p className="empty-message">No studios found. Create your first studio!</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Studio Name</th>
                  <th>Branch</th>
                  <th>Floor</th>
                  <th>Capacity</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {studios.map(studio => (
                  <tr key={studio.id}>
                    <td><strong>{studio.name}</strong></td>
                    <td>{getBranchName(studio.branch_id)}</td>
                    <td>Floor {studio.floor}</td>
                    <td>{studio.capacity} people</td>
                    <td>{new Date(studio.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudios;
