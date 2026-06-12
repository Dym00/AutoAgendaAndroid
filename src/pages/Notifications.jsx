import React, { useEffect } from 'react';
import { Bell, AlertTriangle, Package, CheckCircle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import TopBar from '../components/layout/TopBar';
import styles from './Appointments.module.css';

const Notifications = () => {
  const { t } = useTranslation();
  const { notifications, markAllAsRead, clearNotifications } = useAppContext();

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
        {notifications && notifications.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <AccessibleNode 
              as="button"
              onClick={clearNotifications}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', 
                backgroundColor: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', padding: '8px 16px',
                borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer'
              }}
              textToSpeak={t('a11y.clearNotifications', 'Apagar todas as notificações')}
            >
              <Trash2 size={16} />
              {t('notifications.clearAll', 'Limpar Todas')}
            </AccessibleNode>
          </div>
        )}
        <div className={styles.list} role="list">
          {notifications && notifications.length > 0 ? notifications.map(notif => (
            <AccessibleNode
              as="article"
              key={notif.id} 
              className={styles.card}
              style={{ borderLeftColor: notif.read ? 'transparent' : 'var(--primary)', opacity: notif.read ? 0.7 : 1 }}
              textToSpeak={t('a11y.notificationItem', { title: t(notif.title), message: t(notif.message, notif.params || {}), time: formatTime(notif.time), defaultValue: `Notificação: ${t(notif.title)}. ${t(notif.message, notif.params || {})}. Recebida ${formatTime(notif.time)}` })}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <div aria-hidden="true">{getIcon(notif.type)}</div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{t(notif.title)}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t(notif.message, notif.params || {})}</p>
                  <span style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '600' }}>{formatTime(notif.time)}</span>
                </div>
              </div>
            </AccessibleNode>
          )) : (
            <p style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>{t('notifications.empty', 'Nenhuma notificação por aqui.')}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
