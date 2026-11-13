import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(email, password);
      navigate('/profiles');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuickDemo = (demoEmail) => {
    setError('');
    try {
      login(demoEmail, 'password123');
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
          <h1>Sign In</h1>
          <p className="auth-subtitle">
            Welcome back to StreamVerse. Sign in to access your profiles and watchlist.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn">
              Sign In
            </button>
          </form>

          <div className="demo-login-box">
            <span className="demo-label">Instant Evaluation Accounts:</span>
            <div className="demo-buttons">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickDemo('harishassaan2004@gmail.com')}
              >
                Admin (Haris — Premium)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickDemo('nadeemhashir53@gmail.com')}
              >
                User (Hashir — Standard)
              </button>
            </div>
          </div>

          <p className="auth-switch">
            New to StreamVerse? <Link to="/signup">Create an account now</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

