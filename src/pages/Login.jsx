import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, User } from 'lucide-react';
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
  const [savedUser, setSavedUser] = useState(() => {
    try {
      const saved = localStorage.getItem('@AutoAgenda:savedUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { login } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (slug && usuario && password) {
      setLoading(true);
      try {
        const fetchUrl = `${api.defaults.baseURL}/funcionario-api/logar`;
        const response = await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            slug,
            usuario,
            senha: password
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw { response: { status: response.status, data: errorData } };
        }
        
        const funcData = await response.json();
        
        // Salva o idOficina no LocalStorage para os interceptors do Axios
        if (funcData && funcData.oficina && funcData.oficina.idOficina) {
          localStorage.setItem('idOficina', funcData.oficina.idOficina.toString());
        }
        
        login(funcData);
        navigate('/dashboard');
      } catch (err) {
        let errorDetails = "Erro desconhecido";
        if (err.response) {
          if (err.response.data && err.response.data.erro) {
            errorDetails = err.response.data.erro;
          } else {
            errorDetails = `HTTP ${err.response.status}: ${JSON.stringify(err.response.data).substring(0, 100)}`;
          }
        } else if (err.request) {
          errorDetails = `Sem resposta do servidor (Timeout ou CORS). URL: ${api.defaults.baseURL}`;
        } else {
          errorDetails = err.message;
        }
        let displayError = errorDetails;
        
        // Mapeamento de erros humanizados para o front-end
        if (errorDetails.includes("desativada no sistema")) {
          displayError = "Não encontramos nenhuma oficina com esse nome ou ela está desativada. Verifique a digitação.";
        } else if (errorDetails.includes("OFICINA_INVALIDA")) {
          displayError = "Oficina não encontrada ou slug inválido. Verifique a digitação.";
        } else if (errorDetails.includes("Usuário ou senha incorretos")) {
          displayError = "E-mail, usuário ou senha incorretos.";
        } else if (errorDetails.includes("Failed to connect") || errorDetails.includes("Network Error")) {
          displayError = "Não foi possível conectar ao servidor. O sistema pode estar offline ou em manutenção.";
        } else if (err.request && !err.response) {
          displayError = "Sem resposta do servidor. Verifique sua conexão com a internet.";
        }
        
        setError(displayError);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOfflineLogin = () => {
    login({ nomeFuncionario: 'Desenvolvedor', acesso: 'admin', isOffline: true });
    navigate('/dashboard');
  };

  const handleQuickLogin = () => {
    if (savedUser) {
      setLoading(true);
      // Simula um pequeno delay para a UX do "Entrando..."
      setTimeout(() => {
        login(savedUser);
        navigate('/dashboard');
      }, 600);
    }
  };

  const handleClearSavedUser = () => {
    localStorage.removeItem('@AutoAgenda:savedUser');
    setSavedUser(null);
  };

  return (
    <>
      <TopBar title="AUTOAGENDA" showBack={false} />
      <div className={`page-content full-height ${styles.container}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('login.title')}</h2>
          <p className={styles.subtitle}>{t('login.subtitle')}</p>
        </div>

        {savedUser ? (
          <div className={styles.quickLoginCard}>
            <div className={styles.avatarCircle}>
              {savedUser.nomeFuncionario ? savedUser.nomeFuncionario.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className={styles.welcomeBackText}>Bem-vindo(a) de volta</div>
            <div className={styles.savedUserName}>{savedUser.nomeFuncionario || savedUser.name || 'Usuário'}</div>
            
            <button 
              type="button" 
              className={styles.quickLoginBtn}
              onClick={handleQuickLogin}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button 
              type="button" 
              className={styles.otherAccountBtn}
              onClick={handleClearSavedUser}
            >
              Entrar com outra conta
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleLogin}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={20} className={styles.errorIcon} />
                <span className={styles.errorText}>{error}</span>
              </div>
            )}
            
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
              placeholder="Digite seu usuário ou e-mail"
              icon={User}
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
              <Button type="submit" loading={loading}>
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
        )}
      </div>
    </>
  );
};

export default Login;
