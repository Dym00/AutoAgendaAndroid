import React, { useState, useEffect } from 'react';
import { Package, Tag, DollarSign, Layers } from 'lucide-react';
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
  const title = isEditing ? t('common.edit') : "NOVA PEÇA";

  const [formData, setFormData] = useState({
    itemName: '', category: '', price: '', stock: ''
  });

  useEffect(() => {
    if (isEditing) {
      const item = inventory.find(i => i.id === parseInt(id));
      if (item) {
        setFormData({
          itemName: item.name,
          category: item.category,
          price: item.price,
          stock: item.stock.toString()
        });
      }
    }
  }, [id, inventory, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateInventoryItem(parseInt(id), {
        name: formData.itemName,
        category: formData.category,
        price: formData.price,
        stock: parseInt(formData.stock),
        critical: parseInt(formData.stock) < 5
      });
    } else {
      addInventoryItem({
        name: formData.itemName,
        category: formData.category,
        price: formData.price,
        stock: parseInt(formData.stock),
        critical: parseInt(formData.stock) < 5
      });
    }
    navigate('/inventory');
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input label="NOME DA PEÇA" id="name" placeholder="Ex: Pastilha de Freio" icon={Package} value={formData.itemName} onChange={handleChange('itemName')} required />
          <Input label="CATEGORIA" id="category" placeholder="Ex: Freios" icon={Tag} value={formData.category} onChange={handleChange('category')} required />
          <Input label="PREÇO (R$)" id="price" type="number" step="0.01" placeholder="0.00" icon={DollarSign} value={formData.price} onChange={handleChange('price')} required />
          <Input label="QUANTIDADE INICIAL" id="stock" type="number" placeholder="0" icon={Layers} value={formData.stock} onChange={handleChange('stock')} required />
          
          <div className={styles.buttonContainer}>
            <Button type="submit">CADASTRAR PEÇA</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInventory;
