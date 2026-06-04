import React from 'react';

const SplashLoader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      zIndex: 999999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <style>
        {`
          .splash-loader-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #f1f5f9;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: splash-loader-spin 1s linear infinite;
          }
          @keyframes splash-loader-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        fontSize: '28px',
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: '2px',
        marginBottom: '32px'
      }}>AUTOAGENDA</div>
      <div className="splash-loader-spinner"></div>
    </div>
  );
};

export default SplashLoader;
