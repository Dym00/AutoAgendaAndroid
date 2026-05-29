import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const location = useLocation();
  const { t } = useTranslation();

  let currentTitle = title;
  if (location.pathname === '/profile') {
    currentTitle = t('profile.title');
  }

  return (
    <div className="app-container">
      <TopBar 
        title={currentTitle} 
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
