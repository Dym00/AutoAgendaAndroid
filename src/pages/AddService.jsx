import React, { useState, useEffect } from 'react';
import { Wrench, DollarSign } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const AddService = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { services, addService, updateService } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('services.editTitle') : t('services.addTitle');

  const [formData, setFormData] = useState({
    name: '', price: ''
  });

  useEffect(() => {
    if (isEditing) {
      const srv = services.find(s => s.id === parseInt(id));
      if (srv) {
        setFormData({
          name: srv.name,
          price: srv.price
        });
      }
    }
  }, [id, services, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateService(parseInt(id), formData);
    } else {
      addService(formData);
    }
    navigate('/services');
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <Input 
            label={t('common.name').toUpperCase()} 
            id="name" 
            placeholder="Ex: Troca de Óleo" 
            icon={Wrench} 
            value={formData.name} 
            onChange={handleChange('name')} 
            required 
          />
          
          <Input 
            label={t('common.price').toUpperCase()} 
            id="price" 
            placeholder="Ex: 80,00" 
            icon={DollarSign} 
            value={formData.price} 
            onChange={handleChange('price')} 
            required 
          />
          
          <div className={styles.buttonContainer}>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddService;
