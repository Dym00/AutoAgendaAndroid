import { useTranslation } from 'react-i18next';
import { Car, Wrench, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Appointments.module.css';

const Appointments = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { appointments, deleteAppointment } = useAppContext();
  
  const today = new Date();
  const dateStr = today.toLocaleString(i18n.language, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title} aria-level="2">{t('appointments.today')} • {dateStr}</h2>
        <p className={styles.subtitle}>{t('appointments.title')}</p>
      </div>

      <div className={styles.list} role="list" aria-label={t('appointments.title')}>
        {appointments.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>{t('common.emptyAppointments')}</p>
        ) : appointments.map(app => (
          <AccessibleNode 
            as="article"
            key={app.id} 
            className={`${styles.card} ${app.isNew ? styles.newCustomer : ''}`}
            textToSpeak={t('appointments.tts_appointment', {
              name: app.name,
              time: app.time,
              car: app.car,
              service: app.service,
              isNew: app.isNew ? t('appointments.newCustomer') : ''
            })}
          >
            <div aria-hidden="true">
              <div className={styles.cardHeader}>
                <div className={styles.clientName}>
                  {app.name}
                  {app.isNew && <span className={styles.badgeNovo}>{t('appointments.newCustomer')}</span>}
                </div>
                <div className={styles.time}>{app.time}</div>
              </div>
              
              <div className={styles.carInfo}>
                <Car size={16} />
                <span>{app.car}</span>
              </div>
              <div className={styles.serviceInfo}>
                <Wrench size={16} style={{flexShrink: 0}} />
                <span>{t('appointments.service')}: {app.service}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <AccessibleNode 
                as="button"
                onClick={() => navigate(`/appointments/edit/${app.id}`)}
                textToSpeak={t('appointments.tts_edit', { name: app.name })}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '44px', minHeight: '44px' }}
                aria-label={t('common.edit')}
              >
                <Edit size={20} aria-hidden="true" /> {t('common.edit')}
              </AccessibleNode>
              <AccessibleNode 
                as="button"
                onClick={() => deleteAppointment(app.id)}
                textToSpeak={t('appointments.tts_delete', { name: app.name })}
                style={{ background: 'none', border: 'none', color: '#ff4444', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '44px', minHeight: '44px' }}
                aria-label={t('common.delete')}
              >
                <Trash2 size={20} aria-hidden="true" /> {t('common.delete')}
              </AccessibleNode>
            </div>
          </AccessibleNode>
        ))}
      </div>

      <AccessibleNode 
        as="button"
        className={styles.fab} 
        aria-label={t('common.add')} 
        textToSpeak={t('appointments.tts_create')}
        onClick={() => navigate('/appointments/new')}
      >
        <Plus size={24} aria-hidden="true" />
      </AccessibleNode>
    </div>
  );
};

export default Appointments;
