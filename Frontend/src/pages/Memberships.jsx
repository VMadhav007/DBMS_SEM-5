import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { userAPI } from '../api';
import './Memberships.css';

const Memberships = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [plansRes, membershipsRes] = await Promise.all([
        userAPI.getMembershipPlans(),
        userAPI.getMyMemberships(user.id),
      ]);
      setPlans(plansRes.data);
      setMyMemberships(membershipsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId, paymentMethod) => {
    setPurchasing(planId);
    try {
      const response = await userAPI.purchaseMembership(user.id, {
        plan_id: planId,
        payment_method: paymentMethod,
        coupon_code: couponCode || null,
      });
      
      alert('Membership purchased successfully! 🎉');
      setCouponCode('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="memberships-container">
      <h1>💪 Memberships</h1>

      {/* Current Memberships */}
      <section className="memberships-section">
        <h2>My Memberships</h2>
        {myMemberships.length > 0 ? (
          <div className="membership-list">
            {myMemberships.map((membership) => (
              <div key={membership.id} className={`membership-card status-${membership.status}`}>
                <div className="membership-header">
                  <h3>{membership.plan_name}</h3>
                  <span className={`status-badge ${membership.status}`}>
                    {membership.status}
                  </span>
                </div>
                <div className="membership-details">
                  <p><strong>Start Date:</strong> {new Date(membership.start_date).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(membership.end_date).toLocaleDateString()}</p>
                  <p><strong>Price:</strong> ₹{membership.plan_price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No memberships yet. Purchase one below! 👇</p>
        )}
      </section>

      {/* Available Plans */}
      <section className="plans-section">
        <h2>Available Plans</h2>
        
        <div className="coupon-section">
          <input
            type="text"
            placeholder="Have a coupon code?"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="coupon-input"
          />
          {couponCode && <span className="coupon-badge">✅ Coupon will be applied</span>}
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price}</span>
                  <span className="duration">/ {plan.duration_months} months</span>
                </div>
              </div>
              
              <p className="plan-description">{plan.description || 'Full access to all facilities'}</p>
              
              <div className="plan-features">
                <div className="feature">✅ Access to all branches</div>
                <div className="feature">✅ Book unlimited sessions</div>
                <div className="feature">✅ Free check-ins</div>
                <div className="feature">✅ {plan.duration_months} months validity</div>
              </div>
              
              <div className="payment-methods">
                <button
                  onClick={() => handlePurchase(plan.id, 'upi')}
                  disabled={purchasing === plan.id}
                  className="payment-btn upi"
                >
                  {purchasing === plan.id ? 'Processing...' : 'Pay with UPI'}
                </button>
                <button
                  onClick={() => handlePurchase(plan.id, 'card')}
                  disabled={purchasing === plan.id}
                  className="payment-btn card"
                >
                  {purchasing === plan.id ? 'Processing...' : 'Pay with Card'}
                </button>
                <button
                  onClick={() => handlePurchase(plan.id, 'cash')}
                  disabled={purchasing === plan.id}
                  className="payment-btn cash"
                >
                  {purchasing === plan.id ? 'Processing...' : 'Pay Cash'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="coupon-info">
        <h4>💎 Available Coupons:</h4>
        <p><code>FIRST100</code> - ₹100 off on first purchase</p>
        <p><code>SUMMER50</code> - ₹50 off</p>
      </div>
    </div>
  );
};

export default Memberships;
