import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
          <button 
            className={styles.iconButton} 
            onClick={handleBack}
            aria-label="Voltar para a tela anterior"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
        )}
        {showProfile && !showBack && (
          <button 
            className={styles.iconButton} 
            onClick={handleProfileClick}
            aria-label="Abrir perfil do usuário"
          >
            <div className={styles.profileAvatar}>
              {/* Fallback to initial if no image */}
              {userName.charAt(0).toUpperCase()}
            </div>
          </button>
        )}
      </div>
      
      <h1 className={styles.title} aria-level="1">{title}</h1>
      
      <div className={styles.right}>
        {showNotifications && (
          <button 
            className={`${styles.iconButton} ${hasUnread ? styles.badge : ''}`}
            onClick={handleNotificationsClick}
            aria-label={hasUnread ? "Notificações, você tem novas mensagens" : "Notificações"}
          >
            <Bell size={24} aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
