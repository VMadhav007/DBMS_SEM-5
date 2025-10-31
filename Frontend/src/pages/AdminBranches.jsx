import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';
import './Admin.css';

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: ''
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await adminAPI.getBranches();
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      alert('Failed to fetch branches');
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
      if (editingBranch) {
        await adminAPI.updateBranch(editingBranch.id, formData);
        alert('Branch updated successfully!');
      } else {
        await adminAPI.createBranch(formData);
        alert('Branch created successfully!');
      }
      resetForm();
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert(error.response?.data?.detail || 'Failed to save branch');
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      zip_code: branch.zip_code,
      phone: branch.phone
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    
    try {
      await adminAPI.deleteBranch(id);
      alert('Branch deleted successfully!');
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert(error.response?.data?.detail || 'Failed to delete branch');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      phone: ''
    });
    setEditingBranch(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-container"><div className="loading">Loading branches...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🏢 Manage Branches</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Branch'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h2>{editingBranch ? 'Edit Branch' : 'Create New Branch'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Branch Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Downtown Fitness Hub"
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 022-12345678"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="e.g., 123 Main Street"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Maharashtra"
                />
              </div>
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 400001"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingBranch ? 'Update Branch' : 'Create Branch'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <h2>All Branches ({branches.length})</h2>
        {branches.length === 0 ? (
          <p className="empty-message">No branches found. Create your first branch!</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>ZIP</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(branch => (
                  <tr key={branch.id}>
                    <td><strong>{branch.name}</strong></td>
                    <td>{branch.address}</td>
                    <td>{branch.city}</td>
                    <td>{branch.state}</td>
                    <td>{branch.zip_code}</td>
                    <td>{branch.phone}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(branch)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(branch.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
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

export default AdminBranches;
