import React, { useState, useEffect } from 'react';
import { Briefcase, User, Mail, Phone, CreditCard } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { isValidCPF } from '../utils/masks';
import styles from './Login.module.css';

const AddEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, addEmployee, updateEmployee } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('employees.editTitle') : t('employees.addTitle');

  const [formData, setFormData] = useState({
    name: '', role: 'Atendente', email: '', phone: '', cpf: '', usuario: '', senha: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const emp = employees.find(e => e.id === parseInt(id));
      if (emp) {
        setFormData({
          name: emp.name || '',
          role: emp.role || 'Atendente',
          email: emp.email || '',
          phone: emp.phone || '',
          cpf: emp.cpf || '',
          usuario: emp.usuario || '',
          senha: emp.senha || ''
        });
      }
    }
  }, [id, employees, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.cpf && !isValidCPF(formData.cpf)) {
      alert("Por favor, insira um CPF válido.");
      return;
    }
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
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>ACESSO DO FUNCIONÁRIO</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Briefcase size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px' }} />
              <select 
                value={formData.role} 
                onChange={handleChange('role')}
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)' }}
              >
                <option value="Atendente">Atendente</option>
                <option value="Mecânico">Mecânico</option>
                <option value="Gerente">Gerente</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          
          <Input label="USUÁRIO DE LOGIN" id="usuario" icon={User} value={formData.usuario} onChange={handleChange('usuario')} required />
          <Input label="SENHA DE ACESSO" id="senha" type="password" icon={User} value={formData.senha} onChange={handleChange('senha')} required />

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
            maskType="cpf"
            value={formData.cpf} 
            onChange={handleChange('cpf')} 
          />

          <Input 
            label="Telefone (Opcional)" 
            id="phone" 
            placeholder="(00) 00000-0000" 
            icon={Phone} 
            type="tel"
            maskType="phone"
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
