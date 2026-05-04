import React from 'react';
import { Search, SlidersHorizontal, Package, Droplets, Zap, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './Inventory.module.css';

const Inventory = () => {
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
            placeholder="Buscar por peça, marca ou código..."
            aria-label="Buscar peça no estoque"
          />
        </div>
        <button className={styles.filterButton} aria-label="Filtrar resultados">
          <SlidersHorizontal size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.summaryCards}>
        <div className={`${styles.summaryCard} ${styles.total}`}>
          <span className={styles.summaryCardTitle}>ITENS TOTAIS</span>
          <span className={styles.summaryCardValue}>{totalItems}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.critical}`}>
          <span className={styles.summaryCardTitle}>CRÍTICOS</span>
          <span className={styles.summaryCardValue}>0{criticalItems}</span>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Itens Recentes</h3>

      <div className={styles.list} role="list" aria-label="Lista de itens em estoque">
        {inventory.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0'}}>Estoque vazio.</p>
        ) : inventory.map(item => (
          <article 
            key={item.id} 
            className={`${styles.itemCard} ${item.critical ? styles.critical : ''}`}
            role="listitem"
            tabIndex={0}
            aria-label={`${item.name}, Preço R$ ${item.price}, Estoque ${item.stock}. ${item.critical ? 'Estoque Crítico' : ''}`}
          >
            <div className={styles.iconBox} aria-hidden="true">
              <item.Icon size={24} />
            </div>
            
            <div className={styles.itemInfo}>
              <h4 className={styles.itemName}>{item.name}</h4>
              <span className={styles.itemCategory}>{item.category}</span>
              {item.critical && <span className={styles.criticalWarning}>Alerta de Estoque Baixo</span>}
              <div className={styles.itemFooter}>
                <span className={styles.itemPrice}>R$ {item.price}</span>
                <span className={styles.itemStock}>{item.stock} un</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: 'auto' }}>
              <button 
                onClick={() => navigate(`/inventory/edit/${item.id}`)}
                style={{ background: 'none', border: 'none', color: 'var(--text-light)', padding: '4px' }}
              >
                <Edit size={20} />
              </button>
              <button 
                onClick={() => deleteInventoryItem(item.id)}
                style={{ background: 'none', border: 'none', color: '#ff4444', padding: '4px' }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <button className={styles.fab} aria-label="Adicionar nova peça ao estoque" onClick={() => navigate('/inventory/new')}>
        <Plus size={24} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Inventory;
