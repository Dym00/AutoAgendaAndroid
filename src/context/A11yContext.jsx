import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

const A11yContext = createContext();

export const A11yProvider = ({ children }) => {
  const [announcement, setAnnouncement] = useState('');
  const [isAccessibleMode, setIsAccessibleMode] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleAccessibleMode = () => {
    setIsAccessibleMode(prev => !prev);
    const newMode = !isAccessibleMode;
    // Traduz a ativação do modo acessível
    speak(newMode ? t('a11y.mode_on', 'Modo de acessibilidade ativado.') : t('a11y.mode_off', 'Modo de acessibilidade desativado.'));
  };

  // Função central para falar
  const speak = useCallback(async (message) => {
    // Mantém o comportamento web/aria-live para testes em navegador
    setAnnouncement(''); 
    setTimeout(() => setAnnouncement(message), 50);

    // Se estiver no celular e o modo estiver ativado, usa a voz nativa do dispositivo
    if (isAccessibleMode && (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios')) {
      try {
        // Mapeia o prefixo do idioma (ex: 'en', 'es', 'pt') para o formato de locutor do TTS
        const langMap = {
          'pt': 'pt-BR',
          'en': 'en-US',
          'es': 'es-ES'
        };
        const currentLang = i18n.language.substring(0, 2);
        const ttsLang = langMap[currentLang] || 'pt-BR';

        await TextToSpeech.speak({
          text: message,
          lang: ttsLang,
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient'
        });
      } catch (e) {
        console.warn("Falha no Text-to-Speech nativo:", e);
      }
    }
  }, [isAccessibleMode]);

  // Anúncio de mudança de tela
  useEffect(() => {
    const routeNames = {
      '/dashboard': 'Painel Principal',
      '/inventory': 'Estoque',
      '/inventory/new': 'Adicionar Peça',
      '/appointments': 'Agendamentos',
      '/appointments/new': 'Novo Agendamento',
      '/clients': 'Clientes',
      '/employees': 'Funcionários',
      '/services': 'Serviços'
    };

    const path = location.pathname;
    let pageName = routeNames[path];
    
    if (!pageName) {
      if (path.includes('edit')) pageName = 'Modo de Edição';
      else if (path.includes('new')) pageName = 'Criação de Novo Registro';
      else pageName = 'Tela Carregada';
    }

    if(isAccessibleMode) {
      speak(`Navegou para: ${pageName}`);
    }
  }, [location.pathname, speak, isAccessibleMode]);

  return (
    <A11yContext.Provider value={{ speak, isAccessibleMode, toggleAccessibleMode }}>
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        style={{ 
          position: 'absolute', 
          width: '1px', 
          height: '1px', 
          padding: 0, 
          margin: '-1px', 
          overflow: 'hidden', 
          clip: 'rect(0, 0, 0, 0)', 
          whiteSpace: 'nowrap', 
          border: 0 
        }}
      >
        {announcement}
      </div>
      {children}
    </A11yContext.Provider>
  );
};

export const useA11y = () => useContext(A11yContext);
