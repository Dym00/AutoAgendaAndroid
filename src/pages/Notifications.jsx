import React from 'react';
import { Bell, AlertTriangle, Package, CheckCircle } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import styles from './Appointments.module.css'; // Reutilizando list styles

const Notifications = () => {
  const mockNotifications = [
    { id: 1, type: 'alert', title: 'Estoque Crítico', message: 'Pastilhas de Freio (Cerâmica) com apenas 2 unidades restantes.', time: 'Há 10 min', read: false },
    { id: 2, type: 'info', title: 'Novo Agendamento', message: 'Beatriz Souza agendou Rodízio de Pneus às 14:30.', time: 'Há 1 hora', read: false },
    { id: 3, type: 'success', title: 'Serviço Concluído', message: 'Troca de óleo do Chevrolet Onix finalizada.', time: 'Há 2 horas', read: true },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle size={24} color="var(--danger)" />;
      case 'success': return <CheckCircle size={24} color="var(--success)" />;
      default: return <Package size={24} color="var(--primary)" />;
    }
  };

  return (
    <>
      <TopBar title="NOTIFICAÇÕES" showBack={true} />
      <div className={`page-content ${styles.container}`}>
        <div className={styles.list} role="list">
          {mockNotifications.map(notif => (
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
                  <span style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '600' }}>{notif.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default Notifications;
