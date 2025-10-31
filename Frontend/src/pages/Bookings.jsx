import { useState, useEffect } from 'react';
import { userAPI } from '../api';
import { useAuth } from '../AuthContext';
import './Bookings.css';

function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const response = await userAPI.getMyBookings(user.id);
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      alert('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await userAPI.cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      loadBookings(); // Reload bookings
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert(err.response?.data?.detail || 'Failed to cancel booking');
    }
  };

  const handleCheckin = async (sessionId) => {
    try {
      await userAPI.checkin(user.id, { session_id: sessionId });
      alert('Check-in successful!');
      loadBookings(); // Reload bookings
    } catch (err) {
      console.error('Failed to check-in:', err);
      alert(err.response?.data?.detail || 'Failed to check-in');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  if (loading) {
    return <div className="bookings-container"><p>Loading bookings...</p></div>;
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>View and manage your session bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any sessions yet.</p>
          <a href="/sessions" className="sessions-link">Browse Available Sessions</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.booking_id} className={`booking-card ${booking.booking_status?.toLowerCase()}`}>
              <div className="booking-header">
                <div>
                  <h3>{booking.session_name || 'Session'}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(booking.booking_status)}`}>
                    {booking.booking_status}
                  </span>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="icon">📅</span>
                  <div className="detail-content">
                    <strong>Date & Time</strong>
                    <p>{formatDateTime(booking.session_date)}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">🏋️</span>
                  <div className="detail-content">
                    <strong>Activity</strong>
                    <p>{booking.activity_type || 'N/A'}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">👤</span>
                  <div className="detail-content">
                    <strong>Instructor</strong>
                    <p>{booking.instructor_name || 'N/A'}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="icon">📍</span>
                  <div className="detail-content">
                    <strong>Location</strong>
                    <p>{booking.branch_name || 'N/A'} - {booking.studio_name || 'Studio'}</p>
                  </div>
                </div>

                {booking.booking_date && (
                  <div className="detail-row">
                    <span className="icon">🕐</span>
                    <div className="detail-content">
                      <strong>Booked On</strong>
                      <p>{new Date(booking.booking_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                {booking.booking_status?.toLowerCase() === 'confirmed' && (
                  <>
                    <button
                      className="action-btn checkin-btn"
                      onClick={() => handleCheckin(booking.session_id)}
                    >
                      Check-in
                    </button>
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
                {booking.booking_status?.toLowerCase() === 'cancelled' && (
                  <p className="cancelled-message">This booking has been cancelled</p>
                )}
                {booking.booking_status?.toLowerCase() === 'completed' && (
                  <p className="completed-message">✓ Session completed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
