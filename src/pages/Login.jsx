import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAppContext();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      login({ name: 'Ricardo', email, token: 'mock-token-123' });
      navigate('/dashboard');
    }
  };

  return (
    <>
      <TopBar title="AUTOAGENDA" showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('login.title')}</h2>
          <p className={styles.subtitle}>{t('login.subtitle')}</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <Input
            label={t('login.email')}
            id="email"
            type="email"
            placeholder={t('login.emailPlaceholder')}
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t('login.password')}
            id="password"
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="button"
            className={styles.forgotPassword} 
            onClick={() => navigate('/forgot-password')}
          >
            {t('login.forgotPassword')}
          </button>
          
          <div className={styles.signupPrompt}>
            {t('login.noAccount')} <Link to="/register" className={styles.signupLink}>{t('login.createAccount')}</Link>
          </div>
          
          <div className={styles.buttonContainer}>
            <Button type="submit">{t('login.enter')}</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
