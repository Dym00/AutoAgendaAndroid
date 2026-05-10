import React, { useState, useEffect } from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const AddClient = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clients, addClient, updateClient } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('clients.editTitle') : t('clients.addTitle');

  const [formData, setFormData] = useState({
    name: '', phone: '', email: ''
  });

  useEffect(() => {
    if (isEditing) {
      const client = clients.find(c => c.id === parseInt(id));
      if (client) {
        setFormData({
          name: client.name,
          phone: client.phone,
          email: client.email
        });
      }
    }
  }, [id, clients, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateClient(parseInt(id), formData);
    } else {
      addClient(formData);
    }
    navigate('/clients');
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <Input 
            label={t('forms.fullNameLabel')} 
            id="name" 
            placeholder={t('forms.clientNamePlaceholder')} 
            icon={User} 
            value={formData.name} 
            onChange={handleChange('name')} 
            required 
          />
          
          <Input 
            label={t('forms.phoneLabel')} 
            id="phone" 
            placeholder={t('forms.phonePlaceholder')} 
            icon={Phone} 
            type="tel"
            value={formData.phone} 
            onChange={handleChange('phone')} 
            required 
          />
          
          <Input 
            label={t('forms.emailLabel')} 
            id="email" 
            type="email" 
            placeholder={t('forms.emailPlaceholder')} 
            icon={Mail} 
            value={formData.email} 
            onChange={handleChange('email')} 
            required 
          />
          
          <div className={styles.buttonContainer}>
            <Button type="submit">{t('forms.saveClient')}</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddClient;
