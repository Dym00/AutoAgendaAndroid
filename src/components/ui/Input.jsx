import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { maskPhone, maskCNPJ, maskCPF, maskCurrency, maskPlate } from '../../utils/masks';
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

  const inputRef = useRef(null);

  // Sync prop changes from outside (e.g. data loaded from API)
  // Only update the DOM if the external value differs from what the user is typing
  useEffect(() => {
    if (inputRef.current && props.value !== undefined && props.value !== null) {
      if (inputRef.current.value !== String(props.value)) {
        inputRef.current.value = props.value;
      }
    }
  }, [props.value]);

  const handleChange = (e) => {
    if (props.maskType) {
      let val = e.target.value;
      if (props.maskType === 'phone') {
        val = maskPhone(val);
      } else if (props.maskType === 'cnpj') {
        val = maskCNPJ(val);
      } else if (props.maskType === 'cpf') {
        val = maskCPF(val);
      } else if (props.maskType === 'currency') {
        val = maskCurrency(val);
      } else if (props.maskType === 'plate') {
        val = maskPlate(val);
      }
      e.target.value = val;
    }

    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Extraimos value para nao passar diretamente ao DOM (já que usamos defaultValue)
  const { value, onChange, onCompositionStart, onCompositionEnd, ...restProps } = props;

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
          ref={inputRef}
          id={id}
          type={inputType}
          className={styles.input}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          defaultValue={value || ''}
          onChange={handleChange}
          {...restProps}
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
