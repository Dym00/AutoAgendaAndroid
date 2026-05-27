import React from 'react';
import { Loader2 } from 'lucide-react';
import './common.css'; // Importa o CSS recém-criado

const GlobalLoading = () => {
  return (
    <div className="global-loading-overlay">
      <div className="global-loading-card">
        <Loader2 className="global-loading-icon" />
        <p className="global-loading-text">Sincronizando...</p>
      </div>
    </div>
  );
};

export default GlobalLoading;
