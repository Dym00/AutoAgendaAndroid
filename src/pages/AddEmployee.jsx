import React, { useState, useEffect } from 'react';
import { Briefcase, User, Mail, Phone, CreditCard } from 'lucide-react';
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
    name: '', role: '', email: '', cpf: '', phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const emp = employees.find(e => e.id === parseInt(id));
      if (emp) {
        setFormData({
          name: emp.name,
          role: emp.role,
          email: emp.email,
          cpf: emp.cpf || '',
          phone: emp.phone || ''
        });
      }
    }
  }, [id, employees, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isEditing) {
        updateEmployee(parseInt(id), formData);
      } else {
        addEmployee(formData);
      }
      setLoading(false);
      navigate('/employees');
    }, 600);
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <Input 
            label={t('forms.employeeNameLabel')} 
            id="name" 
            placeholder={t('forms.clientNamePlaceholder')} 
            icon={User} 
            value={formData.name} 
            onChange={handleChange('name')} 
            required 
          />
          
          <Input 
            label={t('forms.roleLabel')} 
            id="role" 
            placeholder={t('forms.rolePlaceholder')} 
            icon={Briefcase} 
            value={formData.role} 
            onChange={handleChange('role')} 
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
          
          <Input 
            label="CPF (Opcional)" 
            id="cpf" 
            placeholder="000.000.000-00" 
            icon={CreditCard} 
            value={formData.cpf} 
            onChange={handleChange('cpf')} 
          />

          <Input 
            label="Telefone (Opcional)" 
            id="phone" 
            placeholder="(00) 00000-0000" 
            icon={Phone} 
            value={formData.phone} 
            onChange={handleChange('phone')} 
          />

          <div className={styles.buttonContainer}>
            <Button type="submit" loading={loading}>
              {loading ? "PROCESSANDO..." : (isEditing ? t('common.save') : t('forms.saveEmployee'))}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEmployee;
