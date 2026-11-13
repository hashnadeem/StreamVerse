import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const {
    currentUser,
    activeProfile,
    currentPlanDetails,
    isAdmin,
    selectProfile,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) {
      navigate('/browse');
      return;
    }
    navigate(`/browse?q=${encodeURIComponent(quickQuery.trim())}`);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className={`sv-navbar ${scrolled ? 'sv-navbar-scrolled' : ''}`}>
      <div className="sv-navbar-inner container">
        <div className="sv-navbar-left">
          <Link to="/" className="brand-logo">
            STREAM<span>VERSE</span>
          </Link>

          {currentUser && (
            <nav className="sv-nav-links">
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/browse">Browse & Filter</NavLink>
              <NavLink to="/my-list">My List</NavLink>
              <NavLink to="/plans">Plans</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="admin-nav-pill">
                  Admin Studio
                </NavLink>
              )}
            </nav>
          )}
        </div>

        <div className="sv-navbar-right">
          {currentUser ? (
            <>
              <form onSubmit={handleQuickSearch} className="sv-quick-search">
                <input
                  type="search"
                  placeholder="Titles, genres, cast..."
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  🔍
                </button>
              </form>

              {activeProfile?.isKids && (
                <span className="badge badge-kids" title="Only age-appropriate content shown">
                  KIDS MODE
                </span>
              )}

              <span className="badge badge-hd" title="Active Plan Stream Quality">
                {currentPlanDetails.resolutionBadge}
              </span>

              <div className="sv-profile-menu">
                <button
                  type="button"
                  className="sv-profile-trigger"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <span
                    className="sv-mini-avatar"
                    style={{ background: activeProfile?.avatarColor || '#e50914' }}
                  >
                    {activeProfile?.avatarIcon || '🎬'}
                  </span>
                  <span className="sv-profile-name">{activeProfile?.name || 'Profile'}</span>
                  <span className="sv-caret">▾</span>
                </button>

                {dropdownOpen && (
                  <div
                    className="sv-profile-dropdown"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="dropdown-section-label">Switch Profile</div>
                    {currentUser.profiles.map((prof) => (
                      <button
                        type="button"
                        key={prof.id}
                        className={`dropdown-profile-item ${
                          prof.id === activeProfile?.id ? 'current' : ''
                        }`}
                        onClick={() => {
                          selectProfile(prof.id);
                          setDropdownOpen(false);
                        }}
                      >
                        <span
                          className="sv-mini-avatar"
                          style={{ background: prof.avatarColor }}
                        >
                          {prof.avatarIcon}
                        </span>
                        <span>{prof.name}</span>
                        {prof.isKids && <span className="mini-kids-tag">KIDS</span>}
                      </button>
                    ))}
                    <hr className="dropdown-divider" />
                    <Link
                      to="/profiles"
                      className="dropdown-action"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👥 Manage Profiles
                    </Link>
                    <Link
                      to="/plans"
                      className="dropdown-action"
                      onClick={() => setDropdownOpen(false)}
                    >
                      💳 Subscription ({currentPlanDetails.name})
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-action"
                        onClick={() => setDropdownOpen(false)}
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      className="dropdown-action logout-btn"
                      onClick={handleLogout}
                    >
                      🚪 Sign Out of StreamVerse
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="sv-guest-actions">
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

