import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';
import './Admin.css';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [studios, setStudios] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    instructor: '',
    capacity: '',
    branch_id: '',
    studio_id: '',
    activity_type_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, branchesRes, studiosRes, activityTypesRes] = await Promise.all([
        adminAPI.getSessions(),
        adminAPI.getBranches(),
        adminAPI.getStudios(),
        adminAPI.getActivityTypes()
      ]);
      setSessions(sessionsRes.data);
      setBranches(branchesRes.data);
      setStudios(studiosRes.data);
      setActivityTypes(activityTypesRes.data);
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
      await adminAPI.createSession({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
      alert('Session created successfully!');
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating session:', error);
      alert(error.response?.data?.detail || 'Failed to create session');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await adminAPI.deleteSession(id);
      alert('Session deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert(error.response?.data?.detail || 'Failed to delete session');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      start_time: '',
      end_time: '',
      instructor: '',
      capacity: '',
      branch_id: '',
      studio_id: '',
      activity_type_id: ''
    });
    setShowForm(false);
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  const getStudioName = (studioId) => {
    const studio = studios.find(s => s.id === studioId);
    return studio ? studio.name : 'Unknown';
  };

  const getActivityTypeName = (activityTypeId) => {
    const activityType = activityTypes.find(a => a.id === activityTypeId);
    return activityType ? activityType.name : 'Unknown';
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="admin-container"><div className="loading">Loading sessions...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📅 Manage Sessions</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Session'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h2>Create New Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Session Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Morning Yoga Flow"
                />
              </div>
              <div className="form-group">
                <label>Instructor *</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  placeholder="e.g., John Doe"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the session..."
                rows="3"
              />
            </div>

            <div className="form-row">
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
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Studio *</label>
                <select
                  name="studio_id"
                  value={formData.studio_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Studio</option>
                  {studios.map(studio => (
                    <option key={studio.id} value={studio.id}>
                      {studio.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Activity Type *</label>
                <select
                  name="activity_type_id"
                  value={formData.activity_type_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Activity</option>
                  {activityTypes.map(activity => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
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
                Create Session
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-card">
        <h2>All Sessions ({sessions.length})</h2>
        {sessions.length === 0 ? (
          <p className="empty-message">No sessions found. Create your first session!</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Session Name</th>
                  <th>Activity</th>
                  <th>Instructor</th>
                  <th>Branch</th>
                  <th>Studio</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session.id}>
                    <td><strong>{session.name}</strong></td>
                    <td>{getActivityTypeName(session.activity_type_id)}</td>
                    <td>{session.instructor}</td>
                    <td>{getBranchName(session.branch_id)}</td>
                    <td>{getStudioName(session.studio_id)}</td>
                    <td>{formatDateTime(session.start_time)}</td>
                    <td>{formatDateTime(session.end_time)}</td>
                    <td>{session.capacity}</td>
                    <td className="actions">
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(session.id)}
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

export default AdminSessions;
