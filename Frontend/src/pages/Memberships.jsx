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
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [plansRes, membershipsRes, couponsRes] = await Promise.all([
        userAPI.getMembershipPlans(),
        userAPI.getMyMemberships(user.id),
        userAPI.getCoupons(),
      ]);
      setPlans(plansRes.data);
      setMyMemberships(membershipsRes.data);
      
      // Convert coupons array to object for easy lookup
      const couponsMap = {};
      couponsRes.data.forEach(coupon => {
        couponsMap[coupon.code] = {
          type: coupon.discount_type,
          value: coupon.discount_value,
          description: coupon.description
        };
      });
      setAvailableCoupons(couponsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    setCouponError('');
    setAppliedCoupon(null);

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // Check if coupon exists in available coupons from database
    const coupon = availableCoupons[couponCode.toUpperCase()];
    
    if (!coupon) {
      setCouponError('Invalid or expired coupon code');
      return;
    }

    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      ...coupon
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const calculateDiscount = (price) => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.value, price);
    } else {
      return (price * appliedCoupon.value) / 100;
    }
  };

  const getFinalPrice = (price) => {
    const discount = calculateDiscount(price);
    return price - discount;
  };

  const handlePurchase = async (planId, paymentMethod) => {
    setPurchasing(planId);
    try {
      const response = await userAPI.purchaseMembership(user.id, {
        plan_id: planId,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
      });
      
      // Show the message from backend which includes coupon info
      const message = response.data.message || 'Membership purchased successfully! 🎉';
      const finalAmount = response.data.final_amount;
      const discountApplied = response.data.discount_applied;
      
      let displayMessage = message;
      if (discountApplied > 0) {
        displayMessage += `\n\nFinal Amount: ₹${finalAmount.toFixed(2)}`;
      }
      
      alert(displayMessage);
      setCouponCode('');
      setAppliedCoupon(null);
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
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setCouponError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
            className="coupon-input"
            disabled={appliedCoupon !== null}
          />
          {!appliedCoupon ? (
            <button 
              onClick={applyCoupon}
              className="apply-coupon-btn"
              disabled={!couponCode.trim()}
            >
              Apply Coupon
            </button>
          ) : (
            <div className="coupon-applied">
              <span className="coupon-badge">
                ✅ {appliedCoupon.code} - {appliedCoupon.description}
              </span>
              <button onClick={removeCoupon} className="remove-coupon-btn">
                ✕
              </button>
            </div>
          )}
        </div>
        {couponError && <div className="coupon-error">❌ {couponError}</div>}
        
        {!appliedCoupon && Object.keys(availableCoupons).length > 0 && (
          <div className="available-coupons">
            <p className="available-coupons-label">Available Coupons:</p>
            <div className="coupons-list">
              {Object.entries(availableCoupons).map(([code, details]) => (
                <div key={code} className="coupon-chip" onClick={() => {
                  setCouponCode(code);
                  setCouponError('');
                }}>
                  <strong>{code}</strong> - {details.description}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="plans-grid">
          {plans.map((plan) => {
            const discount = calculateDiscount(plan.price);
            const finalPrice = getFinalPrice(plan.price);
            const hasDiscount = discount > 0;

            return (
              <div key={plan.id} className="plan-card">
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    {hasDiscount && (
                      <>
                        <div className="original-price">
                          <span className="currency">₹</span>
                          <span className="amount strikethrough">{plan.price}</span>
                        </div>
                        <div className="discount-badge">Save ₹{discount.toFixed(2)}</div>
                      </>
                    )}
                    <div className={hasDiscount ? "final-price" : ""}>
                      <span className="currency">₹</span>
                      <span className="amount">{hasDiscount ? finalPrice.toFixed(2) : plan.price}</span>
                      <span className="duration">/ {plan.duration_months} months</span>
                    </div>
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
            );
          })}
        </div>
      </section>

      <div className="coupon-info">
        <h4>💎 Available Coupons:</h4>
        <p><code>FIRST100</code> - ₹100 flat discount</p>
        <p><code>SUMMER50</code> - ₹50 flat discount</p>
        <p><code>NEWYEAR2025</code> - 20% discount</p>
        <p><code>REFER15</code> - 15% referral discount</p>
      </div>
    </div>
  );
};

export default Memberships;
