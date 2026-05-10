import React, { useState } from 'react';
import { Search, Briefcase, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Inventory.module.css';

const Employees = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employees, deleteEmployee } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h2 className={styles.title}>{t('employees.title')}</h2>
        
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

      <div className={styles.list} role="list" aria-label={t('employees.title')}>
        {filteredEmployees.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>{t('common.emptyList', { item: t('employees.item') })}</p>
        ) : filteredEmployees.map(emp => (
          <AccessibleNode 
            as="article"
            key={emp.id} 
            className={styles.itemCard}
            textToSpeak={t('employees.tts_employee', {
              name: emp.name,
              role: emp.role,
              email: emp.email
            })}
          >
            <div className={styles.iconBox} aria-hidden="true">
              <Briefcase size={24} color="var(--primary)" />
            </div>
            
            <div className={styles.itemInfo} aria-hidden="true">
              <h4 className={styles.itemName}>{emp.name}</h4>
              <p className={styles.itemCategory}>{emp.role}</p>
              <div className={styles.itemFooter}>
                <span className={styles.itemPrice} style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>{emp.email}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: 'auto' }}>
              <AccessibleNode 
                as="button"
                onClick={() => navigate(`/employees/edit/${emp.id}`)}
                textToSpeak={t('employees.tts_edit', { name: emp.name })}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', padding: '12px', minWidth: '44px', minHeight: '44px' }}
                aria-label={t('common.edit')}
              >
                <Edit size={20} aria-hidden="true" />
              </AccessibleNode>
              <AccessibleNode 
                as="button"
                onClick={() => deleteEmployee(emp.id)}
                textToSpeak={t('employees.tts_delete', { name: emp.name })}
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
        aria-label={t('employees.addTitle')}
        textToSpeak={t('employees.tts_create')}
        onClick={() => navigate('/employees/add')}
      >
        <Plus size={24} aria-hidden="true" />
      </AccessibleNode>
    </div>
  );
};

export default Employees;
