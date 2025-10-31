import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';
import './Admin.css';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percent',
    discount_value: '',
    valid_from: '',
    valid_to: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await adminAPI.getCoupons();
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      alert('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCoupon({
        ...formData,
        discount_value: parseFloat(formData.discount_value)
      });
      alert('Coupon created successfully!');
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert(error.response?.data?.detail || 'Failed to create coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percent',
      discount_value: '',
      valid_from: '',
      valid_to: '',
      is_active: true
    });
    setShowForm(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDiscountDisplay = (coupon) => {
    if (coupon.discount_type === 'percent') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `₹${coupon.discount_value} OFF`;
    }
  };

  const isExpired = (validTo) => {
    return new Date(validTo) < new Date();
  };

  if (loading) {
    return <div className="admin-container"><div className="loading">Loading coupons...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🎟️ Manage Coupons</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Coupon'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h2>Create New Coupon</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., SUMMER50"
                  style={{ textTransform: 'uppercase' }}
                />
                <small>Code will be in UPPERCASE</small>
              </div>
              <div className="form-group">
                <label>Discount Type *</label>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  required
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount Value *</label>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder={formData.discount_type === 'percent' ? 'e.g., 20' : 'e.g., 100'}
                />
                <small>{formData.discount_type === 'percent' ? 'Enter percentage (0-100)' : 'Enter amount in ₹'}</small>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="e.g., Summer Sale - 50% off"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Valid From *</label>
                <input
                  type="datetime-local"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Valid To *</label>
                <input
                  type="datetime-local"
                  name="valid_to"
                  value={formData.valid_to}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span>Active (users can use this coupon)</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Create Coupon
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <h2>All Coupons ({coupons.length})</h2>
        {coupons.length === 0 ? (
          <p className="empty-message">No coupons found. Create your first coupon!</p>
        ) : (
          <div className="coupons-grid">
            {coupons.map(coupon => (
              <div 
                key={coupon.id} 
                className={`coupon-card ${!coupon.is_active ? 'inactive' : ''} ${isExpired(coupon.valid_to) ? 'expired' : ''}`}
              >
                <div className="coupon-header">
                  <h3>{coupon.code}</h3>
                  <div className="coupon-badge">
                    {getDiscountDisplay(coupon)}
                  </div>
                </div>
                <p className="coupon-description">{coupon.description}</p>
                <div className="coupon-details">
                  <div className="detail-row">
                    <span className="label">Valid From:</span>
                    <span className="value">{formatDate(coupon.valid_from)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Valid To:</span>
                    <span className="value">{formatDate(coupon.valid_to)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className={`status ${coupon.is_active ? 'active' : 'inactive'}`}>
                      {isExpired(coupon.valid_to) ? '⏰ Expired' : coupon.is_active ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
