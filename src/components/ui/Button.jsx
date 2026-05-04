import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  icon: Icon,
  ariaLabel,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {Icon && <Icon className={styles.icon} size={20} aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
