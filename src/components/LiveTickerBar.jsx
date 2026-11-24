import React from 'react';

const TICKER_ITEMS = [
  { text: 'SPECTRUM 1.0 IS LIVE', isHighlight: true },
  { text: '24-HOUR HACKATHON', isHighlight: false },
  { text: 'SPECTRUM 1.0 IS LIVE', isHighlight: true },
  { text: '9–10 DECEMBER 2026', isHighlight: false },
  { text: 'SPECTRUM 1.0 IS LIVE', isHighlight: true },
  { text: 'REGISTRATIONS OPEN', isHighlight: false },
  { text: 'SPECTRUM 1.0 IS LIVE', isHighlight: true },
  { text: 'PRIZES WORTH ₹40,000+', isHighlight: false },
  { text: 'SPECTRUM 1.0 IS LIVE', isHighlight: true },
  { text: 'BIDAR, KARNATAKA', isHighlight: false },
];

const LiveTickerBar = () => {
  return (
    <div className="live-ticker-bar" aria-label="Live event announcements">
      <div className="live-ticker-track">
        {/* Set 1 */}
        <div className="live-ticker-group">
          {TICKER_ITEMS.map((item, index) => (
            <div key={`g1-${index}`} className="live-ticker-item">
              {item.isHighlight ? (
                <>
                  <span className="live-ticker-pulse" />
                  <span className="live-ticker-highlight">
                    {item.text}
                  </span>
                </>
              ) : (
                <>
                  <span className="live-ticker-sep">✦</span>
                  <span className="live-ticker-regular">
                    {item.text}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Set 2 (Duplicate for infinite seamless loop) */}
        <div className="live-ticker-group" aria-hidden="true">
          {TICKER_ITEMS.map((item, index) => (
            <div key={`g2-${index}`} className="live-ticker-item">
              {item.isHighlight ? (
                <>
                  <span className="live-ticker-pulse" />
                  <span className="live-ticker-highlight">
                    {item.text}
                  </span>
                </>
              ) : (
                <>
                  <span className="live-ticker-sep">✦</span>
                  <span className="live-ticker-regular">
                    {item.text}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTickerBar;
