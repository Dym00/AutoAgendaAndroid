import React, { useState, useEffect } from 'react';
import { Briefcase, User, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const AddEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, addEmployee, updateEmployee } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('employees.editTitle') : t('employees.addTitle');

  const [formData, setFormData] = useState({
    name: '', role: '', email: ''
  });

  useEffect(() => {
    if (isEditing) {
      const emp = employees.find(e => e.id === parseInt(id));
      if (emp) {
        setFormData({
          name: emp.name,
          role: emp.role,
          email: emp.email
        });
      }
    }
  }, [id, employees, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateEmployee(parseInt(id), formData);
    } else {
      addEmployee(formData);
    }
    navigate('/employees');
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <Input 
            label={t('common.name').toUpperCase()} 
            id="name" 
            placeholder="Ex: Carlos Mecânico" 
            icon={User} 
            value={formData.name} 
            onChange={handleChange('name')} 
            required 
          />
          
          <Input 
            label={t('common.role').toUpperCase()} 
            id="role" 
            placeholder="Ex: Mecânico" 
            icon={Briefcase} 
            value={formData.role} 
            onChange={handleChange('role')} 
            required 
          />
          
          <Input 
            label={t('common.email').toUpperCase()} 
            id="email" 
            type="email" 
            placeholder="Ex: carlos@oficina.com" 
            icon={Mail} 
            value={formData.email} 
            onChange={handleChange('email')} 
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

export default AddEmployee;
