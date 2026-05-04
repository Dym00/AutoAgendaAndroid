import React from 'react';
import { Home, Calendar, Package, UserSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Início', i18nKey: 'nav.home' },
    { path: '/appointments', icon: Calendar, label: 'Agendamentos', i18nKey: 'nav.appointments' },
    { path: '/inventory', icon: Package, label: 'Estoque', i18nKey: 'nav.inventory' },
    { path: '/clients', icon: UserSquare, label: 'Clientes', i18nKey: 'nav.clients' }
  ];

  return (
    <nav className={styles.bottomNav} aria-label="Navegação Principal">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;
        
        return (
          <button
            key={item.path}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={t(item.i18nKey)}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={styles.iconWrapper}>
              <Icon size={24} aria-hidden="true" />
            </div>
            <span className={styles.label}>{t(item.i18nKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
