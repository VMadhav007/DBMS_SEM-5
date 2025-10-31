import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={isAdmin() ? '/admin' : '/dashboard'} className="nav-logo">
          <span className="logo-icon">🏋️</span>
          <span className="logo-text">FitnessPro</span>
        </Link>

        <div className="nav-menu">
          {user && (
            <>
              {isAdmin() ? (
                // Admin Navigation
                <>
                  <Link to="/admin" className="nav-link">Dashboard</Link>
                  <Link to="/admin/branches" className="nav-link">Branches</Link>
                  <Link to="/admin/studios" className="nav-link">Studios</Link>
                  <Link to="/admin/sessions" className="nav-link">Sessions</Link>
                  <Link to="/admin/coupons" className="nav-link">Coupons</Link>
                  <Link to="/admin/reports" className="nav-link">Reports</Link>
                </>
              ) : (
                // User Navigation
                <>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/memberships" className="nav-link">Memberships</Link>
                  <Link to="/sessions" className="nav-link">Sessions</Link>
                  <Link to="/bookings" className="nav-link">My Bookings</Link>
                  <Link to="/payments" className="nav-link">Payments</Link>
                </>
              )}

              <div className="nav-user">
                <span className="user-name">{user.userName}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
