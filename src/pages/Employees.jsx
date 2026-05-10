import React, { useState } from 'react';
import { Search, Briefcase, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
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

      <div className={styles.list} role="list" aria-label="Lista de funcionários">
        {filteredEmployees.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>Nenhum funcionário encontrado.</p>
        ) : filteredEmployees.map(emp => (
          <article 
            key={emp.id} 
            className={styles.itemCard}
            role="listitem"
            tabIndex={0}
            aria-label={`Funcionário: ${emp.name}, Cargo: ${emp.role}, Email: ${emp.email}`}
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
              <button 
                onClick={() => navigate(`/employees/edit/${emp.id}`)}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', padding: '12px', minWidth: '44px', minHeight: '44px' }}
                aria-label={`${t('common.edit')} ${emp.name}`}
              >
                <Edit size={20} aria-hidden="true" />
              </button>
              <button 
                onClick={() => deleteEmployee(emp.id)}
                style={{ background: 'none', border: 'none', color: '#ff4444', padding: '12px', minWidth: '44px', minHeight: '44px' }}
                aria-label={`${t('common.delete')} ${emp.name}`}
              >
                <Trash2 size={20} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <button 
        className={styles.fab} 
        aria-label={t('employees.addTitle')}
        onClick={() => navigate('/employees/add')}
      >
        <Plus size={24} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Employees;
