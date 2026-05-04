import React, { useState } from 'react';
import { Search, Wrench, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import styles from './Inventory.module.css';

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { services, deleteService } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h2 className={styles.title}>{t('services.title')}</h2>
        
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

      <div className={styles.list} role="list" style={{ marginTop: '24px' }}>
        {filteredServices.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>Nenhum serviço encontrado.</p>
        ) : filteredServices.map(srv => (
          <article 
            key={srv.id} 
            className={styles.itemCard}
          >
            <div className={styles.itemIconContainer}>
              <Wrench size={24} color="var(--primary)" />
            </div>
            
            <div className={styles.itemContent}>
              <h4 className={styles.itemName}>{srv.name}</h4>
              <div className={styles.itemFooter}>
                <span className={styles.itemPrice}>R$ {srv.price}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: 'auto' }}>
              <button 
                onClick={() => navigate(`/services/edit/${srv.id}`)}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', padding: '4px' }}
              >
                <Edit size={20} />
              </button>
              <button 
                onClick={() => deleteService(srv.id)}
                style={{ background: 'none', border: 'none', color: '#ff4444', padding: '4px' }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <button 
        className={styles.fab} 
        aria-label={t('services.addTitle')}
        onClick={() => navigate('/services/add')}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Services;
