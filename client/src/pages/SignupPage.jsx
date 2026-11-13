import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('standard');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    try {
      signup({ name, email, password, role, subscriptionPlan });
      navigate('/profiles');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-backdrop-overlay" />
      <header className="auth-header container">
        <Link to="/" className="brand-logo">
          STREAM<span>VERSE</span>
        </Link>
      </header>

      <div className="auth-card-wrapper">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">
            Unlimited movies, TV series, and personalized profiles starting today.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Haris Hassaan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password (min 6 chars)</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="plan-select">Subscription Tier</label>
                <select
                  id="plan-select"
                  value={subscriptionPlan}
                  onChange={(e) => setSubscriptionPlan(e.target.value)}
                >
                  <option value="basic">Basic (480p • 1 Profile)</option>
                  <option value="standard">Standard (1080p • 2 Profiles)</option>
                  <option value="premium">Premium (4K HDR • 4 Profiles)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="role-select">Account Role</label>
                <select
                  id="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Subscriber (User)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn">
              Start Membership
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

