import axios from 'axios';
import { Capacitor } from '@capacitor/core';

// A URL do backend Spring Boot local
// Em um celular Android físico acessando o computador via Wi-Fi, seria o IP da máquina, ex: http://192.168.x.x:8080/mobile
// No emulador Android do Android Studio, a rede aponta para 10.0.2.2
const getBaseUrl = () => {
  if (Capacitor.getPlatform() === 'android') {
    // 10.0.2.2 é o alias especial do Emulador Android para acessar o localhost do PC host
    return 'http://10.0.2.2:8080/mobile';
  }
  // Para testes no navegador web padrão
  return 'http://localhost:8080/mobile';
};

const api = axios.create({
  baseURL: getBaseUrl(), 
});

api.interceptors.request.use(async (config) => {
  const idOficina = localStorage.getItem('idOficina');
  
  if (idOficina) {
    config.headers['idOficina'] = idOficina;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
