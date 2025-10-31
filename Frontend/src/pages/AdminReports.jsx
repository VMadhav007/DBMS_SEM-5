import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';
import './Admin.css';

const AdminReports = () => {
  const [revenueReport, setRevenueReport] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [popularSessions, setPopularSessions] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);
  const [topBranch, setTopBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [membershipRevenueRes, activityRes, sessionsRes, membersRes, branchRes] = await Promise.all([
        adminAPI.getTotalMembershipRevenue(),
        adminAPI.getUserActivityReport(),
        adminAPI.getPopularSessions(),
        adminAPI.getActiveMembers(),
        adminAPI.getTopBranch()
      ]);
      
      // Get membership revenue
      const totalRevenue = membershipRevenueRes.data.total_revenue || 0;
      
      setRevenueReport({
        total_revenue: totalRevenue
      });
      
      // User activity report is an array of users
      const activityData = activityRes.data;
      setUserActivity({
        total_users: activityData.length,
        total_bookings: 0, // Not in this endpoint
        total_checkins: activityData.reduce((sum, user) => sum + parseInt(user.total_checkins || 0), 0),
        users: activityData
      });
      
      setPopularSessions(sessionsRes.data);
      setActiveMembers(membersRes.data);
      setTopBranch(branchRes.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-container"><div className="loading">Loading reports...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📊 Reports & Analytics</h1>
        <button className="btn-primary" onClick={fetchReports}>
          🔄 Refresh Data
        </button>
      </div>

      {/* Revenue Report */}
      {revenueReport && (
        <div className="report-section">
          <h2>💰 Revenue Report</h2>
          <div className="stats-grid">
            <div className="stat-card highlight">
              <div className="stat-icon">💵</div>
              <div className="stat-content">
                <h3>Total Membership Revenue</h3>
                <p className="stat-value">₹{revenueReport.total_revenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Report */}
      {userActivity && (
        <div className="report-section">
          <h2>👥 User Activity</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-content">
                <h3>Active Users</h3>
                <p className="stat-value">{userActivity.total_users || 0}</p>
                <small style={{fontSize: '0.85rem', opacity: 0.8}}>Users with check-ins</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Total Check-ins</h3>
                <p className="stat-value">{userActivity.total_checkins || 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Avg Check-ins/User</h3>
                <p className="stat-value">{userActivity.total_users > 0 ? (userActivity.total_checkins / userActivity.total_users).toFixed(1) : 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Performing Branch */}
      {topBranch && topBranch.branch_name && (
        <div className="report-section">
          <h2>🏆 Top Performing Branch</h2>
          <div className="highlight-card">
            <div className="highlight-content">
              <h3>{topBranch.branch_name}</h3>
              <p className="location">{topBranch.city}</p>
              <div className="branch-stats">
                <div className="branch-stat">
                  <span className="label">Total Bookings:</span>
                  <span className="value">{topBranch.total_bookings || 0}</span>
                </div>
                <div className="branch-stat">
                  <span className="label">Total Revenue:</span>
                  <span className="value">₹{topBranch.total_revenue?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Sessions */}
      <div className="report-section">
        <h2>🔥 Popular Sessions</h2>
        <div className="admin-table-card">
          {popularSessions.length === 0 ? (
            <p className="empty-message">No sessions data available</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Session Name</th>
                    <th>Instructor</th>
                    <th>Branch</th>
                    <th>Total Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {popularSessions.map((session, index) => (
                    <tr key={index}>
                      <td className="rank">{index + 1}</td>
                      <td><strong>{session.session_name}</strong></td>
                      <td>{session.instructor || 'N/A'}</td>
                      <td>{session.branch_name}</td>
                      <td>
                        <span className="booking-count">{session.total_bookings}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Active Members */}
      <div className="report-section">
        <h2>⭐ Active Membership</h2>
        <div className="admin-table-card">
          {activeMembers.length === 0 ? (
            <p className="empty-message">No active members</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMembers.map((member) => (
                    <tr key={member.user_id}>
                      <td><strong>{member.user_name}</strong></td>
                      <td>{member.email}</td>
                      <td>{member.plan_name}</td>
                      <td>{new Date(member.start_date).toLocaleDateString()}</td>
                      <td>{new Date(member.end_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${member.status}`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
