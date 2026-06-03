import React from 'react';
import { User, Globe, LogOut, Settings, Users, Wrench, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import { AccessibleNode } from '../ui/AccessibleNode';
import styles from './SideMenu.module.css';

const SideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAppContext();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('profile.title')}
      >
        <button className={styles.closeButton} onClick={onClose} aria-label={t('common.close')}>
          <X size={24} />
        </button>

        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: 'var(--primary)', color: 'var(--text-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', fontWeight: '700', marginBottom: '16px',
          marginTop: '24px'
        }}>
          {user ? (user.nomeFuncionario || user.name || 'V').charAt(0).toUpperCase() : 'R'}
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{user ? (user.nomeFuncionario || user.name) : t('profile.visitor')}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>{user ? (user.email || user.login || 'Sem E-mail') : t('profile.noShop')}</p>

        <div style={{ width: '100%', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Globe size={16} aria-hidden="true" /> {t('profile.language').toUpperCase()}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { code: 'pt', flag: '🇧🇷' },
              { code: 'en', flag: '🇺🇸' },
              { code: 'es', flag: '🇪🇸' }
            ].map((lang) => (
              <AccessibleNode
                key={lang.code}
                as="button"
                onClick={() => handleLanguageChange(lang.code)}
                textToSpeak={t('profile.tts_language', { lang: lang.code })}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: '8px',
                  border: i18n.language.startsWith(lang.code) ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: i18n.language.startsWith(lang.code) ? 'rgba(255, 204, 0, 0.1)' : 'var(--surface)',
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '18px' }}>{lang.flag}</span>

              </AccessibleNode>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AccessibleNode textToSpeak={t('profile.tts_navServices')} onClick={() => handleNavigation('/services')} style={{ display: 'block' }}>
            <Button variant="secondary" icon={Wrench} style={{ justifyContent: 'flex-start', pointerEvents: 'none' }}>
              {t('profile.services')}
            </Button>
          </AccessibleNode>

          <AccessibleNode textToSpeak={t('profile.tts_navEmployees')} onClick={() => handleNavigation('/employees')} style={{ display: 'block' }}>
            <Button variant="secondary" icon={Users} style={{ justifyContent: 'flex-start', pointerEvents: 'none' }}>
              {t('profile.employees')}
            </Button>
          </AccessibleNode>
        </div>

        <div style={{ width: '100%', marginBottom: 'auto' }}>
          <AccessibleNode textToSpeak={t('profile.tts_editShop')} onClick={() => { }} style={{ display: 'block', marginBottom: '16px' }}>
            <Button variant="secondary" icon={Settings} style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-main)', pointerEvents: 'none' }}>
              {t('common.edit')} {t('profile.shopData')}
            </Button>
          </AccessibleNode>

          <AccessibleNode textToSpeak={t('profile.tts_logout')} onClick={handleLogout} style={{ display: 'block' }}>
            <Button icon={LogOut} style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', pointerEvents: 'none' }}>
              {t('profile.logout')}
            </Button>
          </AccessibleNode>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
