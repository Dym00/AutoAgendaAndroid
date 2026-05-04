import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, FileText, Lock, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css'; // Reutilizando os estilos do Login

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    workshopName: '', cnpj: '', specialty: '',
    password: '', confirmPassword: ''
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else navigate('/dashboard'); // Finaliza e loga
  };

  return (
    <>
      <TopBar title="AUTOAGENDA" showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <div className={styles.header}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
            PASSO {step} DE 3
          </div>
          <h2 className={styles.title}>Criar nova conta</h2>
          <p className={styles.subtitle}>
            {step === 1 && "Preencha seus dados básicos para começar."}
            {step === 2 && "Precisamos dos dados da sua oficina."}
            {step === 3 && "Crie uma senha segura para finalizar."}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleNext}>
          {step === 1 && (
            <>
              <Input label="NOME COMPLETO" id="name" placeholder="Seu nome completo" icon={User} value={formData.name} onChange={handleChange('name')} required />
              <Input label="E-MAIL" id="email" type="email" placeholder="seu@email.com" icon={Mail} value={formData.email} onChange={handleChange('email')} required />
              <Input label="TELEFONE" id="phone" type="tel" placeholder="(00) 00000-0000" icon={Phone} value={formData.phone} onChange={handleChange('phone')} required />
            </>
          )}

          {step === 2 && (
            <>
              <Input label="NOME DA OFICINA" id="workshopName" placeholder="Ex: Auto Mecânica Silva" icon={Briefcase} value={formData.workshopName} onChange={handleChange('workshopName')} required />
              <Input label="CNPJ" id="cnpj" placeholder="00.000.000/0000-00" icon={FileText} value={formData.cnpj} onChange={handleChange('cnpj')} required />
            </>
          )}

          {step === 3 && (
            <>
              <Input label="SENHA" id="password" type="password" placeholder="Mínimo 8 caracteres" icon={Lock} value={formData.password} onChange={handleChange('password')} required />
              <Input label="CONFIRMAR SENHA" id="confirmPassword" type="password" placeholder="Repita sua senha" icon={Lock} value={formData.confirmPassword} onChange={handleChange('confirmPassword')} required />
            </>
          )}

          {step === 1 && (
            <div className={styles.signupPrompt} style={{ marginTop: '24px' }}>
              Já tem uma conta? <Link to="/login" className={styles.signupLink}>Entrar</Link>
            </div>
          )}
          
          <div className={styles.buttonContainer}>
            <Button type="submit">{step === 3 ? "FINALIZAR CADASTRO" : "CONTINUAR"}</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
