import React, { useState } from 'react';
import { Search, SlidersHorizontal, Plus, Edit, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Inventory.module.css';

const Inventory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { inventory, deleteInventoryItem, updateInventoryItem } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [stockModalItem, setStockModalItem] = useState(null);
  const [quickStock, setQuickStock] = useState('');
  const [quickMinStock, setQuickMinStock] = useState('');

  const filteredInventory = inventory.filter(item => {
    const term = searchTerm.toLowerCase();
    const nameMatch = item.name && item.name.toLowerCase().includes(term);
    const catMatch = item.category && item.category.toLowerCase().includes(term);
    const codeMatch = item.code && item.code.toLowerCase().includes(term);
    const searchMatch = nameMatch || catMatch || codeMatch;
    
    const categoryFilterMatch = filterCategory ? item.category === filterCategory : true;
    
    if (filterStatus === 'critical') {
      return searchMatch && categoryFilterMatch && item.critical;
    }
    
    return searchMatch && categoryFilterMatch;
  });

  const totalItems = filteredInventory.length;
  const criticalItems = filteredInventory.filter(i => i.critical).length;

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`} 
          aria-label={t('common.search')}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} aria-hidden="true" />
        </button>
      </div>

      {showFilters && (
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>{t('inventory.filterCategory', 'Filtrar por Categoria')}</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px' }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">{t('inventory.allCategories', 'Todas as categorias')}</option>
              <option value="Óleo">{t('categories.oil', 'Óleo')}</option>
              <option value="Filtro">{t('categories.filter', 'Filtro')}</option>
              <option value="Pneu">{t('categories.tire', 'Pneu')}</option>
              <option value="Bateria">{t('categories.battery', 'Bateria')}</option>
              <option value="Outro">{t('categories.other', 'Outro')}</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>{t('inventory.filterStatus', 'Status do Estoque')}</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '14px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">{t('inventory.allStatus', 'Todos os Itens')}</option>
              <option value="critical">{t('inventory.lowStockItems', 'Itens Esgotando')}</option>
            </select>
          </div>
        </div>
      )}

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
        {filteredInventory.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>{t('common.emptyInventory')}</p>
        ) : filteredInventory.map(item => (
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
              {item.critical ? <SlidersHorizontal size={24} /> : <Package size={24} />}
            </div>
            
            <div className={styles.itemInfo} aria-hidden="true">
              <h4 className={styles.itemName}>{item.name}</h4>
              <span className={styles.itemCategory}>{item.category}</span>
              {item.critical && <span className={styles.criticalWarning}>{t('inventory.lowStockAlert')}</span>}
              <div className={styles.itemFooter}>
                <span className={styles.itemPrice}>{t('inventory.currencyPrefix', { defaultValue: 'R$ ' })}{item.price}</span>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setQuickStock(item.stock); 
                    setQuickMinStock(item.minStock || 0); 
                    setStockModalItem(item); 
                  }}
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                  <Package size={14} /> {item.stock} {t('common.unit')}
                </button>
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
                onClick={() => {
                  if (window.confirm(t('inventory.confirmDelete', 'Deseja realmente excluir este produto/insumo?'))) {
                    deleteInventoryItem(item.id);
                  }
                }}
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

      {stockModalItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} onClick={() => setStockModalItem(null)}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>{t('inventory.quickStockAdjustment', 'Ajuste Rápido de Estoque')}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>{stockModalItem.name}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>{t('inventory.currentStock', 'Quantidade Atual')}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Package size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type="number" 
                      value={quickStock} 
                      onChange={(e) => setQuickStock(e.target.value)}
                      style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '16px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" onClick={() => setQuickStock((parseInt(quickStock || 0) + 1).toString())} style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>+</button>
                    <button type="button" onClick={() => setQuickStock(Math.max(0, parseInt(quickStock || 0) - 1).toString())} style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>-</button>
                  </div>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>{t('inventory.minStock', 'Quantidade Mínima')}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', fontWeight: 'bold' }}>⚠️</span>
                    <input 
                      type="number" 
                      value={quickMinStock} 
                      onChange={(e) => setQuickMinStock(e.target.value)}
                      style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '16px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" onClick={() => setQuickMinStock((parseInt(quickMinStock || 0) + 1).toString())} style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>+</button>
                    <button type="button" onClick={() => setQuickMinStock(Math.max(0, parseInt(quickMinStock || 0) - 1).toString())} style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>-</button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                const updatedItem = { ...stockModalItem, stock: quickStock, minStock: quickMinStock };
                updateInventoryItem(stockModalItem.id, updatedItem);
                setStockModalItem(null);
              }}
              style={{ width: '100%', padding: '16px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'var(--text-main)', fontWeight: '700', border: 'none', cursor: 'pointer' }}
            >
              {t('common.save', 'SALVAR')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
