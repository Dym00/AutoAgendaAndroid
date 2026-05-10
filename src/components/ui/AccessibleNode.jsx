import React, { useState, useEffect } from 'react';
import { useA11y } from '../../context/A11yContext';

export const AccessibleNode = ({ 
  children, 
  textToSpeak, 
  onClick, 
  className,
  style,
  as: Component = 'div',
  ...props 
}) => {
  const { isAccessibleMode, speak } = useA11y();
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    let timer;
    if (clicks === 1) {
      // O usuário tem 3 segundos para confirmar com o segundo clique
      timer = setTimeout(() => {
        setClicks(0);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [clicks]);

  const handleClick = (e) => {
    if (isAccessibleMode && textToSpeak) {
      if (clicks === 0) {
        e.preventDefault();
        e.stopPropagation();
        speak(textToSpeak + ". Toque duas vezes para confirmar.");
        setClicks(1);
      } else {
        // Segundo clique confirmado
        if (onClick) onClick(e);
        setClicks(0);
      }
    } else {
      // Modo normal, funciona como um botão comum
      if (onClick) onClick(e);
    }
  };

  return (
    <Component 
      onClick={handleClick} 
      className={`${className || ''} ${clicks === 1 ? 'accessibility-focus' : ''}`}
      style={{
        ...style,
        ...(clicks === 1 ? { border: '3px solid var(--primary)' } : {}) // Feedback visual temporário imitando o verde do TalkBack
      }}
      {...props}
    >
      {children}
    </Component>
  );
};
