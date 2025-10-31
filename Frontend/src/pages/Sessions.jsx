import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { userAPI } from '../api';
import './Sessions.css';

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await userAPI.getSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (sessionId) => {
    setBooking(sessionId);
    try {
      await userAPI.bookSession(user.id, { session_id: sessionId });
      alert('Session booked successfully! 🎉');
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.detail || 'Booking failed');
    } finally {
      setBooking(null);
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.activity_type_name?.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) {
    return <div className="loading">Loading sessions...</div>;
  }

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h1>📅 Available Sessions</h1>
        <p>Book your next fitness session</p>
      </div>

      <div className="filter-section">
        <button
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'yoga' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('yoga')}
        >
          🧘 Yoga
        </button>
        <button
          className={filter === 'cardio' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('cardio')}
        >
          🏃 Cardio
        </button>
        <button
          className={filter === 'weight' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('weight')}
        >
          🏋️ Weight Training
        </button>
        <button
          className={filter === 'zumba' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('zumba')}
        >
          💃 Zumba
        </button>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="empty-state">
          <p>No sessions available at the moment.</p>
        </div>
      ) : (
        <div className="sessions-grid">
          {filteredSessions.map((session) => {
            const { date, time } = formatDateTime(session.start_time);
            const isLowCapacity = session.available_spots <= 5;
            const isFull = session.available_spots === 0;

            return (
              <div key={session.id} className={`session-card ${isFull ? 'full' : ''}`}>
                <div className="session-header">
                  <h3>{session.name}</h3>
                  <span className="activity-badge">{session.activity_type_name}</span>
                </div>

                <div className="session-info">
                  <div className="info-item">
                    <span className="icon">📍</span>
                    <span>{session.branch_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">📅</span>
                    <span>{date}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">⏰</span>
                    <span>{time}</span>
                  </div>
                  <div className="info-item">
                    <span className="icon">👨‍🏫</span>
                    <span>{session.instructor || 'TBA'}</span>
                  </div>
                </div>

                <div className={`capacity-info ${isLowCapacity ? 'low' : ''}`}>
                  <span className="capacity-text">
                    {isFull ? '🔴 Fully Booked' : `✅ ${session.available_spots} spots available`}
                  </span>
                </div>

                {session.description && (
                  <p className="session-description">{session.description}</p>
                )}

                <button
                  className="book-btn"
                  onClick={() => handleBook(session.id)}
                  disabled={booking === session.id || isFull}
                >
                  {booking === session.id ? 'Booking...' : isFull ? 'Fully Booked' : 'Book Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sessions;
