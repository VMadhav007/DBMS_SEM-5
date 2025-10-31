import { useState, useEffect } from 'react';
import { adminAPI } from '../api';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: [],
    activeMembers: [],
    popularSessions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [revenueRes, activeMembersRes, popularSessionsRes] = await Promise.all([
        adminAPI.getRevenueReport(),
        adminAPI.getActiveMembers(),
        adminAPI.getPopularSessions()
      ]);

      setStats({
        revenue: revenueRes.data,
        activeMembers: activeMembersRes.data,
        popularSessions: popularSessionsRes.data
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      alert('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const totalRevenue = stats.revenue.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
  const totalActiveMembers = stats.activeMembers.length;
  const totalPopularSessions = stats.popularSessions.reduce((sum, item) => sum + parseInt(item.total_bookings || 0), 0);

  if (loading) {
    return <div className="admin-dashboard"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your fitness center operations</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Active Members</h3>
            <p className="stat-value">{totalActiveMembers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <p className="stat-value">{totalPopularSessions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-info">
            <h3>Sessions</h3>
            <p className="stat-value">{stats.popularSessions.length}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/branches" className="action-card">
            <span className="action-icon">🏢</span>
            <h3>Manage Branches</h3>
            <p>Add, edit, or remove branches</p>
          </Link>

          <Link to="/admin/studios" className="action-card">
            <span className="action-icon">🎯</span>
            <h3>Manage Studios</h3>
            <p>Configure studio spaces</p>
          </Link>

          <Link to="/admin/sessions" className="action-card">
            <span className="action-icon">📆</span>
            <h3>Manage Sessions</h3>
            <p>Schedule and manage sessions</p>
          </Link>

          <Link to="/admin/coupons" className="action-card">
            <span className="action-icon">🎫</span>
            <h3>Manage Coupons</h3>
            <p>Create and manage discount coupons</p>
          </Link>

          <Link to="/admin/reports" className="action-card">
            <span className="action-icon">📊</span>
            <h3>View Reports</h3>
            <p>Detailed analytics and reports</p>
          </Link>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Recent Revenue by Branch</h2>
          <div className="table-container">
            {stats.revenue.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Total Revenue</th>
                    <th>Total Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.revenue.map((item, index) => (
                    <tr key={index}>
                      <td>{item.branch_name}</td>
                      <td className="currency">{formatCurrency(item.total_revenue)}</td>
                      <td>{item.total_bookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">No revenue data available</p>
            )}
          </div>
        </div>

        <div className="section">
          <h2>Popular Sessions</h2>
          <div className="table-container">
            {stats.popularSessions.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Activity</th>
                    <th>Total Bookings</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.popularSessions.slice(0, 10).map((session, index) => (
                    <tr key={index}>
                      <td>{session.session_name}</td>
                      <td>
                        <span className="activity-badge">{session.activity_type}</span>
                      </td>
                      <td>{session.total_bookings}</td>
                      <td>{session.instructor_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">No session data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
