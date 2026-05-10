import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const A11yContext = createContext();

export const A11yProvider = ({ children }) => {
  const [announcement, setAnnouncement] = useState('');
  const location = useLocation();

  // Função para anunciar mensagens para o leitor de tela (ex: "Salvo com sucesso")
  const announce = useCallback((message) => {
    setAnnouncement(''); // Força a re-renderização mesmo se a mensagem for igual
    setTimeout(() => setAnnouncement(message), 50);
  }, []);

  // Quando a rota muda, anuncia para o leitor de tela
  useEffect(() => {
    // Mapeamento simples de rotas para português claro
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

    // Pega o base path. Ex: /inventory/edit/1 -> /inventory
    const path = location.pathname;
    let pageName = routeNames[path];
    
    if (!pageName) {
      if (path.includes('edit')) pageName = 'Modo de Edição';
      else if (path.includes('new')) pageName = 'Criação de Novo Registro';
      else pageName = 'Tela Carregada';
    }

    announce(`Navegou para: ${pageName}`);
  }, [location.pathname, announce]);

  return (
    <A11yContext.Provider value={{ announce }}>
      {/* Container invisível para o leitor de telas (Aria-Live) */}
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
