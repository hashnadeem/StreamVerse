import React, { useRef, useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStream } from '../context/StreamContext';
import '../styles/player.css';

const formatTime = (sec) => {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const total = Math.floor(sec);
  const mins = Math.floor(total / 60);
  const rem = total % 60;
  return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
};

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { activeProfile, currentPlanDetails, saveWatchProgress } = useAuth();
  const { getTitleById, incrementViews } = useStream();

  const item = getTitleById(id);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const epParam = searchParams.get('ep');
  const activeEpisode =
    item?.type === 'Series' && item.episodes?.length
      ? item.episodes.find(
          (e) => e.id === epParam || String(e.episodeNumber) === String(epParam)
        ) || item.episodes[0]
      : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [streamMode, setStreamMode] = useState('range'); // 'range' | 'cdn'

  useEffect(() => {
    if (item) {
      incrementViews(item.id);
    }
  }, [id]);

  // Restore saved progress for this profile & title
  useEffect(() => {
    if (!item || !videoRef.current) return;
    const saved = activeProfile?.continueWatching?.find(
      (cw) => cw.titleId === item.id
    );
    if (saved && saved.progressSeconds > 5) {
      videoRef.current.currentTime = saved.progressSeconds;
      setCurrentTime(saved.progressSeconds);
    }
  }, [id, activeEpisode?.id]);

  if (!item) {
    return (
      <div className="container page-offset" style={{ textAlign: 'center' }}>
        <h2>Stream Unavailable</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/browse')}
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const rawSource = activeEpisode ? activeEpisode.videoUrl : item.videoUrl;
  const streamSource =
    streamMode === 'range' && rawSource
      ? `/api/catalog/stream?videoPath=${encodeURIComponent(rawSource)}`
      : rawSource;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipSeconds = (delta) => {
    if (!videoRef.current) return;
    const next = Math.max(
      0,
      Math.min(duration || 0, videoRef.current.currentTime + delta)
    );
    videoRef.current.currentTime = next;
    setCurrentTime(next);
  };

  const handleSeek = (e) => {
    const nextTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
    }
    setCurrentTime(nextTime);
  };

  const handleVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    setMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !muted;
    setMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 100;
    setCurrentTime(cur);
    if (Math.floor(cur) % 5 === 0 && cur > 2) {
      saveWatchProgress(item.id, cur, dur, activeEpisode?.id || null);
    }
  };

  return (
    <div className="player-screen" ref={containerRef}>
      <div className="player-top-bar">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => {
            if (videoRef.current && currentTime > 2) {
              saveWatchProgress(
                item.id,
                currentTime,
                duration || 100,
                activeEpisode?.id || null
              );
            }
            navigate(`/title/${item.id}`);
          }}
        >
          ← Back to Details
        </button>

        <div className="player-stream-heading">
          <h2>
            {item.title}
            {activeEpisode && (
              <span>
                {' '}
                — S{activeEpisode.seasonNumber}:E{activeEpisode.episodeNumber}{' '}
                &ldquo;{activeEpisode.title}&rdquo;
              </span>
            )}
          </h2>
        </div>

        <div className="player-quality-pills">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setStreamMode((prev) => (prev === 'range' ? 'cdn' : 'range'))}
            title="Toggle between Express HTTP 206 Range Stream and Direct CDN Stream"
            style={{
              borderColor: streamMode === 'range' ? 'var(--brand-red)' : 'var(--border-subtle)',
              color: streamMode === 'range' ? '#ffffff' : 'var(--text-secondary)',
              background: streamMode === 'range' ? 'var(--brand-red-soft)' : 'transparent',
            }}
          >
            {streamMode === 'range' ? '⚡ Express HTTP Range (206)' : '🌐 CDN Stream'}
          </button>
          <span className="badge badge-hd">
            {currentPlanDetails.resolutionBadge}
          </span>
          {item.type === 'Series' && item.episodes?.length > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowEpisodeDrawer((prev) => !prev)}
            >
              📑 Episodes ({item.episodes.length})
            </button>
          )}
        </div>
      </div>

      <div className="player-stage" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={streamSource}
          className="html5-video-canvas"
          onLoadedMetadata={() =>
            setDuration(videoRef.current?.duration || 0)
          }
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
        />

        {!isPlaying && (
          <button
            type="button"
            className="center-big-play"
            aria-label="Play Video"
          >
            ▶
          </button>
        )}
      </div>

      {showEpisodeDrawer && item.episodes?.length > 0 && (
        <aside className="player-episode-drawer">
          <div className="drawer-header">
            <h4>Switch Episode</h4>
            <button
              type="button"
              onClick={() => setShowEpisodeDrawer(false)}
            >
              ✕
            </button>
          </div>
          <div className="drawer-ep-list">
            {item.episodes.map((ep) => {
              const isCurrent = activeEpisode?.id === ep.id;
              return (
                <button
                  type="button"
                  key={ep.id}
                  className={`drawer-ep-item ${isCurrent ? 'active' : ''}`}
                  onClick={() => {
                    setSearchParams({ ep: ep.id });
                    setShowEpisodeDrawer(false);
                  }}
                >
                  <strong>
                    S{ep.seasonNumber}:E{ep.episodeNumber} — {ep.title}
                  </strong>
                  <span>{ep.duration}</span>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      <div className="player-controls-bar">
        <div className="seekbar-row">
          <span className="time-label">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="video-seek-slider"
          />
          <span className="time-label">{formatTime(duration)}</span>
        </div>

        <div className="controls-buttons-row">
          <div className="controls-left">
            <button
              type="button"
              className="ctrl-btn"
              onClick={togglePlay}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            <button
              type="button"
              className="ctrl-btn"
              onClick={() => skipSeconds(-10)}
            >
              ⏪ 10s
            </button>

            <button
              type="button"
              className="ctrl-btn"
              onClick={() => skipSeconds(10)}
            >
              10s ⏩
            </button>

            <div className="volume-control">
              <button
                type="button"
                className="ctrl-btn"
                onClick={toggleMute}
              >
                {muted || volume === 0 ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="volume-slider"
              />
            </div>
          </div>

          <div className="controls-right">
            <div className="speed-selector">
              {[0.75, 1, 1.25, 1.5].map((spd) => (
                <button
                  type="button"
                  key={spd}
                  className={`speed-pill ${playbackRate === spd ? 'active' : ''}`}
                  onClick={() => changeSpeed(spd)}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              type="button"
              className="ctrl-btn"
              onClick={toggleFullscreen}
            >
              ⛶ Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;

