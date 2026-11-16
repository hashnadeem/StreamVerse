import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import '../styles/admin.css';

const EMPTY_FORM = {
  title: '',
  type: 'Movie',
  synopsis: '',
  genres: 'Sci-Fi, Action',
  releaseYear: 2026,
  maturityRating: 'PG-13',
  isKidsSafe: false,
  duration: '2h 05m',
  cast: '',
  director: '',
  posterUrl: '',
  backdropUrl: '',
  videoUrl: '',
  featured: false,
  trending: true,
};

const AdminDashboard = () => {
  const { users, toggleUserRole, toggleUserStatus } = useAuth();
  const {
    titles,
    createTitle,
    updateTitle,
    deleteTitle,
    addEpisodeToSeries,
    deleteEpisodeFromSeries,
  } = useStream();

  const [activeTab, setActiveTab] = useState('catalog');
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [episodeTargetId, setEpisodeTargetId] = useState('');
  const [epForm, setEpForm] = useState({
    seasonNumber: 1,
    episodeNumber: 1,
    title: '',
    duration: '46m',
    synopsis: '',
    videoUrl: '',
  });
  const [feedback, setFeedback] = useState('');
  const [uploadStatus, setUploadStatus] = useState({
    poster: '',
    video: '',
    epVideo: '',
  });

  const totalViews = titles.reduce((acc, t) => acc + (t.viewsCount || 0), 0);
  const mostWatched = [...titles].sort(
    (a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)
  )[0];

  const notify = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    const formData = new FormData();
    formData.append(type === 'video' || type === 'epVideo' ? 'video' : 'poster', file);

    setUploadStatus((prev) => ({ ...prev, [type]: 'Uploading via Multer...' }));

    try {
      const endpoint =
        type === 'video' || type === 'epVideo'
          ? '/api/upload/video'
          : '/api/upload/poster';
      const token = localStorage.getItem('streamverse_token');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (type === 'poster') {
          setFormState((prev) => ({ ...prev, posterUrl: data.url }));
          setUploadStatus((prev) => ({ ...prev, poster: `✓ Multer Upload: ${file.name}` }));
        } else if (type === 'video') {
          setFormState((prev) => ({ ...prev, videoUrl: data.url }));
          setUploadStatus((prev) => ({ ...prev, video: `✓ Multer Upload: ${file.name}` }));
        } else if (type === 'epVideo') {
          setEpForm((prev) => ({ ...prev, videoUrl: data.url }));
          setUploadStatus((prev) => ({ ...prev, epVideo: `✓ Multer Upload: ${file.name}` }));
        }
        notify(`Uploaded ${file.name} to server via Multer!`);
      } else {
        const localUrl = URL.createObjectURL(file);
        if (type === 'poster') {
          setFormState((prev) => ({ ...prev, posterUrl: localUrl }));
          setUploadStatus((prev) => ({ ...prev, poster: `✓ Staged: ${file.name}` }));
        } else if (type === 'video') {
          setFormState((prev) => ({ ...prev, videoUrl: localUrl }));
          setUploadStatus((prev) => ({ ...prev, video: `✓ Staged: ${file.name}` }));
        } else if (type === 'epVideo') {
          setEpForm((prev) => ({ ...prev, videoUrl: localUrl }));
          setUploadStatus((prev) => ({ ...prev, epVideo: `✓ Staged: ${file.name}` }));
        }
        notify(`File ${file.name} staged successfully.`);
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      if (type === 'poster') {
        setFormState((prev) => ({ ...prev, posterUrl: localUrl }));
        setUploadStatus((prev) => ({ ...prev, poster: `✓ Staged: ${file.name}` }));
      } else if (type === 'video') {
        setFormState((prev) => ({ ...prev, videoUrl: localUrl }));
        setUploadStatus((prev) => ({ ...prev, video: `✓ Staged: ${file.name}` }));
      } else if (type === 'epVideo') {
        setEpForm((prev) => ({ ...prev, videoUrl: localUrl }));
        setUploadStatus((prev) => ({ ...prev, epVideo: `✓ Staged: ${file.name}` }));
      }
      notify(`File ${file.name} staged successfully.`);
    }
  };

  const handleSaveTitle = (e) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    if (editingId) {
      updateTitle(editingId, formState);
      notify(`Updated "${formState.title}" in the catalogue.`);
      setEditingId(null);
    } else {
      createTitle(formState);
      notify(`Published new ${formState.type}: "${formState.title}"!`);
    }
    setFormState(EMPTY_FORM);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormState({
      title: item.title,
      type: item.type,
      synopsis: item.synopsis,
      genres: item.genres.join(', '),
      releaseYear: item.releaseYear,
      maturityRating: item.maturityRating,
      isKidsSafe: Boolean(item.isKidsSafe),
      duration: item.duration,
      cast: item.cast.join(', '),
      director: item.director || '',
      posterUrl: item.posterUrl,
      backdropUrl: item.backdropUrl,
      videoUrl: item.videoUrl,
      featured: Boolean(item.featured),
      trending: Boolean(item.trending),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddEpisode = (e) => {
    e.preventDefault();
    if (!episodeTargetId || !epForm.title.trim()) return;
    addEpisodeToSeries(episodeTargetId, epForm);
    notify(`Added Episode "${epForm.title}" to series!`);
    setEpForm({
      seasonNumber: 1,
      episodeNumber: 1,
      title: '',
      duration: '45m',
      synopsis: '',
      videoUrl: '',
    });
  };

  const seriesList = titles.filter((t) => t.type === 'Series');

  return (
    <div className="admin-page container page-offset">
      <div className="admin-header">
        <div>
          <span className="plan-pill">Role-Based Admin Studio</span>
          <h1>StreamVerse Administrator Dashboard</h1>
          <p>
            Manage movies, series, episodes, poster/video streams, user roles, and platform
            analytics.
          </p>
        </div>
      </div>

      <div className="stats-cards-grid">
        <div className="stat-card">
          <span className="stat-label">Registered Accounts</span>
          <strong className="stat-value">{users.length}</strong>
          <span className="stat-foot">
            {users.reduce((acc, u) => acc + u.profiles.length, 0)} Total Viewing Profiles
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Catalogue Library</span>
          <strong className="stat-value">{titles.length} Titles</strong>
          <span className="stat-foot">
            {titles.filter((t) => t.type === 'Movie').length} Movies •{' '}
            {titles.filter((t) => t.type === 'Series').length} Series
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Platform Streams</span>
          <strong className="stat-value">{totalViews.toLocaleString()}</strong>
          <span className="stat-foot">Cumulative views across titles</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Most-Watched Title</span>
          <strong className="stat-value stat-title-truncate">
            {mostWatched?.title || 'N/A'}
          </strong>
          <span className="stat-foot">
            ★ {mostWatched?.averageRating.toFixed(1)} •{' '}
            {(mostWatched?.viewsCount || 0).toLocaleString()} views
          </span>
        </div>
      </div>

      {feedback && <div className="admin-feedback-banner">{feedback}</div>}

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          🎬 Movies & Series CRUD
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
          onClick={() => setActiveTab('episodes')}
        >
          📺 Series Episode Manager
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User & Role Management
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="admin-split-layout">
          <form onSubmit={handleSaveTitle} className="admin-panel-card">
            <h3>{editingId ? 'Edit Catalogue Title' : 'Add New Movie / Series'}</h3>

            <div className="form-group">
              <label>Title Name</label>
              <input
                type="text"
                placeholder="e.g. Solaris Protocol"
                value={formState.title}
                onChange={(e) =>
                  setFormState({ ...formState, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Media Type</label>
                <select
                  value={formState.type}
                  onChange={(e) =>
                    setFormState({ ...formState, type: e.target.value })
                  }
                >
                  <option value="Movie">Movie</option>
                  <option value="Series">Series</option>
                </select>
              </div>

              <div className="form-group">
                <label>Maturity Rating</label>
                <select
                  value={formState.maturityRating}
                  onChange={(e) =>
                    setFormState({ ...formState, maturityRating: e.target.value })
                  }
                >
                  <option value="G">G (Kids Safe)</option>
                  <option value="PG">PG (Kids Safe)</option>
                  <option value="TV-Y">TV-Y (Kids Safe)</option>
                  <option value="PG-13">PG-13</option>
                  <option value="TV-14">TV-14</option>
                  <option value="R">R</option>
                  <option value="TV-MA">TV-MA</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Release Year</label>
                <input
                  type="number"
                  value={formState.releaseYear}
                  onChange={(e) =>
                    setFormState({ ...formState, releaseYear: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Duration / Seasons</label>
                <input
                  type="text"
                  placeholder="e.g. 2h 10m or 2 Seasons"
                  value={formState.duration}
                  onChange={(e) =>
                    setFormState({ ...formState, duration: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Genres (comma separated)</label>
              <input
                type="text"
                value={formState.genres}
                onChange={(e) =>
                  setFormState({ ...formState, genres: e.target.value })
                }
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Cast Members (comma separated)</label>
                <input
                  type="text"
                  placeholder="Actor 1, Actor 2"
                  value={formState.cast}
                  onChange={(e) =>
                    setFormState({ ...formState, cast: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Director</label>
                <input
                  type="text"
                  placeholder="Director name"
                  value={formState.director}
                  onChange={(e) =>
                    setFormState({ ...formState, director: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Poster Image (Multer Upload or Cloudinary URL)</label>
              <div className="admin-upload-zone">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or upload below"
                  value={formState.posterUrl}
                  onChange={(e) =>
                    setFormState({ ...formState, posterUrl: e.target.value })
                  }
                />
                <div className="upload-action-row">
                  <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                    📁 Upload Poster via Multer
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input-hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'poster')}
                    />
                  </label>
                  {uploadStatus.poster && (
                    <span className="upload-feedback-badge">{uploadStatus.poster}</span>
                  )}
                  {formState.posterUrl && (
                    <img
                      src={formState.posterUrl}
                      alt="Poster Preview"
                      className="upload-preview-thumb"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Video Stream (Multer Video File or HTTP Range Stream URL)</label>
              <div className="admin-upload-zone">
                <input
                  type="url"
                  placeholder="https://commondatastorage.googleapis.com/... or upload below"
                  value={formState.videoUrl}
                  onChange={(e) =>
                    setFormState({ ...formState, videoUrl: e.target.value })
                  }
                />
                <div className="upload-action-row">
                  <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                    🎬 Upload Video via Multer
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="file-input-hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'video')}
                    />
                  </label>
                  {uploadStatus.video && (
                    <span className="upload-feedback-badge">{uploadStatus.video}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Synopsis</label>
              <textarea
                rows={3}
                value={formState.synopsis}
                onChange={(e) =>
                  setFormState({ ...formState, synopsis: e.target.value })
                }
                required
              />
            </div>

            <div className="admin-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formState.isKidsSafe}
                  onChange={(e) =>
                    setFormState({ ...formState, isKidsSafe: e.target.checked })
                  }
                />
                Kids Profile Safe
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formState.trending}
                  onChange={(e) =>
                    setFormState({ ...formState, trending: e.target.checked })
                  }
                />
                Trending Row
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formState.featured}
                  onChange={(e) =>
                    setFormState({ ...formState, featured: e.target.checked })
                  }
                />
                Hero Banner Featured
              </label>
            </div>

            <div className="admin-form-btns">
              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormState(EMPTY_FORM);
                  }}
                >
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Save Changes' : 'Publish Title'}
              </button>
            </div>
          </form>

          <div className="admin-panel-card">
            <h3>Existing Catalogue ({titles.length})</h3>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {titles.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <strong>{t.title}</strong>
                        <div className="table-sub">
                          {t.releaseYear} • {t.maturityRating}{' '}
                          {t.isKidsSafe ? '• Kids Safe' : ''}
                        </div>
                      </td>
                      <td>{t.type}</td>
                      <td>★ {t.averageRating.toFixed(1)}</td>
                      <td>{(t.viewsCount || 0).toLocaleString()}</td>
                      <td>
                        <div className="table-action-btns">
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => startEdit(t)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              deleteTitle(t.id);
                              notify(`Removed "${t.title}" from catalogue.`);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'episodes' && (
        <div className="admin-panel-card" style={{ maxWidth: '680px' }}>
          <h3>Add Episode to a TV Series</h3>
          <form onSubmit={handleAddEpisode} className="auth-form">
            <div className="form-group">
              <label>Select Series</label>
              <select
                value={episodeTargetId}
                onChange={(e) => setEpisodeTargetId(e.target.value)}
                required
              >
                <option value="">-- Choose Series --</option>
                {seriesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.episodes?.length || 0} episodes)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Season Number</label>
                <input
                  type="number"
                  min={1}
                  value={epForm.seasonNumber}
                  onChange={(e) =>
                    setEpForm({ ...epForm, seasonNumber: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Episode Number</label>
                <input
                  type="number"
                  min={1}
                  value={epForm.episodeNumber}
                  onChange={(e) =>
                    setEpForm({ ...epForm, episodeNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Episode Title</label>
                <input
                  type="text"
                  placeholder="e.g. Echoes in the Dark"
                  value={epForm.title}
                  onChange={(e) =>
                    setEpForm({ ...epForm, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={epForm.duration}
                  onChange={(e) =>
                    setEpForm({ ...epForm, duration: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Episode Video Stream (Multer Upload or Range URL)</label>
              <div className="admin-upload-zone">
                <input
                  type="url"
                  placeholder="https://... or upload local episode file"
                  value={epForm.videoUrl}
                  onChange={(e) =>
                    setEpForm({ ...epForm, videoUrl: e.target.value })
                  }
                />
                <div className="upload-action-row">
                  <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                    🎬 Upload Episode Video via Multer
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="file-input-hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'epVideo')}
                    />
                  </label>
                  {uploadStatus.epVideo && (
                    <span className="upload-feedback-badge">{uploadStatus.epVideo}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Episode Synopsis</label>
              <textarea
                rows={3}
                value={epForm.synopsis}
                onChange={(e) =>
                  setEpForm({ ...epForm, synopsis: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Episode to Series
            </button>
          </form>

          {episodeTargetId && (
            <div className="episodes-manage-list">
              <h4>
                Existing Episodes in &ldquo;
                {seriesList.find((s) => s.id === episodeTargetId)?.title}&rdquo; (
                {seriesList.find((s) => s.id === episodeTargetId)?.episodes?.length || 0})
              </h4>
              {(
                seriesList.find((s) => s.id === episodeTargetId)?.episodes || []
              ).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No episodes registered yet for this series.
                </p>
              ) : (
                seriesList
                  .find((s) => s.id === episodeTargetId)
                  ?.episodes.map((ep) => (
                    <div key={ep.id} className="ep-item-card">
                      <div className="ep-item-meta">
                        <strong>
                          S{ep.seasonNumber}:E{ep.episodeNumber} — {ep.title}
                        </strong>
                        <span>{ep.duration} • {ep.synopsis}</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--brand-red)', borderColor: 'var(--brand-red)' }}
                        onClick={() => {
                          deleteEpisodeFromSeries(episodeTargetId, ep.id);
                          notify(`Removed episode "${ep.title}" from series.`);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-panel-card">
          <h3>Platform Users & Role Control</h3>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name & Email</th>
                  <th>Plan Tier</th>
                  <th>Profiles</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      <div className="table-sub">{u.email}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {u.subscriptionPlan}
                    </td>
                    <td>{u.profiles.length}</td>
                    <td>
                      <span
                        className={`role-badge ${
                          u.role === 'admin' ? 'admin' : ''
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{u.status || 'active'}</td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => toggleUserRole(u.id)}
                        >
                          Toggle Admin
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => toggleUserStatus(u.id)}
                        >
                          {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

