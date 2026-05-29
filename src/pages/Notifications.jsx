import React, { useEffect } from 'react';
import { Bell, AlertTriangle, Package, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import styles from './Appointments.module.css'; // Reutilizando list styles

const Notifications = () => {
  const { t } = useTranslation();
  const { notifications, markAllAsRead } = useAppContext();

  useEffect(() => {
    markAllAsRead();
  }, []); // Marca todas como lidas ao abrir a tela

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return t('notifications.justNow', 'Agora mesmo');
    if (diffMins < 60) return t('notifications.minsAgo', { count: diffMins, defaultValue: `Há ${diffMins} min` });
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return t('notifications.hoursAgo', { count: diffHours, defaultValue: `Há ${diffHours} hora(s)` });
    
    const diffDays = Math.floor(diffHours / 24);
    return t('notifications.daysAgo', { count: diffDays, defaultValue: `Há ${diffDays} dia(s)` });
  };

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle size={24} color="var(--danger)" />;
      case 'success': return <CheckCircle size={24} color="var(--success)" />;
      default: return <Package size={24} color="var(--primary)" />;
    }
  };

  return (
    <>
      <TopBar title={t('notifications.title')} showBack={true} />
      <div className={`page-content ${styles.container}`}>
        <div className={styles.list} role="list">
          {notifications && notifications.length > 0 ? notifications.map(notif => (
            <article 
              key={notif.id} 
              className={styles.card}
              style={{ borderLeftColor: notif.read ? 'transparent' : 'var(--primary)', opacity: notif.read ? 0.7 : 1 }}
              role="listitem"
              tabIndex={0}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <div aria-hidden="true">{getIcon(notif.type)}</div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{notif.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{notif.message}</p>
                  <span style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '600' }}>{formatTime(notif.time)}</span>
                </div>
              </div>
            </article>
          )) : (
            <p style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>Nenhuma notificação por aqui.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
