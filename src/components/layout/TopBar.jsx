import React from 'react';
import { ArrowLeft, Bell, Ear, EarOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useA11y } from '../../context/A11yContext';
import { AccessibleNode } from '../ui/AccessibleNode';
import styles from './TopBar.module.css';

const TopBar = ({ 
  title = "AUTOAGENDA", 
  showBack = false, 
  showProfile = false, 
  showNotifications = false,
  hasUnread = false,
  userName = "User"
}) => {
  const navigate = useNavigate();
  const { isAccessibleMode, toggleAccessibleMode } = useA11y();

  const handleBack = () => {
    navigate(-1);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {showBack && (
          <AccessibleNode 
            as="button"
            className={styles.iconButton} 
            onClick={handleBack}
            textToSpeak="Voltar para a tela anterior"
            aria-label="Voltar para a tela anterior"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </AccessibleNode>
        )}
        {showProfile && !showBack && (
          <AccessibleNode 
            as="button"
            className={styles.iconButton} 
            onClick={handleProfileClick}
            textToSpeak="Abrir perfil do usuário"
            aria-label="Abrir perfil do usuário"
          >
            <div className={styles.profileAvatar} aria-hidden="true">
              {/* Fallback to initial if no image */}
              {userName.charAt(0).toUpperCase()}
            </div>
          </AccessibleNode>
        )}
      </div>
      
      <h1 className={styles.title} aria-level="1">{title}</h1>
      
      <div className={styles.right} style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          className={styles.iconButton}
          onClick={toggleAccessibleMode}
          aria-label={isAccessibleMode ? "Desativar acessibilidade por voz" : "Ativar acessibilidade por voz"}
        >
          {isAccessibleMode ? <Ear size={24} color="var(--primary)" /> : <EarOff size={24} />}
        </button>
        {showNotifications && (
          <AccessibleNode 
            as="button"
            className={`${styles.iconButton} ${hasUnread ? styles.badge : ''}`}
            onClick={handleNotificationsClick}
            textToSpeak={hasUnread ? "Notificações. Você tem novas mensagens." : "Abrir central de notificações."}
            aria-label={hasUnread ? "Notificações, você tem novas mensagens" : "Notificações"}
          >
            <Bell size={24} aria-hidden="true" />
          </AccessibleNode>
        )}
      </div>
    </header>
  );
};

export default TopBar;
