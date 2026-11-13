import React, { useRef } from 'react';
import TitleCard from './TitleCard';

const ContentRow = ({ heading, subtitle, items = [], progressMap = {} }) => {
  const rowRef = useRef(null);

  if (!items || items.length === 0) return null;

  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    const amount = direction === 'left' ? -640 : 640;
    rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="content-row-section">
      <div className="content-row-header container">
        <div>
          <h2 className="content-row-title">{heading}</h2>
          {subtitle && <p className="content-row-sub">{subtitle}</p>}
        </div>
        <div className="content-row-arrows">
          <button
            type="button"
            className="row-arrow-btn"
            onClick={() => scrollRow('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            className="row-arrow-btn"
            onClick={() => scrollRow('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div className="content-row-track container" ref={rowRef}>
        {items.map((item) => (
          <TitleCard
            key={item.id}
            item={item}
            progressInfo={progressMap[item.id] || null}
          />
        ))}
      </div>
    </section>
  );
};

export default ContentRow;

