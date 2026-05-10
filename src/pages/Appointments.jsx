import { useTranslation } from 'react-i18next';
import { Car, Wrench, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './Appointments.module.css';

const Appointments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { appointments, deleteAppointment } = useAppContext();
  
  const today = new Date();
  const day = today.getDate();
  const monthStr = today.toLocaleString('pt-BR', { month: 'long' });
  const capitalizedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
  const dateStr = `Hoje, ${day} de ${capitalizedMonth}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title} aria-level="2">{dateStr}</h2>
        <p className={styles.subtitle}>AGENDAMENTOS</p>
      </div>

      <div className={styles.list} role="list" aria-label="Lista de agendamentos de hoje">
        {appointments.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>Nenhum agendamento para hoje.</p>
        ) : appointments.map(app => (
          <article 
            key={app.id} 
            className={`${styles.card} ${app.isNew ? styles.newCustomer : ''}`}
            role="listitem"
            tabIndex={0}
            aria-label={`Agendamento para ${app.name} às ${app.time}. Veículo: ${app.car}. Serviço: ${app.service}. ${app.isNew ? 'Cliente Novo' : ''}`}
          >
            <div aria-hidden="true">
              <div className={styles.cardHeader}>
                <div className={styles.clientName}>
                  {app.name}
                  {app.isNew && <span className={styles.badgeNovo}>NOVO</span>}
                </div>
                <div className={styles.time}>{app.time}</div>
              </div>
              
              <div className={styles.carInfo}>
                <Car size={16} />
                <span>{app.car}</span>
              </div>
              <div className={styles.serviceInfo}>
                <Wrench size={16} style={{flexShrink: 0}} />
                <span>Serviço: {app.service}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <button 
                onClick={() => navigate(`/appointments/edit/${app.id}`)}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '44px', minHeight: '44px' }}
                aria-label={`Editar agendamento de ${app.name}`}
              >
                <Edit size={20} aria-hidden="true" /> Editar
              </button>
              <button 
                onClick={() => deleteAppointment(app.id)}
                style={{ background: 'none', border: 'none', color: '#ff4444', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '44px', minHeight: '44px' }}
                aria-label={`Excluir agendamento de ${app.name}`}
              >
                <Trash2 size={20} aria-hidden="true" /> Excluir
              </button>
            </div>
          </article>
        ))}
      </div>

      <button className={styles.fab} aria-label="Criar novo agendamento" onClick={() => navigate('/appointments/new')}>
        <Plus size={24} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Appointments;
