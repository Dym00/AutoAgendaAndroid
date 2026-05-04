import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export const MainLayout = ({ 
  title, 
  showProfile = true, 
  showNotifications = true,
  hasUnread = false,
  userName = "Ricardo"
}) => {
  return (
    <div className="app-container">
      <TopBar 
        title={title} 
        showProfile={showProfile} 
        showNotifications={showNotifications} 
        hasUnread={hasUnread}
        userName={userName}
      />
      <main className="page-content" role="main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export const AuthLayout = () => {
  return (
    <div className="app-container">
      <main className="page-content full-height" role="main">
        <Outlet />
      </main>
    </div>
  );
};
