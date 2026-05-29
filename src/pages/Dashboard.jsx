import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, Activity, AlertTriangle, Package, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, appointments, inventory } = useAppContext();
  const [activeTab, setActiveTab] = useState('appointments');
  const navigate = useNavigate();
  
  const userName = user ? user.name : "Ricardo";
  const today = new Date();
  const day = today.getDate();
  const monthStr = today.toLocaleString('pt-BR', { month: 'long' });
  const capitalizedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
  const todayStr = `${day} de ${capitalizedMonth}`; // Fixo para match com Figma

  const scheduledCount = appointments.length;
  const inServiceCount = appointments.filter(a => a.service.includes('Óleo') || a.service.includes('Revisão')).length || 1; // mock logic adaptada
  const criticalInventory = inventory.filter(i => i.critical);
  const belowIdealInventory = inventory.filter(i => i.stock < 10 && !i.critical);

  const chartData = useMemo(() => {
    if (activeTab === 'appointments') {
      const data = [];
      const labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
      const currentDayOfWeek = today.getDay(); // 0 is Sunday
      
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - currentDayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        const dayStr = String(date.getDate()).padStart(2, '0');
        const monthStrNum = String(date.getMonth() + 1).padStart(2, '0');
        const yearStr = date.getFullYear();
        const dateString = `${dayStr}/${monthStrNum}/${yearStr}`;
        
        const count = appointments.filter(a => a.time === dateString).length;
        
        data.push({
          id: `app-${i}`,
          label: labels[i],
          count,
          isActive: i === currentDayOfWeek
        });
      }
      
      const maxCount = Math.max(...data.map(d => d.count), 1);
      return data.map(d => ({ ...d, height: `${(d.count / maxCount) * 100}%` }));
      
    } else {
      // Tab Estoque (Opção B: Top 7 produtos com menor estoque)
      const sorted = [...inventory].sort((a, b) => a.stock - b.stock);
      const top7 = sorted.slice(0, 7);
      
      const maxStock = Math.max(...top7.map(i => i.stock), 1);
      
      const mapped = top7.map((item, index) => ({
        id: `inv-${item.id}`,
        label: item.name.charAt(0).toUpperCase(),
        count: item.stock,
        isActive: item.critical, // Destaca os que estão em estado crítico
        height: `${(item.stock / maxStock) * 100}%`
      }));

      // Garante que o layout sempre terá 7 colunas para manter a simetria flex-between
      while (mapped.length < 7) {
        mapped.push({
          id: `inv-empty-${mapped.length}`,
          label: '-',
          count: 0,
          isActive: false,
          height: '0%' // minHeight garantirá a visibilidade mínima
        });
      }
      return mapped;
    }
  }, [activeTab, appointments, inventory, today]);

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

      <section className={styles.chartSection} aria-label="Gráfico dinâmico">
        <div className={styles.chartTabs}>
          <button 
            className={`${styles.chartTab} ${activeTab === 'appointments' ? styles.active : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            {t('dashboard.appointmentsTab')}
          </button>
          <button 
            className={`${styles.chartTab} ${activeTab === 'inventory' ? styles.active : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            {t('dashboard.inventoryTab')}
          </button>
        </div>
        <h3 className={styles.chartTitle}>
          {activeTab === 'appointments' ? t('dashboard.weeklyPerformance') : 'Top 7 Produtos Críticos'}
        </h3>
        <div className={styles.mockChart} aria-hidden="true">
          {chartData.map((bar) => (
            <div 
              key={bar.id}
              className={`${styles.bar} ${bar.isActive ? styles.active : ''} ${bar.count === 0 && bar.height === '0%' ? styles.empty : ''}`} 
              style={{ height: bar.height, minHeight: '4px' }}
              title={`Quantidade: ${bar.count}`}
            >
              <span className={styles.barLabel}>{bar.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.alertsSection} aria-labelledby="alerts-title">
        <div className={styles.alertsHeader}>
          <h3 id="alerts-title" className={styles.alertsTitle}>{t('dashboard.inventoryAlerts')}</h3>
          <button className={styles.viewAll} onClick={() => navigate('/inventory')} aria-label="Ver todos os alertas">{t('dashboard.viewAll')}</button>
        </div>
        
        <div className={styles.alertList} role="list">
          {criticalInventory.map(item => (
            <div 
              key={item.id} 
              className={`${styles.alertItem} ${styles.danger}`} 
              role="button" 
              tabIndex={0}
              onClick={() => navigate(`/inventory/edit/${item.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/inventory/edit/${item.id}`); }}
            >
              <AlertTriangle size={24} className={styles.alertIcon} aria-hidden="true" />
              <div className={styles.alertContent}>
                <div className={styles.alertName}>{item.name}</div>
                <div className={styles.alertStatus}>{t('dashboard.criticalStock', { count: item.stock })}</div>
              </div>
              <ChevronRight size={20} color="var(--text-light)" aria-hidden="true" />
            </div>
          ))}

          {belowIdealInventory.map(item => (
            <div 
              key={item.id} 
              className={`${styles.alertItem} ${styles.warning}`} 
              role="button" 
              tabIndex={0}
              onClick={() => navigate(`/inventory/edit/${item.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/inventory/edit/${item.id}`); }}
            >
              <Package size={24} className={styles.alertIcon} aria-hidden="true" />
              <div className={styles.alertContent}>
                <div className={styles.alertName}>{item.name}</div>
                <div className={styles.alertStatus}>{t('dashboard.belowIdeal', { count: item.stock })}</div>
              </div>
              <ChevronRight size={20} color="var(--text-light)" aria-hidden="true" />
            </div>
          ))}

          {criticalInventory.length === 0 && belowIdealInventory.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>{t('dashboard.noAlerts')}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
