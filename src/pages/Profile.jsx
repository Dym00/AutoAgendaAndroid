import React from 'react';
import { User, Globe, LogOut, Settings, Users, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Login.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAppContext();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <TopBar title={t('profile.title')} showBack={true} />
      <div className={`page-content full-height ${styles.container}`} style={{ alignItems: 'center' }}>
        
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', 
          backgroundColor: 'var(--primary)', color: 'var(--text-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', fontWeight: '700', marginBottom: '16px'
        }}>
          R
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{user ? user.name : t('profile.visitor')}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>{user ? user.email : t('profile.noShop')}</p>

        <div style={{ width: '100%', marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Globe size={16} aria-hidden="true" /> {t('profile.language').toUpperCase()}
          </label>
          <AccessibleNode
            as="select"
            value={i18n.language.substring(0, 2)} 
            onChange={handleLanguageChange}
            textToSpeak={t('profile.tts_language', { lang: i18n.language })}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }}
          >
            <option value="pt">Português (BR)</option>
            <option value="en">English (US)</option>
            <option value="es">Español</option>
          </AccessibleNode>
        </div>

        <div style={{ width: '100%', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AccessibleNode textToSpeak={t('profile.tts_navServices')} onClick={() => navigate('/services')} style={{ display: 'block' }}>
            <Button variant="secondary" icon={Wrench} style={{ justifyContent: 'flex-start', pointerEvents: 'none' }}>
              {t('profile.services')}
            </Button>
          </AccessibleNode>

          <AccessibleNode textToSpeak={t('profile.tts_navEmployees')} onClick={() => navigate('/employees')} style={{ display: 'block' }}>
            <Button variant="secondary" icon={Users} style={{ justifyContent: 'flex-start', pointerEvents: 'none' }}>
              {t('profile.employees')}
            </Button>
          </AccessibleNode>
        </div>

        <div style={{ width: '100%', marginBottom: 'auto' }}>
          <AccessibleNode textToSpeak={t('profile.tts_editShop')} onClick={() => {}} style={{ display: 'block', marginBottom: '16px' }}>
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

export default Profile;
