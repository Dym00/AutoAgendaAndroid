import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, Activity, AlertTriangle, Package, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, appointments, inventory } = useAppContext();
  
  const userName = user ? user.name : "Ricardo";
  const today = new Date();
  const day = today.getDate();
  const monthStr = today.toLocaleString('pt-BR', { month: 'long' });
  const capitalizedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
  const todayStr = `${day} de ${capitalizedMonth}`; // Fixo para match com Figma

  const scheduledCount = appointments.length;
  const inServiceCount = appointments.filter(a => a.service.includes('Óleo')).length || 1; // mock logic
  const criticalInventory = inventory.filter(i => i.critical);
  const belowIdealInventory = inventory.filter(i => i.stock < 10 && !i.critical);

  return (
    <div className={styles.container}>
      <section className={styles.greetingSection}>
        <h2 className={styles.greeting} aria-level="2">
          {t('dashboard.greeting', { name: userName })}
        </h2>
        <p className={styles.dateSubtitle}>
          {t('dashboard.todaySummary', { date: todayStr })}
        </p>
      </section>

      <section className={styles.summaryCards} aria-label="Resumo diário">
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('dashboard.scheduled')}</h3>
          <div className={styles.cardValue}>0{scheduledCount}</div>
          <div className={styles.cardFooter}>
            <TrendingDown size={16} className={styles.trendIcon} aria-hidden="true" />
            <span>- 1 {t('dashboard.today')}</span>
          </div>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('dashboard.inService')}</h3>
          <div className={styles.cardValue}>0{inServiceCount}</div>
          <div className={styles.cardFooter}>
            <Activity size={16} className={styles.trendIcon} aria-hidden="true" />
            <span>{t('dashboard.capacity')} 80%</span>
          </div>
        </div>
      </section>

      <section className={styles.chartSection} aria-label="Gráfico de desempenho semanal">
        <div className={styles.chartTabs}>
          <button className={`${styles.chartTab} ${styles.active}`}>{t('dashboard.appointmentsTab')}</button>
          <button className={styles.chartTab}>{t('dashboard.inventoryTab')}</button>
        </div>
        <h3 className={styles.chartTitle}>{t('dashboard.weeklyPerformance')}</h3>
        <div className={styles.mockChart} aria-hidden="true">
          {/* Mock bars for visual matching Figma */}
          <div className={styles.bar} style={{ height: '30%' }}><span className={styles.barLabel}>D</span></div>
          <div className={styles.bar} style={{ height: '40%' }}><span className={styles.barLabel}>S</span></div>
          <div className={styles.bar} style={{ height: '50%' }}><span className={styles.barLabel}>T</span></div>
          <div className={`${styles.bar} ${styles.active}`} style={{ height: '100%' }}><span className={styles.barLabel}>Q</span></div>
          <div className={styles.bar} style={{ height: '80%' }}><span className={styles.barLabel}>Q</span></div>
          <div className={styles.bar} style={{ height: '60%' }}><span className={styles.barLabel}>S</span></div>
          <div className={styles.bar} style={{ height: '20%' }}><span className={styles.barLabel}>S</span></div>
        </div>
      </section>

      <section className={styles.alertsSection} aria-labelledby="alerts-title">
        <div className={styles.alertsHeader}>
          <h3 id="alerts-title" className={styles.alertsTitle}>{t('dashboard.inventoryAlerts')}</h3>
          <button className={styles.viewAll} aria-label="Ver todos os alertas">{t('dashboard.viewAll')}</button>
        </div>
        
        <div className={styles.alertList} role="list">
          {criticalInventory.map(item => (
            <div key={item.id} className={`${styles.alertItem} ${styles.danger}`} role="listitem">
              <AlertTriangle size={24} className={styles.alertIcon} aria-hidden="true" />
              <div className={styles.alertContent}>
                <div className={styles.alertName}>{item.name}</div>
                <div className={styles.alertStatus}>{t('dashboard.criticalStock', { count: item.stock })}</div>
              </div>
              <ChevronRight size={20} color="var(--text-light)" aria-hidden="true" />
            </div>
          ))}

          {belowIdealInventory.map(item => (
            <div key={item.id} className={`${styles.alertItem} ${styles.warning}`} role="listitem">
              <Package size={24} className={styles.alertIcon} aria-hidden="true" />
              <div className={styles.alertContent}>
                <div className={styles.alertName}>{item.name}</div>
                <div className={styles.alertStatus}>{t('dashboard.belowIdeal', { count: item.stock })}</div>
              </div>
              <ChevronRight size={20} color="var(--text-light)" aria-hidden="true" />
            </div>
          ))}

          {criticalInventory.length === 0 && belowIdealInventory.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>Nenhum alerta de estoque!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
