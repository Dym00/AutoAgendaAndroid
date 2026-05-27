import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';
import './common.css';

const PullToRefresh = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef(null);

  const MAX_PULL = 100;
  const THRESHOLD = 70;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0 || refreshing) return;

    const y = e.touches[0].clientY;
    const distance = y - startY;

    if (distance > 0 && window.scrollY === 0) {
      // Prevent default to avoid scrolling the whole page while pulling
      if (e.cancelable) e.preventDefault();
      setCurrentY(Math.min(distance * 0.5, MAX_PULL));
    }
  };

  const handleTouchEnd = async () => {
    if (currentY >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setCurrentY(THRESHOLD); // lock at threshold position
      
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setCurrentY(0);
        setStartY(0);
      }
    } else {
      setCurrentY(0);
      setStartY(0);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: true });
      el.addEventListener('touchmove', handleTouchMove, { passive: false });
      el.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [startY, currentY, refreshing]);

  return (
    <div ref={containerRef} className="ptr-wrapper">
      {/* Pull indicator */}
      <div 
        className="ptr-indicator-container"
        style={{ 
          transform: `translateY(${currentY - 60}px)`,
          opacity: Math.min(currentY / THRESHOLD, 1),
          transition: refreshing ? 'transform 0.2s ease-out' : currentY === 0 ? 'transform 0.2s ease-out, opacity 0.2s' : 'none'
        }}
      >
        <div className="ptr-indicator">
          {refreshing ? (
            <Loader2 className="ptr-icon ptr-icon-spin" />
          ) : (
            <ArrowDown 
              className="ptr-icon" 
              style={{ 
                transform: `rotate(${Math.min((currentY / THRESHOLD) * 180, 180)}deg)`,
                transition: 'transform 0.1s linear'
              }}
            />
          )}
        </div>
      </div>
      
      {/* Content wrapper - NO TRANSFORM HERE to avoid breaking position: fixed! */}
      <div className="ptr-content">
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
