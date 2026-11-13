import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/profiles.css';

const AVATAR_COLORS = ['#e50914', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#00b4d8'];
const AVATAR_ICONS = ['🎬', '🚀', '🎮', '🍿', '🌟', '🧸', '🦊', '⚡'];

const ProfilesPage = () => {
  const {
    currentUser,
    activeProfile,
    currentPlanDetails,
    selectProfile,
    addProfile,
    deleteProfile,
  } = useAuth();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [avatarIcon, setAvatarIcon] = useState(AVATAR_ICONS[0]);
  const [isKids, setIsKids] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser) return null;

  const canAddMore = currentUser.profiles.length < currentPlanDetails.maxProfiles;

  const handleChooseProfile = (profileId) => {
    if (manageMode) return;
    selectProfile(profileId);
    navigate('/');
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter a profile name.');
      return;
    }
    try {
      addProfile({ name, avatarColor, avatarIcon, isKids });
      setName('');
      setIsKids(false);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (profileId) => {
    setError('');
    try {
      deleteProfile(profileId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profiles-page">
      <div className="profiles-container container">
        <div className="profiles-header-info">
          <span className="plan-pill">
            {currentPlanDetails.name} Plan • {currentUser.profiles.length}/
            {currentPlanDetails.maxProfiles} Profiles Active
          </span>
          <h1>{manageMode ? 'Manage Profiles' : "Who's watching?"}</h1>
          <p>
            Select a profile to load personalized recommendations, My List, and Continue Watching
            progress.
          </p>
        </div>

        {error && <div className="profiles-alert">{error}</div>}

        <div className="profiles-grid">
          {currentUser.profiles.map((prof) => {
            const isSelected = activeProfile?.id === prof.id;
            return (
              <div
                key={prof.id}
                className={`profile-tile ${isSelected ? 'active-tile' : ''}`}
                onClick={() => handleChooseProfile(prof.id)}
              >
                <div
                  className="profile-avatar"
                  style={{ background: prof.avatarColor || '#e50914' }}
                >
                  <span className="profile-emoji">{prof.avatarIcon || '🎬'}</span>
                  {prof.isKids && <span className="kids-ribbon">KIDS</span>}
                  {manageMode && currentUser.profiles.length > 1 && (
                    <button
                      type="button"
                      className="profile-delete-btn"
                      title="Delete Profile"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(prof.id);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <span className="profile-tile-name">{prof.name}</span>
                <span className="profile-tile-meta">
                  {prof.isKids ? 'Age-appropriate only' : 'All Maturity Ratings'}
                </span>
              </div>
            );
          })}

          {canAddMore && (
            <button
              type="button"
              className="profile-tile add-profile-tile"
              onClick={() => {
                setError('');
                setShowAddModal(true);
              }}
            >
              <div className="profile-avatar add-avatar">
                <span>＋</span>
              </div>
              <span className="profile-tile-name">Add Profile</span>
              <span className="profile-tile-meta">Up to {currentPlanDetails.maxProfiles} allowed</span>
            </button>
          )}
        </div>

        {!canAddMore && (
          <p className="plan-limit-note">
            Reached the {currentPlanDetails.maxProfiles}-profile limit for the{' '}
            <strong>{currentPlanDetails.name}</strong> plan.{' '}
            <Link to="/plans">Upgrade your subscription</Link> to unlock up to 4 profiles.
          </p>
        )}

        <div className="profiles-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setManageMode((prev) => !prev)}
          >
            {manageMode ? 'Done Managing' : 'Manage Profiles'}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
            Continue to StreamVerse
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Create Viewing Profile</h2>
            <p className="modal-sub">
              Add a profile for another family member or enable Kids Mode for age-safe browsing.
            </p>

            <form onSubmit={handleCreateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="prof-name">Profile Name</label>
                <input
                  id="prof-name"
                  type="text"
                  placeholder="e.g. Family, Kids, Guest"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group">
                <label>Choose Avatar Color</label>
                <div className="swatch-row">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      type="button"
                      key={color}
                      className={`color-swatch ${avatarColor === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setAvatarColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Choose Icon</label>
                <div className="icon-row">
                  {AVATAR_ICONS.map((icon) => (
                    <button
                      type="button"
                      key={icon}
                      className={`icon-choice ${avatarIcon === icon ? 'selected' : ''}`}
                      onClick={() => setAvatarIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <label className="kids-checkbox-row">
                <input
                  type="checkbox"
                  checked={isKids}
                  onChange={(e) => setIsKids(e.target.checked)}
                />
                <div>
                  <strong>Kids Profile</strong>
                  <span>Only displays G, PG, TV-Y, and family-friendly titles.</span>
                </div>
              </label>

              <div className="modal-btns">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;

