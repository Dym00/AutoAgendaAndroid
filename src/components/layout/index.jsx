import React, { useContext, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import PullToRefresh from '../common/PullToRefresh';
import SideMenu from './SideMenu';
import { AppContext } from '../../context/AppContext';

export const MainLayout = ({ 
  title, 
  showProfile = true, 
  showNotifications = true,
  hasUnread = false,
  userName = "Ricardo"
}) => {
  const { loadData, user } = useContext(AppContext);
  const location = useLocation();
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const touchCurrentX = e.touches[0].clientX;
    const diff = touchCurrentX - touchStartX.current;

    // Se deslizou da esquerda para a direita (abrir menu)
    // Só permite abrir se o toque começou bem no canto esquerdo (< 40px)
    if (!isMenuOpen && diff > 50 && touchStartX.current < 40) {
      setIsMenuOpen(true);
      touchStartX.current = null;
    }
    
    // Se deslizou da direita para a esquerda (fechar menu)
    if (isMenuOpen && diff < -50) {
      setIsMenuOpen(false);
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <div 
      className="app-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TopBar 
        title={title} 
        showProfile={showProfile} 
        showNotifications={showNotifications} 
        hasUnread={hasUnread}
        userName={user ? (user.nomeFuncionario || user.name || userName) : userName}
        onOpenMenu={() => setIsMenuOpen(true)}
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
