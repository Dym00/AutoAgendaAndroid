import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { AccessibleNode } from './AccessibleNode';
import styles from './Toast.module.css';

const Toast = () => {
  const { toastMessage, hideToast } = useAppContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(hideToast, 300); // Wait for fade out animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, hideToast]);

  if (!toastMessage && !visible) return null;

  const { message, type = 'success' } = toastMessage || {};

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className={styles.iconSuccess} />;
      case 'error': return <AlertCircle size={20} className={styles.iconError} />;
      default: return <Info size={20} className={styles.iconInfo} />;
    }
  };

  return (
    <div className={`${styles.toast} ${visible ? styles.show : styles.hide} ${styles[type]}`}>
      <div className={styles.iconWrapper}>
        {getIcon()}
      </div>
      <div className={styles.message}>{message}</div>
      <AccessibleNode as="button" className={styles.closeButton} onClick={() => setVisible(false)} textToSpeak="Fechar notificação">
        <X size={16} />
      </AccessibleNode>
    </div>
  );
};

export default Toast;
