import { useState, useEffect } from 'react';
import { userAPI } from '../api';
import { useAuth } from '../AuthContext';
import './Payments.css';

function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPayments();
    }
  }, [user]);

  const loadPayments = async () => {
    try {
      const response = await userAPI.getMyPayments(user.id);
      setPayments(response.data);
    } catch (err) {
      console.error('Failed to load payments:', err);
      alert('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'upi':
        return '📱';
      case 'card':
        return '💳';
      case 'cash':
        return '💵';
      default:
        return '💰';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'status-success';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-default';
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.payment_status?.toLowerCase() === filter;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => {
    return sum + parseFloat(payment.amount || 0);
  }, 0);

  if (loading) {
    return <div className="payments-container"><p>Loading payments...</p></div>;
  }

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h1>Payment History</h1>
        <p>View all your transactions and payment details</p>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-value">{filteredPayments.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p className="stat-value">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'success' ? 'active' : ''}`}
          onClick={() => setFilter('success')}
        >
          Success
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
          onClick={() => setFilter('failed')}
        >
          Failed
        </button>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <p>No payments found{filter !== 'all' ? ` with status: ${filter}` : ''}.</p>
        </div>
      ) : (
        <div className="payments-list">
          {filteredPayments.map(payment => (
            <div key={payment.payment_id} className="payment-card">
              <div className="payment-header">
                <div className="payment-method">
                  <span className="method-icon">
                    {getPaymentMethodIcon(payment.payment_method)}
                  </span>
                  <div>
                    <h3>{payment.payment_method?.toUpperCase() || 'Payment'}</h3>
                    <p className="payment-id">ID: {payment.payment_id}</p>
                  </div>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(payment.payment_status)}`}>
                  {payment.payment_status}
                </span>
              </div>

              <div className="payment-details">
                <div className="detail-item">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value amount">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>

                {payment.discount_applied > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">Discount</span>
                    <span className="detail-value discount">
                      -{formatCurrency(payment.discount_applied)}
                    </span>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">
                    {formatDate(payment.payment_date)}
                  </span>
                </div>

                {payment.membership_name && (
                  <div className="detail-item">
                    <span className="detail-label">Membership</span>
                    <span className="detail-value">
                      {payment.membership_name}
                    </span>
                  </div>
                )}

                {payment.coupon_code && (
                  <div className="detail-item">
                    <span className="detail-label">Coupon Used</span>
                    <span className="detail-value coupon">
                      {payment.coupon_code}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Payments;
