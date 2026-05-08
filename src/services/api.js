import axios from 'axios';

// A URL do backend Spring Boot local
// Em um celular Android físico acessando o computador via Wi-Fi, seria o IP da máquina, ex: http://192.168.x.x:8080/mobile
// No emulador Android, seria http://10.0.2.2:8080/mobile
// Por enquanto vamos usar localhost
const api = axios.create({
  baseURL: 'http://localhost:8080/mobile', 
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
