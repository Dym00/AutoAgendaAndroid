import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Wrench, Edit, Trash2, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import Input from '../components/ui/Input';
import styles from './Appointments.module.css';

const Appointments = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { appointments, deleteAppointment, concludeAppointment, services, clients } = useAppContext();
  const [activeTab, setActiveTab] = useState('ativos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Novos estados para o Painel Rápido de Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [expandedCardId, setExpandedCardId] = useState(null);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeTab === 'ativos') setActiveTab('historico');
    if (isRightSwipe && activeTab === 'historico') setActiveTab('ativos');
  };
  
  const today = new Date();
  const dateStr = today.toLocaleString(i18n.language, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).replace(/^\w/, (c) => c.toUpperCase());

  const getStatusColor = (status) => {
    switch(status) {
      case 'Agendado': return '#3498db';
      case 'Confirmado': return '#9b59b6';
      case 'Em Andamento': return '#FF9800';
      case 'Concluído': return '#4CAF50';
      case 'Cancelado': return '#F44336';
      case 'Cancelado': return '#F44336';
      case 'Pendente':
      default: return '#6c757d';
    }
  };

  const getTranslatedStatus = (status) => {
    switch(status) {
      case 'Pendente': return t('status.pending', 'Pendente');
      case 'Agendado': return t('status.scheduled', 'Agendado');
      case 'Confirmado': return t('status.confirmed', 'Confirmado');
      case 'Em Andamento': return t('status.inProgress', 'Em Andamento');
      case 'Concluído': return t('status.finished', 'Concluído');
      case 'Cancelado': return t('status.canceled', 'Cancelado');
      default: return status;
    }
  };

  const currentAppointments = appointments.filter(a => {
    const st = a.status ? a.status.toLowerCase() : '';
    const isConcluded = st === 'concluído' || st === 'concluido' || st === 'cancelado';
    if (activeTab === 'ativos') return !isConcluded;
    return isConcluded;
  });

  const filteredAppointments = currentAppointments.filter(a => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (a.name && a.name.toLowerCase().includes(term)) ||
           (a.car && a.car.toLowerCase().includes(term)) ||
           (a.service && a.service.toLowerCase().includes(term));
           
    const matchDate = filterDate ? (a.rawDate === filterDate) : true;
    const matchService = filterService ? (a.service && a.service.includes(filterService)) : true;
    const matchStatus = filterStatus ? (a.status && a.status.toLowerCase() === filterStatus.toLowerCase()) : true;
    
    return matchSearch && matchDate && matchService && matchStatus;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Hoje &bull; {dateStr}
        </h1>
        <p className={styles.subtitle}>{t('appointments.title')}</p>
      </div>

      <div className={styles.tabsContainer} role="tablist">
        <button 
          role="tab" 
          aria-selected={activeTab === 'ativos'}
          className={`${styles.tab} ${activeTab === 'ativos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('ativos')}
        >
          {t('appointments.open', 'Em Aberto')}
        </button>
        <button 
          role="tab" 
          aria-selected={activeTab === 'historico'}
          className={`${styles.tab} ${activeTab === 'historico' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('historico')}
        >
          {t('appointments.history', 'Histórico')}
        </button>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search size={20} className={styles.searchIcon} aria-hidden="true" />
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder={t('appointments.searchPlaceholder', 'Buscar cliente, veículo ou placa...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`} 
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Filtros avançados"
        >
          <SlidersHorizontal size={20} aria-hidden="true" />
        </button>
      </div>

      {showFilters && (
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('appointments.filterDate', 'Filtrar por Data')}</label>
            <input 
              type="date" 
              className={styles.filterInput}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('appointments.filterService', 'Filtrar por Serviço')}</label>
            <select 
              className={styles.filterInput}
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
            >
              <option value="">{t('appointments.allServices', 'Todos os serviços')}</option>
              {services.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('appointments.filterStatus', 'Filtrar por Status')}</label>
            <select 
              className={styles.filterInput}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">{t('appointments.allStatus', 'Todos os status')}</option>
              {activeTab === 'ativos' && (
                <>
                  <option value="Pendente">{t('status.pending', 'Pendente')}</option>
                  <option value="Agendado">{t('status.scheduled', 'Agendado')}</option>
                  <option value="Confirmado">{t('status.confirmed', 'Confirmado')}</option>
                  <option value="Em Andamento">{t('status.inProgress', 'Em Andamento')}</option>
                </>
              )}
              {activeTab === 'historico' && (
                <>
                  <option value="Concluído">{t('status.finished', 'Concluído')}</option>
                  <option value="Cancelado">{t('status.canceled', 'Cancelado')}</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}

      <div 
        className={styles.list}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {filteredAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            <p>{t('common.emptyAppointments', 'Nenhum agendamento encontrado.')}</p>
          </div>
        ) : (
          filteredAppointments.map(app => (
          <AccessibleNode 
            as="article"
            key={app.id} 
            className={`${styles.card} ${activeTab === 'historico' ? styles.cardHistorico : ''}`}
            style={{ borderLeftColor: getStatusColor(app.status) }}
            textToSpeak={t('appointments.tts_appointment', {
              name: app.name,
              time: app.time,
              car: app.car,
              service: app.service,
              isNew: app.isNew ? t('appointments.newCustomer') : ''
            })}
          >
            <div aria-hidden="true" onClick={() => setExpandedCardId(expandedCardId === app.id ? null : app.id)}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className={styles.clientName}>{app.name}</div>
                  {app.status && (
                    <div>
                      <span className={`${styles.statusBadge} ${
                        app.status === 'Pendente' ? styles.statusPendente :
                        app.status === 'Agendado' ? styles.statusAgendado :
                        app.status === 'Confirmado' ? styles.statusConfirmado :
                        app.status === 'Em Andamento' ? styles.statusEmAndamento :
                        app.status === 'Concluído' ? styles.statusConcluido :
                        app.status === 'Cancelado' ? styles.statusCancelado : styles.statusPendente
                      }`}>
                        {getTranslatedStatus(app.status)}
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.time}>{app.time}</div>
              </div>
              
              <div className={styles.carInfo}>
                <Car size={16} />
                <span>{t('appointments.vehicle', 'Veículo')}: {app.car}</span>
              </div>
              <div className={styles.serviceInfo}>
                <Wrench size={16} style={{flexShrink: 0}} />
                <span>{t('appointments.service')}: {app.service}</span>
              </div>
              
              {expandedCardId === app.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(() => {
                    const client = clients.find(c => c.id === app.idCliente || c.name === app.name);
                    return (
                      <>
                        {client && <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📞 {client.phone || t('common.none', 'Sem telefone')}</div>}
                        {client && <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>✉️ {client.email || t('common.none', 'Sem e-mail')}</div>}
                      </>
                    );
                  })()}
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <strong>Obs:</strong> {app.observacao || t('common.none', 'Nenhuma observação informada.')}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              {activeTab === 'ativos' && app.status?.toLowerCase() !== 'concluido' && app.status?.toLowerCase() !== 'concluído' && app.status?.toLowerCase() !== 'cancelado' && (
                <>
                  <AccessibleNode 
                    as="button"
                    onClick={() => {
                      if (window.confirm(t('appointments.confirmFinish', 'Deseja marcar este agendamento como concluído?'))) {
                        concludeAppointment(app.id);
                      }
                    }}
                    textToSpeak={t('appointments.tts_finish', { name: app.name })}
                    style={{ background: 'none', border: 'none', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '44px', minHeight: '44px', cursor: 'pointer', fontWeight: '600' }}
                    aria-label="Concluir agendamento"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    {t('common.finish', 'CONCLUIR')}
                  </AccessibleNode>
                  <AccessibleNode 
                    as="button"
                    onClick={() => navigate(`/appointments/edit/${app.id}`)}
                    textToSpeak={t('appointments.tts_edit', { name: app.name })}
                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '44px', minHeight: '44px', cursor: 'pointer', fontWeight: '600' }}
                    aria-label={t('common.edit')}
                  >
                    <Edit size={20} aria-hidden="true" /> {t('common.edit')}
                  </AccessibleNode>
                </>
              )}
              <AccessibleNode 
                as="button"
                onClick={() => {
                  if (window.confirm(t('appointments.confirmDelete', 'Deseja realmente excluir este agendamento?'))) {
                    deleteAppointment(app.id);
                  }
                }}
                textToSpeak={t('appointments.tts_delete', { name: app.name })}
                style={{ background: 'none', border: 'none', color: '#ff4444', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '44px', minHeight: '44px', cursor: 'pointer', fontWeight: '600' }}
                aria-label={t('common.delete')}
              >
                <Trash2 size={20} aria-hidden="true" /> {t('common.delete')}
              </AccessibleNode>
            </div>
          </AccessibleNode>
          ))
        )}
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
