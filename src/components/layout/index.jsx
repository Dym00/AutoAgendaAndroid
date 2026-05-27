import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import PullToRefresh from '../common/PullToRefresh';
import { AppContext } from '../../context/AppContext';

export const MainLayout = ({ 
  title, 
  showProfile = true, 
  showNotifications = true,
  hasUnread = false,
  userName = "Ricardo"
}) => {
  const { loadData } = useContext(AppContext);

  return (
    <div className="app-container">
      <TopBar 
        title={title} 
        showProfile={showProfile} 
        showNotifications={showNotifications} 
        hasUnread={hasUnread}
        userName={userName}
      />
      <PullToRefresh onRefresh={async () => { if (loadData) await loadData(); }}>
        <main className="page-content" role="main">
          <Outlet />
        </main>
      </PullToRefresh>
      <BottomNav />
    </div>
  );
};

export const AuthLayout = () => {
  const { loadData } = useContext(AppContext);

  return (
    <div className="app-container">
      <PullToRefresh onRefresh={async () => { if (loadData) await loadData(); }}>
        <main className="page-content full-height" role="main">
          <Outlet />
        </main>
      </PullToRefresh>
    </div>
  );
};
