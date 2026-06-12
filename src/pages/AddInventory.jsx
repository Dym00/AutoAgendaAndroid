import React, { useState, useEffect } from 'react';
import { Package, Tag, DollarSign, Layers, Barcode, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { maskCurrency, unmaskCurrency } from '../utils/masks';
import styles from './Login.module.css';

const AddInventory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { inventory, addInventoryItem, updateInventoryItem } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('common.edit') : t('inventory.tts_create');

  const [formData, setFormData] = useState({
    code: '', itemName: '', category: '', costPrice: '', price: '', stock: '', minStock: '', fornecedor: '', descricao: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const item = inventory.find(i => i.id === parseInt(id));
      if (item) {
        setFormData({
          code: item.code || '',
          itemName: item.name || '',
          category: item.category || '',
          costPrice: item.costPrice !== undefined ? maskCurrency(Number(item.costPrice).toFixed(2)) : '',
          price: item.price !== undefined ? maskCurrency(Number(item.price).toFixed(2)) : '',
          stock: item.stock !== undefined ? item.stock.toString() : '0',
          minStock: item.minStock !== undefined ? item.minStock.toString() : '0',
          fornecedor: item.fornecedor || '',
          descricao: item.descricao || ''
        });
      }
    }
  }, [id, inventory, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const itemData = {
      code: formData.code,
      name: formData.itemName,
      category: formData.category,
      costPrice: unmaskCurrency(formData.costPrice),
      price: unmaskCurrency(formData.price),
      stock: formData.stock,
      minStock: formData.minStock,
      fornecedor: formData.fornecedor,
      descricao: formData.descricao
    };

    setTimeout(() => {
      if (isEditing) {
        updateInventoryItem(parseInt(id), itemData);
      } else {
        addInventoryItem(itemData);
      }
      setLoading(false);
      navigate('/inventory');
    }, 600);
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input label={t('forms.lotCodeLabel')} id="code" placeholder={t('forms.lotCodePlaceholder')} icon={Barcode} value={formData.code} onChange={handleChange('code')} />
          <Input label={t('forms.partNameLabel')} id="name" placeholder={t('forms.partNamePlaceholder')} icon={Package} value={formData.itemName} onChange={handleChange('itemName')} required />
          <Input label={t('forms.providerLabel', 'FORNECEDOR')} id="fornecedor" placeholder={t('forms.providerPlaceholder', 'Nome do Fornecedor')} icon={Package} value={formData.fornecedor} onChange={handleChange('fornecedor')} />
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('forms.categoryLabel')} *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Tag size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px' }} />
              <select
                value={formData.category} onChange={handleChange('category')} required
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: formData.category ? 'var(--text-main)' : 'var(--text-secondary)', fontSize: '16px', fontFamily: 'inherit' }}>
                <option value="" disabled>{t('forms.select', 'Selecione')}</option>
                <option value="Óleo">{t('forms.categoryOil', 'Óleo')}</option>
                <option value="Filtro">{t('forms.categoryFilter', 'Filtro')}</option>
                <option value="Pneu">{t('forms.categoryTire', 'Pneu')}</option>
                <option value="Bateria">{t('forms.categoryBattery', 'Bateria')}</option>
                <option value="Outro">{t('forms.categoryOther', 'Outro')}</option>
              </select>
            </div>
          </div>
          <Input label={t('forms.costPriceLabel')} id="costPrice" type="tel" placeholder={t('forms.costPricePlaceholder')} icon={DollarSign} maskType="currency" value={formData.costPrice} onChange={handleChange('costPrice')} required />
          <Input label={t('forms.priceLabel')} id="price" type="tel" placeholder={t('forms.pricePlaceholder')} icon={DollarSign} maskType="currency" value={formData.price} onChange={handleChange('price')} required />
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('forms.initialStockLabel', 'ESTOQUE INICIAL')} *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Layers size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  id="stock"
                  type="number" 
                  placeholder="0"
                  value={formData.stock} 
                  onChange={handleChange('stock')}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '16px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <AccessibleNode as="button" textToSpeak={t('a11y.incrementStock', 'Aumentar estoque atual em um')} type="button" onClick={() => setFormData({...formData, stock: (parseInt(formData.stock || 0) + 1).toString()})} style={{ width: '56px', height: '56px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>+</AccessibleNode>
                <AccessibleNode as="button" textToSpeak={t('a11y.decrementStock', 'Diminuir estoque atual em um')} type="button" onClick={() => setFormData({...formData, stock: Math.max(0, parseInt(formData.stock || 0) - 1).toString()})} style={{ width: '56px', height: '56px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>-</AccessibleNode>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('forms.minStockLabel', 'ESTOQUE MÍNIMO (CRÍTICO)')} *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <AlertTriangle size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  id="minStock"
                  type="number" 
                  placeholder="0"
                  value={formData.minStock} 
                  onChange={handleChange('minStock')}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '16px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <AccessibleNode as="button" textToSpeak={t('a11y.incrementMinStock', 'Aumentar estoque mínimo em um')} type="button" onClick={() => setFormData({...formData, minStock: (parseInt(formData.minStock || 0) + 1).toString()})} style={{ width: '56px', height: '56px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>+</AccessibleNode>
                <AccessibleNode as="button" textToSpeak={t('a11y.decrementMinStock', 'Diminuir estoque mínimo em um')} type="button" onClick={() => setFormData({...formData, minStock: Math.max(0, parseInt(formData.minStock || 0) - 1).toString()})} style={{ width: '56px', height: '56px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>-</AccessibleNode>
              </div>
            </div>
          </div>
          <Input label={t('forms.detailedDescription', 'DESCRIÇÃO DETALHADA')} id="descricao" placeholder={t('forms.additionalInfo', 'Informações adicionais do produto')} icon={Tag} value={formData.descricao} onChange={handleChange('descricao')} />
          
          <div className={styles.buttonContainer}>
            <Button type="submit" loading={loading}>
              {loading ? t('common.processing', 'PROCESSANDO...') : (isEditing ? t('common.save') : t('forms.savePart'))}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInventory;
