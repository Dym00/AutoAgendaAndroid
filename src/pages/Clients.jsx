import React, { useState } from 'react';
import { Search, User, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Inventory.module.css';

const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clients, deleteClient } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h2 className={styles.title}>{t('clients.title')}</h2>
        
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            placeholder={t('common.search')} 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className={styles.summaryCards}>
        <div className={`${styles.summaryCard} ${styles.total}`} style={{ width: '100%' }}>
          <span className={styles.summaryCardTitle}>{t('clients.total')}</span>
          <span className={styles.summaryCardValue}>{clients.length}</span>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>{t('clients.recent')}</h3>

      <div className={styles.list} role="list" aria-label={t('clients.title')}>
        {filteredClients.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>{t('common.emptyList', { item: t('clients.item') })}</p>
        ) : filteredClients.map(client => (
          <AccessibleNode 
            as="article"
            key={client.id} 
            className={styles.itemCard}
            textToSpeak={t('clients.tts_client', {
              name: client.name,
              email: client.email,
              phone: client.phone
            })}
          >
            <div className={styles.iconBox} aria-hidden="true">
              <User size={24} color="var(--primary)" />
            </div>
            
            <div className={styles.itemInfo} aria-hidden="true">
              <h4 className={styles.itemName}>{client.name}</h4>
              <p className={styles.itemCategory}>{client.email}</p>
              <div className={styles.itemFooter}>
                <span className={styles.itemPrice}>{client.phone}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: 'auto' }}>
              <AccessibleNode 
                as="button"
                onClick={() => navigate(`/clients/edit/${client.id}`)}
                textToSpeak={t('clients.tts_edit', { name: client.name })}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', padding: '12px', minWidth: '44px', minHeight: '44px' }}
                aria-label={t('common.edit')}
              >
                <Edit size={20} aria-hidden="true" />
              </AccessibleNode>
              <AccessibleNode 
                as="button"
                onClick={() => deleteClient(client.id)}
                textToSpeak={t('clients.tts_delete', { name: client.name })}
                style={{ background: 'none', border: 'none', color: '#ff4444', padding: '12px', minWidth: '44px', minHeight: '44px' }}
                aria-label={t('common.delete')}
              >
                <Trash2 size={20} aria-hidden="true" />
              </AccessibleNode>
            </div>
          </AccessibleNode>
        ))}
      </div>

      <AccessibleNode 
        as="button"
        className={styles.fab} 
        aria-label={t('clients.addTitle')}
        textToSpeak={t('clients.tts_create')}
        onClick={() => navigate('/clients/add')}
      >
        <Plus size={24} aria-hidden="true" />
      </AccessibleNode>
    </div>
  );
};

export default Clients;
