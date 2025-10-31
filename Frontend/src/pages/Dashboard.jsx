import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { userAPI } from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(user.id);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}! 🎉</h1>
        <p>Manage your fitness journey here</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{profile?.total_checkins || 0}</h3>
            <p>Total Check-ins</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <h3>{profile?.active_membership ? 'Active' : 'Inactive'}</h3>
            <p>Membership Status</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{user.email}</h3>
            <p>Email Address</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/memberships" className="action-card">
            <span className="action-icon">🏆</span>
            <h3>My Memberships</h3>
            <p>View and manage your memberships</p>
          </Link>

          <Link to="/sessions" className="action-card">
            <span className="action-icon">📅</span>
            <h3>Browse Sessions</h3>
            <p>Explore available fitness sessions</p>
          </Link>

          <Link to="/bookings" className="action-card">
            <span className="action-icon">📝</span>
            <h3>My Bookings</h3>
            <p>View your booked sessions</p>
          </Link>

          <Link to="/payments" className="action-card">
            <span className="action-icon">💳</span>
            <h3>Payment History</h3>
            <p>View your payment transactions</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
