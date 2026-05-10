import React from 'react';
import { Search, SlidersHorizontal, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Inventory.module.css';

const Inventory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { inventory, deleteInventoryItem } = useAppContext();
  const totalItems = inventory.length;
  const criticalItems = inventory.filter(i => i.critical).length;

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search size={20} className={styles.searchIcon} aria-hidden="true" />
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder={t('inventory.searchPlaceholder')}
            aria-label={t('inventory.searchPlaceholder')}
          />
        </div>
        <button className={styles.filterButton} aria-label={t('common.search')}>
          <SlidersHorizontal size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.summaryCards}>
        <div className={`${styles.summaryCard} ${styles.total}`}>
          <span className={styles.summaryCardTitle}>{t('inventory.totalItems')}</span>
          <span className={styles.summaryCardValue}>{totalItems}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.critical}`}>
          <span className={styles.summaryCardTitle}>{t('inventory.critical')}</span>
          <span className={styles.summaryCardValue}>0{criticalItems}</span>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>{t('inventory.recentItems')}</h3>

      <div className={styles.list} role="list" aria-label={t('inventory.recentItems')}>
        {inventory.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>{t('common.emptyInventory')}</p>
        ) : inventory.map(item => (
          <AccessibleNode 
            as="article"
            key={item.id} 
            className={`${styles.itemCard} ${item.critical ? styles.critical : ''}`}
            textToSpeak={t('inventory.tts_item', {
              name: item.name,
              price: item.price,
              stock: item.stock,
              critical: item.critical ? t('inventory.lowStockAlert') : ''
            })}
          >
            <div className={styles.iconBox} aria-hidden="true">
              <item.Icon size={24} />
            </div>
            
            <div className={styles.itemInfo} aria-hidden="true">
              <h4 className={styles.itemName}>{item.name}</h4>
              <span className={styles.itemCategory}>{item.category}</span>
              {item.critical && <span className={styles.criticalWarning}>{t('inventory.lowStockAlert')}</span>}
              <div className={styles.itemFooter}>
                <span className={styles.itemPrice}>${item.price}</span>
                <span className={styles.itemStock}>{item.stock} {t('common.unit')}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: 'auto' }}>
              <AccessibleNode 
                as="button"
                onClick={() => navigate(`/inventory/edit/${item.id}`)}
                textToSpeak={t('inventory.tts_edit', { name: item.name })}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', padding: '12px', minWidth: '44px', minHeight: '44px' }}
                aria-label={t('common.edit')}
              >
                <Edit size={20} aria-hidden="true" />
              </AccessibleNode>
              <AccessibleNode 
                as="button"
                onClick={() => deleteInventoryItem(item.id)}
                textToSpeak={t('inventory.tts_delete', { name: item.name })}
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
        textToSpeak={t('inventory.tts_create')}
        aria-label={t('common.add')} 
        onClick={() => navigate('/inventory/new')}
      >
        <Plus size={24} aria-hidden="true" />
      </AccessibleNode>
    </div>
  );
};

export default Inventory;
