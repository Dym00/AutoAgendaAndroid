import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight, Wrench } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, appointments, inventory } = useAppContext();
  const navigate = useNavigate();
  
  const userName = user ? (user.nomeFuncionario || user.name) : "Visitante";
  const todayDateObj = new Date();
  
  const dayStr = String(todayDateObj.getDate()).padStart(2, '0');
  const monthStrNum = String(todayDateObj.getMonth() + 1).padStart(2, '0');
  const yearStr = todayDateObj.getFullYear();
  const rawTodayStr = `${yearStr}-${monthStrNum}-${dayStr}`; // Formato ISO usado no DB/App (YYYY-MM-DD)

  const monthStr = todayDateObj.toLocaleString('pt-BR', { month: 'long' });
  const capitalizedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
  const displayDateStr = `${dayStr} de ${capitalizedMonth}`;

  // Filtra agendamentos do dia de hoje
  const todayAppointments = useMemo(() => {
    return appointments.filter(a => {
      // a.rawDate geralmente está no formato YYYY-MM-DD ou DD/MM/YYYY dependendo de como foi salvo.
      // O AppContext tenta normalizar a leitura em `rawDate`, mas vamos checar a string:
      if (!a.rawDate) return false;
      const dbDate = a.rawDate.split('T')[0];
      return dbDate === rawTodayStr;
    }).sort((a, b) => {
      // Ordena por horário
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  }, [appointments, rawTodayStr]);

  // Contadores
  let paraHoje = 0;
  let emAndamento = 0;
  let finalizados = 0;

  todayAppointments.forEach(app => {
    const st = (app.status || '').toLowerCase();
    if (st === 'concluído' || st === 'concluido') {
      finalizados++;
    } else if (st === 'em andamento') {
      emAndamento++;
    } else if (st !== 'cancelado') {
      paraHoje++;
    }
  });

  // Alertas de Estoque Crítico
  const criticalInventory = inventory.filter(i => i.critical);

  // Mapeamento de cores para a timeline
  const getStatusClass = (status) => {
    const st = (status || '').toLowerCase();
    if (st === 'concluído' || st === 'concluido') return styles.statusConcluido;
    if (st === 'em andamento') return styles.statusEmAndamento;
    if (st === 'agendado' || st === 'confirmado') return styles.statusAgendado;
    if (st === 'cancelado') return styles.statusCancelado;
    return styles.statusPendente; // Padrão/Pendente
  };

  return (
    <div className={styles.container}>
      <section className={styles.greetingSection}>
        <h2 className={styles.greeting} aria-level="2">
          Olá, {userName}!
        </h2>
        <p className={styles.dateSubtitle}>
          RESUMO DE HOJE, {displayDateStr}
        </p>
      </section>

      <section className={styles.summaryCards} aria-label="Resumo do fluxo do dia">
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Para Hoje</h3>
          <div className={styles.cardValue}>{paraHoje.toString().padStart(2, '0')}</div>
        </div>
        <div className={`${styles.card} ${styles.highlight}`}>
          <h3 className={styles.cardTitle}>Na Oficina</h3>
          <div className={styles.cardValue}>{emAndamento.toString().padStart(2, '0')}</div>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Finalizados</h3>
          <div className={styles.cardValue}>{finalizados.toString().padStart(2, '0')}</div>
        </div>
      </section>

      <section className={styles.timelineSection} aria-label="Linha do Tempo de Agendamentos">
        <div className={styles.timelineHeader}>
          <h3 className={styles.timelineTitle}>Fluxo do Dia</h3>
        </div>
        
        {todayAppointments.length === 0 ? (
          <div className={styles.emptyState}>Nenhum veículo agendado para hoje.</div>
        ) : (
          <div className={styles.timelineList}>
            {todayAppointments.map(app => (
              <div 
                key={app.id} 
                className={styles.timelineItem}
                onClick={() => navigate(`/appointments/edit/${app.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.timelineTime}>{app.time || '--:--'}</div>
                <div className={`${styles.timelineDot} ${getStatusClass(app.status)}`} />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineCar}>{app.car}</div>
                  <div className={styles.timelineClient}>{app.name}</div>
                  <div className={styles.timelineService}>
                    <Wrench size={12} />
                    {app.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.alertsSection} aria-labelledby="alerts-title">
        <div className={styles.alertsHeader}>
          <h3 id="alerts-title" className={styles.alertsTitle}>Comprar Urgente</h3>
          <button className={styles.viewAll} onClick={() => navigate('/inventory')} aria-label="Ver estoque completo">VER TODOS</button>
        </div>
        
        <div className={styles.alertList} role="list">
          {criticalInventory.map(item => (
            <div 
              key={item.id} 
              className={styles.alertItem} 
              role="button" 
              tabIndex={0}
              onClick={() => navigate(`/inventory/edit/${item.id}`)}
            >
              <AlertTriangle size={24} className={styles.alertIcon} aria-hidden="true" />
              <div className={styles.alertContent}>
                <div className={styles.alertName}>{item.name}</div>
                <div className={styles.alertStatus}>Estoque: {item.stock} (Abaixo do Mínimo)</div>
              </div>
              <ChevronRight size={20} color="var(--text-light)" aria-hidden="true" />
            </div>
          ))}

          {criticalInventory.length === 0 && (
            <p className={styles.emptyState}>Nenhum item em falta no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
