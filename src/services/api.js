// Configuração base da API (Fetch)
// Spring Boot backend base URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Aqui você pode adicionar lógica para injetar o token JWT do localStorage
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      // Tentar extrair a mensagem de erro da API Spring Boot
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    // Evita tentar fazer parse de JSON em respostas vazias (ex: 204 No Content)
    if (response.status === 204) {
        return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// Exemplos de métodos exportados
export const authService = {
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
};

export const appointmentsService = {
  getToday: () => apiFetch('/appointments/today'),
};
