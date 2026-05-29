import React, { createContext, useState, useContext, useEffect } from 'react';
import { Package, SlidersHorizontal, Droplets, Zap, User, Wrench, Briefcase } from 'lucide-react';
import api from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (user && user.isOffline) {
      // Injeta dados falsos para Teste Visual
      setClients([{ id: 1, name: 'João (Teste)', phone: '(11) 9999-9999', email: 'teste@email.com' }]);
      setEmployees([{ id: 1, name: 'Desenvolvedor', role: 'Gerente', email: 'dev@autoagenda.com' }]);
      setServices([{ id: 1, name: 'Troca de Óleo', price: '80,00' }]);
      setInventory([{ id: 1, name: 'Filtro (Teste)', category: 'Peças', price: '45,00', stock: 10, critical: false, Icon: Package }]);
      setAppointments([{ id: 1, name: 'João (Teste)', time: '14:30', car: 'Onix 2022', service: 'Troca de Óleo', isNew: true }]);
      return;
    }

    try {
       // Carregamento paralelo de todas as APIs
       const [cliRes, empRes, prodRes, servRes, agenRes] = await Promise.all([
          api.get('/cliente-api'),
          api.get('/funcionario-api'),
          api.get('/produto-api'),
          api.get('/servico-api').catch(() => ({ data: [] })), // Fallback se não existir
          api.get('/agendamento-api')
       ]);

       if (cliRes.data) {
         setClients(cliRes.data.map(c => ({
           id: c.idCliente, name: c.nomeCliente, phone: c.telefone, email: c.email, veiculos: c.veiculos || []
         })));
       }

       if (empRes.data) {
         setEmployees(empRes.data.map(e => ({
           id: e.idFuncionario, name: e.nomeFuncionario, role: e.acesso === 'admin' ? 'Gerente' : 'Mecânico', email: e.email
         })));
       }

       if (prodRes.data) {
         setInventory(prodRes.data.map(p => {
           const minStockVal = p.estoqueMinimo !== undefined ? p.estoqueMinimo : (p.estoqueMinino || 5);
           return {
             id: p.idProduto, 
             code: p.codigoProduto || '',
             name: p.nomeProduto, 
             category: p.categoria, 
             costPrice: p.precoCusto || 0,
             price: p.precoVenda, 
             stock: p.estoqueAtual, 
             minStock: minStockVal,
             critical: p.estoqueAtual <= minStockVal, 
             Icon: p.estoqueAtual <= minStockVal ? SlidersHorizontal : Package
           };
         }));
       }
       
       let servicesList = [];
       if (servRes.data) {
         servicesList = servRes.data.map(s => ({
           id: s.idServico, name: s.nomeServico, price: s.descServico // Usando descServico como fallback para preço caso não tenha
         }));
         setServices(servicesList);
       }

       if (agenRes.data) {
         setAppointments(agenRes.data.map(a => ({
           id: a.idAgendamento, 
           name: a.cliente?.nomeCliente || 'Desconhecido', 
           time: a.dataPrevisao ? (() => {
             const parts = a.dataPrevisao.split('-');
             if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
             return a.dataPrevisao;
           })() : 'Sem data', 
           car: a.veiculo?.modelo || 'Não informado', 
           service: a.servicos?.map(s => {
             const matched = servicesList.find(svc => svc.id === s.idServico);
             return matched ? matched.name : s.descricao || 'Serviço';
           }).join(', ') || 'Nenhum', 
           isNew: a.statusAgendamento === 'Pendente' || a.statusAgendamento === 'Agendado'
         })));
       }

    } catch(err) {
       console.error("Erro ao carregar dados das APIs:", err);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('idOficina');
  };

  // ----- CRUD Agendamentos -----
  const addAppointment = async (appointmentData) => {
    try {
      const formData = new FormData();
      // O Spring Boot espera @RequestPart("agendamento") como JSON blob
      formData.append('agendamento', new Blob([JSON.stringify({
        dataPrevisao: appointmentData.date ? appointmentData.date.split('T')[0] : null,
        statusAgendamento: 'Agendado',
        funcionario: user && user.idFuncionario ? { idFuncionario: user.idFuncionario } : null
      })], { type: "application/json" }));
      
      formData.append('idCliente', appointmentData.clientName);
      formData.append('idVeiculo', appointmentData.carModel);
      if (Array.isArray(appointmentData.service)) {
        appointmentData.service.forEach(svcId => formData.append('idServicos', svcId));
      } else {
        formData.append('idServicos', appointmentData.service);
      }

      await api.post('/agendamento-api', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      loadData(); // Recarrega do servidor
    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
    }
  };

  const updateAppointment = async (id, appointmentData) => {
    try {
      const formData = new FormData();
      formData.append('agendamento', new Blob([JSON.stringify({
        idAgendamento: id,
        dataPrevisao: appointmentData.date ? appointmentData.date.split('T')[0] : null,
        statusAgendamento: appointmentData.status || 'Atualizado',
        funcionario: user && user.idFuncionario ? { idFuncionario: user.idFuncionario } : null
      })], { type: "application/json" }));
      
      formData.append('idCliente', appointmentData.clientName);
      formData.append('idVeiculo', appointmentData.carModel);
      if (Array.isArray(appointmentData.service)) {
        appointmentData.service.forEach(svcId => formData.append('idServicos', svcId));
      } else {
        formData.append('idServicos', appointmentData.service);
      }

      await api.post('/agendamento-api', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      loadData();
    } catch (err) {
      console.error("Erro ao atualizar agendamento:", err);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await api.delete(`/agendamento-api/${id}`);
      loadData();
    } catch (err) {
      console.error("Erro ao excluir agendamento:", err);
    }
  };

  // ----- CRUD Estoque (Produto) -----
  const addInventoryItem = async (item) => {
    try {
      await api.post('/produto-api', {
        codigoProduto: item.code,
        nomeProduto: item.name,
        categoria: item.category,
        precoCusto: parseFloat(String(item.costPrice).replace(',', '.')) || 0,
        precoVenda: parseFloat(String(item.price).replace(',', '.')) || 0,
        estoqueAtual: parseInt(item.stock) || 0,
        estoqueMinimo: parseInt(item.minStock) || 0
      });
      loadData();
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
    }
  };

  const updateInventoryItem = async (id, item) => {
    // API não tem PUT direto na Controller de mobile, usa o próprio POST (salvarOuAtualizar)
    try {
      await api.post('/produto-api', {
        idProduto: id,
        codigoProduto: item.code,
        nomeProduto: item.name,
        categoria: item.category,
        precoCusto: parseFloat(String(item.costPrice).replace(',', '.')) || 0,
        precoVenda: parseFloat(String(item.price).replace(',', '.')) || 0,
        estoqueAtual: parseInt(item.stock) || 0,
        estoqueMinimo: parseInt(item.minStock) || 0
      });
      loadData();
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
    }
  };

  const deleteInventoryItem = async (id) => {
    try {
      await api.delete(`/produto-api/${id}`);
      loadData();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  };

  // ----- CRUD Clientes -----
  const addClient = async (client) => {
    try {
      await api.post('/cliente-api', {
        nomeCliente: client.name,
        telefone: client.phone,
        email: client.email
      });
      loadData();
    } catch (err) { console.error(err); }
  };
  const updateClient = async (id, data) => {
    try {
      await api.post('/cliente-api', { idCliente: id, nomeCliente: data.name, telefone: data.phone, email: data.email });
      loadData();
    } catch (err) { console.error(err); }
  };
  const deleteClient = async (id) => {
    try {
      await api.patch(`/cliente-api/${id}/status`);
      loadData();
    } catch (err) { console.error(err); }
  };

  // ----- CRUD Veículos -----
  const addVehicle = async (clientId, vehicle) => {
    try {
      await api.post('/veiculo-api', {
        cliente: { idCliente: clientId },
        modelo: vehicle.modelo,
        marca: vehicle.marca,
        placa: vehicle.placa
      });
      loadData();
    } catch (err) {
      console.error("Erro ao salvar veículo:", err);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await api.delete(`/veiculo-api/${id}`);
      loadData();
    } catch (err) {
      console.error("Erro ao excluir veículo:", err);
    }
  };

  // ----- CRUD Funcionarios -----
  const addEmployee = async (employee) => {
    try {
      await api.post('/funcionario-api', {
        nomeFuncionario: employee.name,
        email: employee.email,
        usuario: employee.email,
        senha: '123' // Default provisório
      });
      loadData();
    } catch (err) { console.error(err); }
  };
  const updateEmployee = async (id, data) => {
    try {
      await api.post('/funcionario-api', { idFuncionario: id, nomeFuncionario: data.name, email: data.email, usuario: data.email });
      loadData();
    } catch (err) { console.error(err); }
  };
  const deleteEmployee = async (id) => {
    try {
      await api.patch(`/funcionario-api/${id}/status`);
      loadData();
    } catch (err) { console.error(err); }
  };

  // ----- CRUD Serviços -----
  const addService = async (service) => {
    try {
      await api.post('/servico-api', { nomeServico: service.name, descServico: service.price });
      loadData();
    } catch (err) { console.error(err); }
  };
  const updateService = async (id, data) => {
    try {
      await api.post('/servico-api', { idServico: id, nomeServico: data.name, descServico: data.price });
      loadData();
    } catch (err) { console.error(err); }
  };
  const deleteService = async (id) => {
    try {
      await api.delete(`/servico-api/${id}`);
      loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, loadData,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
      clients, addClient, updateClient, deleteClient,
      employees, addEmployee, updateEmployee, deleteEmployee,
      services, addService, updateService, deleteService,
      addVehicle, deleteVehicle
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
