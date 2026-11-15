import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';
import '../styles/plans.css';

const PlansPage = () => {
  const { currentUser, currentPlanDetails, updateSubscriptionPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('842');
  const [confirmationMsg, setConfirmationMsg] = useState('');

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    updateSubscriptionPlan(selectedPlan.id);
    setConfirmationMsg(
      `Subscription updated to the ${selectedPlan.name} Plan (${selectedPlan.resolutionBadge}, up to ${selectedPlan.maxProfiles} profile(s))!`
    );
    setSelectedPlan(null);
    setTimeout(() => setConfirmationMsg(''), 4500);
  };

  return (
    <div className="plans-page container page-offset">
      <div className="plans-header">
        <span className="plan-pill">Simulated Billing & Tier Control</span>
        <h1>Choose the Plan That&apos;s Right for You</h1>
        <p>
          Upgrade or switch anytime. Your active plan directly controls maximum viewing profiles and
          streaming resolution across StreamVerse.
        </p>
      </div>

      {confirmationMsg && (
        <div className="plan-confirmation-banner">{confirmationMsg}</div>
      )}

      <div className="plans-grid">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentPlanDetails.id === plan.id;
          return (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular-plan' : ''} ${
                isCurrent ? 'current-plan-border' : ''
              }`}
            >
              {plan.popular && (
                <span className="popular-ribbon">MOST POPULAR</span>
              )}
              <div className="plan-card-head">
                <h2>{plan.name}</h2>
                <span className="plan-quality-tag">{plan.resolutionBadge}</span>
              </div>

              <div className="plan-price">
                <span className="currency">{plan.currency}</span>
                <span className="amount">{plan.priceMonthly.toLocaleString()}</span>
                <span className="period">/ month</span>
              </div>

              <div className="plan-specs">
                <div>
                  <span>Video Quality</span>
                  <strong>{plan.videoQuality}</strong>
                </div>
                <div>
                  <span>Max Viewing Profiles</span>
                  <strong>Up to {plan.maxProfiles} Profiles</strong>
                </div>
                <div>
                  <span>Simultaneous Streams</span>
                  <strong>{plan.simultaneousStreams} Device(s)</strong>
                </div>
              </div>

              <ul className="plan-features-list">
                {plan.features.map((feat, idx) => (
                  <li key={idx}>✓ {feat}</li>
                ))}
              </ul>

              <button
                type="button"
                className={`btn ${
                  isCurrent ? 'btn-outline' : 'btn-primary'
                } plan-cta-btn`}
                disabled={isCurrent}
                onClick={() => setSelectedPlan(plan)}
              >
                {isCurrent ? '✓ Current Active Plan' : `Switch to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="modal-backdrop" onClick={() => setSelectedPlan(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Simulated Plan Checkout</h2>
            <p className="modal-sub">
              Upgrading to <strong>{selectedPlan.name}</strong> ({selectedPlan.currency}{' '}
              {selectedPlan.priceMonthly}/mo • {selectedPlan.resolutionBadge} •{' '}
              {selectedPlan.maxProfiles} Profiles).
            </p>

            <form onSubmit={handleCheckoutSubmit} className="profile-form">
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Simulated Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Security Code (CVC)</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-btns">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedPlan(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Activate {selectedPlan.name}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansPage;

