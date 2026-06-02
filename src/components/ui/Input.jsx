import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

const Input = ({
  label,
  id,
  type = 'text',
  icon: Icon,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const [internalValue, setInternalValue] = useState(props.value || '');
  const isComposing = useRef(false);

  useEffect(() => {
    if (!isComposing.current && props.value !== undefined) {
      setInternalValue(props.value);
    }
  }, [props.value]);

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e) => {
    isComposing.current = false;
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    if (!isComposing.current && props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.iconLeft} size={20} aria-hidden="true" />}
        <input
          id={id}
          type={inputType}
          className={styles.input}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
          value={internalValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.iconRight}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
