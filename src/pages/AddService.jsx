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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setTimeout(() => {
      if (isEditing) {
        updateService(parseInt(id), formData);
      } else {
        addService(formData);
      }
      setLoading(false);
      navigate('/services');
    }, 600);
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <Input 
            label={t('forms.serviceNameLabel')} 
            id="name" 
            placeholder={t('forms.serviceNamePlaceholder')} 
            icon={Wrench} 
            value={formData.name} 
            onChange={handleChange('name')} 
            required 
          />
          
          <Input 
            label={t('forms.priceLabel')} 
            id="price" 
            placeholder={t('forms.pricePlaceholder')} 
            icon={DollarSign} 
            value={formData.price} 
            onChange={handleChange('price')} 
            required 
          />
          
          <div className={styles.buttonContainer}>
            <Button type="submit" loading={loading}>
              {loading ? "PROCESSANDO..." : (isEditing ? t('common.save') : t('forms.saveService'))}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddService;
