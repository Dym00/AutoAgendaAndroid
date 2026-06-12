import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Login.module.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/mobile/funcionario-api/enviar-codigo-reset', { email });
      setStep(2);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(t('forgotPassword.emailNotFound', 'E-mail não encontrado.'));
      } else {
        setError(t('forgotPassword.sendError', 'Ocorreu um erro ao enviar o código. Tente novamente.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCode = async (e) => {
    e.preventDefault();
    if (!codigo) return;
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/mobile/funcionario-api/validar-codigo', { email, codigo });
      setStep(3);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(t('forgotPassword.invalidCode', 'Código inválido ou expirado.'));
      } else {
        setError(t('forgotPassword.validateError', 'Erro na validação do código.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!novaSenha || novaSenha !== confirmaSenha) {
      setError(t('forgotPassword.passwordsNotMatch', 'As senhas não coincidem.'));
      return;
    }
    
    if (novaSenha.length < 6) {
      setError(t('forgotPassword.passwordTooShort', 'A senha deve ter no mínimo 6 caracteres.'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post('/mobile/funcionario-api/redefinir-senha-final', { email, novaSenha });
      setStep(4); // Sucesso
    } catch (err) {
      setError(t('forgotPassword.resetError', 'Ocorreu um erro ao redefinir a senha.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title={t('forgotPassword.title', 'RECUPERAR SENHA')} showBack={true} />
      <div className={`page-content full-height ${styles.container}`} style={{ justifyContent: 'center' }}>
        
        <div className={styles.header}>
          <div className={styles.logo}>AUTOAGENDA</div>
          <h2 className={styles.subtitle}>
            {step === 1 && t('forgotPassword.instructions', 'Informe seu e-mail para recuperar a senha')}
            {step === 2 && t('forgotPassword.codeInstructions', 'Digite o código de 6 dígitos enviado ao seu e-mail')}
            {step === 3 && t('forgotPassword.newPassInstructions', 'Crie sua nova senha de acesso')}
          </h2>
        </div>

        {/* ETAPA 1: SOLICITAR CÓDIGO */}
        {step === 1 && (
          <form className={styles.form} onSubmit={handleSendCode}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={20} className={styles.errorIcon} />
                <span className={styles.errorText}>{error}</span>
              </div>
            )}
            
            <Input 
              label={t('common.email', 'E-MAIL').toUpperCase()}
              id="email"
              type="email"
              placeholder="Ex: mecanica@autoagenda.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" loading={loading} style={{ marginTop: '24px' }}>
              {loading ? t('common.processing', 'PROCESSANDO...') : t('forgotPassword.send', 'ENVIAR CÓDIGO')}
            </Button>
          </form>
        )}

        {/* ETAPA 2: VALIDAR CÓDIGO */}
        {step === 2 && (
          <form className={styles.form} onSubmit={handleValidateCode}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={20} className={styles.errorIcon} />
                <span className={styles.errorText}>{error}</span>
              </div>
            )}
            
            <Input 
              label={t('forgotPassword.codeLabel', 'CÓDIGO DE VERIFICAÇÃO')}
              id="codigo"
              type="text"
              placeholder="000000"
              icon={KeyRound}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              maxLength={6}
              style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
            />

            <Button type="submit" loading={loading} style={{ marginTop: '24px' }}>
              {loading ? t('common.processing', 'PROCESSANDO...') : t('forgotPassword.validate', 'VALIDAR CÓDIGO')}
            </Button>
          </form>
        )}

        {/* ETAPA 3: NOVA SENHA */}
        {step === 3 && (
          <form className={styles.form} onSubmit={handleResetPassword}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={20} className={styles.errorIcon} />
                <span className={styles.errorText}>{error}</span>
              </div>
            )}
            
            <Input 
              label={t('forgotPassword.newPassword', 'NOVA SENHA')}
              id="novaSenha"
              type="password"
              placeholder="******"
              icon={Lock}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />

            <Input 
              label={t('forgotPassword.confirmPassword', 'CONFIRME A NOVA SENHA')}
              id="confirmaSenha"
              type="password"
              placeholder="******"
              icon={Lock}
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              required
            />

            <Button type="submit" loading={loading} style={{ marginTop: '24px' }}>
              {loading ? t('common.processing', 'PROCESSANDO...') : t('forgotPassword.savePassword', 'REDEFINIR SENHA')}
            </Button>
          </form>
        )}

        {/* ETAPA 4: SUCESSO */}
        {step === 4 && (
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', 
              backgroundColor: 'var(--primary)', color: 'var(--text-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px auto'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              {t('forgotPassword.successTitle', 'Senha Redefinida!')}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t('forgotPassword.successDesc', 'Sua senha foi atualizada com sucesso. Você já pode acessar o aplicativo.')}
            </p>
            <Button onClick={() => navigate('/login')} style={{ marginTop: '32px' }}>
              {t('forgotPassword.backToLogin', 'VOLTAR PARA O LOGIN')}
            </Button>
          </div>
        )}

        {step < 4 && (
          <AccessibleNode 
            as="button"
            onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '14px', fontWeight: '600', marginTop: '32px', marginInline: 'auto',
              cursor: 'pointer'
            }}
            textToSpeak={t('a11y.goBack', 'Voltar para a tela anterior')}
          >
            <ArrowLeft size={16} /> {t('forgotPassword.back', 'VOLTAR')}
          </AccessibleNode>
        )}

      </div>
    </>
  );
};

export default ForgotPassword;
