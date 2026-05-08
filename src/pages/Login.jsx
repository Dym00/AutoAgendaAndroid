import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (slug && usuario && password) {
      setLoading(true);
      try {
        const response = await api.post('/funcionario-api/logar', {
          slug,
          usuario,
          senha: password
        });
        
        const funcData = response.data;
        // Salva o idOficina no LocalStorage para os interceptors do Axios
        if (funcData && funcData.oficina && funcData.oficina.idOficina) {
          localStorage.setItem('idOficina', funcData.oficina.idOficina.toString());
        }
        
        login(funcData);
        navigate('/dashboard');
      } catch (err) {
        if (err.response && err.response.data && err.response.data.erro) {
          setError(err.response.data.erro);
        } else {
          setError('Erro de conexão com o servidor. O Spring Boot está rodando?');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOfflineLogin = () => {
    login({ nomeFuncionario: 'Desenvolvedor', acesso: 'admin', isOffline: true });
    navigate('/dashboard');
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
          {error && <div style={{ color: 'var(--danger)', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
          
          <Input
            label="SLUG DA OFICINA"
            id="slug"
            type="text"
            placeholder="Ex: autoagenda-sp"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <Input
            label="USUÁRIO OU E-MAIL"
            id="usuario"
            type="text"
            placeholder={t('login.emailPlaceholder')}
            icon={Mail}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Aguarde...' : t('login.enter')}
            </Button>
            
            <button 
              type="button" 
              onClick={handleOfflineLogin}
              style={{
                marginTop: '16px', background: 'transparent', border: '1px solid var(--border)', 
                color: 'var(--text-secondary)', padding: '12px', borderRadius: '8px', width: '100%'
              }}
            >
              Entrar no Modo de Teste Visual
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
