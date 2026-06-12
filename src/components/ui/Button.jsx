import React from 'react';
import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';
import { AccessibleNode } from './AccessibleNode';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  loading = false,
  icon: Icon,
  ariaLabel,
  ...props 
}) => {
  return (
    <AccessibleNode
      as="button"
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      textToSpeak={props.textToSpeak || (typeof children === 'string' ? children : ariaLabel || 'Botão')}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${styles.icon} ${styles.spin}`} size={20} aria-hidden="true" />
      ) : (
        Icon && <Icon className={styles.icon} size={20} aria-hidden="true" />
      )}
      {children}
    </AccessibleNode>
  );
};

export default Button;
