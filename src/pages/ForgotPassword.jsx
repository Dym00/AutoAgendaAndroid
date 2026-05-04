import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      // Aqui integraria com a rota do backend para envio de e-mail de recuperação
    }
  };

  return (
    <>
      <TopBar title={t('forgotPassword.title')} showBack={true} />
      <div className={`page-content full-height ${styles.container}`} style={{ justifyContent: 'center' }}>
        
        <div className={styles.header}>
          <div className={styles.logo}>AUTOAGENDA</div>
          <h2 className={styles.subtitle}>{t('forgotPassword.instructions')}</h2>
        </div>

        {!sent ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input 
              label={t('common.email').toUpperCase()}
              id="email"
              type="email"
              placeholder="Ex: mecanica@autoagenda.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" style={{ marginTop: '24px' }}>
              {t('forgotPassword.send')}
            </Button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', 
              backgroundColor: 'var(--primary)', color: 'var(--text-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px auto'
            }}>
              <Mail size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>E-mail enviado!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Verifique sua caixa de entrada para redefinir a senha.</p>
          </div>
        )}

        <button 
          onClick={() => navigate('/login')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            fontSize: '14px', fontWeight: '600', marginTop: '32px', marginInline: 'auto'
          }}
        >
          <ArrowLeft size={16} /> {t('forgotPassword.back')}
        </button>

      </div>
    </>
  );
};

export default ForgotPassword;
