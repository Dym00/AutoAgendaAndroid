import React, { useState, useEffect } from 'react';
import { Package, Tag, DollarSign, Layers, Barcode, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const AddInventory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { inventory, addInventoryItem, updateInventoryItem } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('common.edit') : t('inventory.tts_create');

  const [formData, setFormData] = useState({
    code: '', itemName: '', category: '', costPrice: '', price: '', stock: '', minStock: ''
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
          costPrice: item.costPrice !== undefined ? item.costPrice.toString() : '',
          price: item.price !== undefined ? item.price.toString() : '',
          stock: item.stock !== undefined ? item.stock.toString() : '0',
          minStock: item.minStock !== undefined ? item.minStock.toString() : '0'
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
      costPrice: formData.costPrice,
      price: formData.price,
      stock: formData.stock,
      minStock: formData.minStock
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
          <Input label={t('forms.categoryLabel')} id="category" placeholder={t('forms.categoryPlaceholder')} icon={Tag} value={formData.category} onChange={handleChange('category')} required />
          <Input label={t('forms.costPriceLabel')} id="costPrice" type="number" step="0.01" placeholder={t('forms.costPricePlaceholder')} icon={DollarSign} value={formData.costPrice} onChange={handleChange('costPrice')} required />
          <Input label={t('forms.priceLabel')} id="price" type="number" step="0.01" placeholder={t('forms.pricePlaceholder')} icon={DollarSign} value={formData.price} onChange={handleChange('price')} required />
          <Input label={t('forms.initialStockLabel')} id="stock" type="number" placeholder="0" icon={Layers} value={formData.stock} onChange={handleChange('stock')} required />
          <Input label={t('forms.minStockLabel')} id="minStock" type="number" placeholder="0" icon={AlertTriangle} value={formData.minStock} onChange={handleChange('minStock')} required />
          
          <div className={styles.buttonContainer}>
            <Button type="submit" loading={loading}>
              {loading ? "PROCESSANDO..." : (isEditing ? t('common.save') : t('forms.savePart'))}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInventory;
