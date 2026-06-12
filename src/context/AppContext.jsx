import React, { createContext, useState, useContext, useEffect } from 'react';
import { Package, SlidersHorizontal, Droplets, Zap, User, Wrench, Briefcase } from 'lucide-react';
import api from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState(() => {
    try { const saved = localStorage.getItem('autoagenda_appointments'); return saved ? JSON.parse(saved) : []; } catch(e) { return []; }
  });
  const [inventory, setInventory] = useState(() => {
    try { const saved = localStorage.getItem('autoagenda_inventory'); return saved ? JSON.parse(saved) : []; } catch(e) { return []; }
  });
  const [clients, setClients] = useState(() => {
    try { const saved = localStorage.getItem('autoagenda_clients'); return saved ? JSON.parse(saved) : []; } catch(e) { return []; }
  });
  const [employees, setEmployees] = useState(() => {
    try { const saved = localStorage.getItem('autoagenda_employees'); return saved ? JSON.parse(saved) : []; } catch(e) { return []; }
  });
  const [services, setServices] = useState(() => {
    try { const saved = localStorage.getItem('autoagenda_services'); return saved ? JSON.parse(saved) : []; } catch(e) { return []; }
  });

  // Toast Messages Global System
  const [toastMessage, setToastMessage] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
  };
  
  const hideToast = () => {
    setToastMessage(null);
  };

  // Notificações Locais
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('autoagenda_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem('autoagenda_notifications', JSON.stringify(newNotifs));
  };

  const addNotification = (type, title, message, params = null) => {
    const newNotif = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      params,
      time: new Date().toISOString(),
      read: false
    };
    saveNotifications([newNotif, ...notifications]);
    
    // Dispara também o Toast para feedback visual imediato (o toast pode renderizar as chaves cruas ou precisaria ser traduzido, mas Toast não tem suporte direto a t() aqui, então enviaremos a chave)
    showToast(message, type);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  useEffect(() => {
    if (user) {
      loadData(true); // Sincronização silenciosa no boot
    }
  }, [user]);

  const loadData = async (silent = false) => {
    if (user && user.isOffline) {
      // Injeta dados falsos para Teste Visual
      setClients([{ id: 1, name: 'João (Teste)', phone: '(11) 9999-9999', email: 'teste@email.com' }]);
      setEmployees([{ id: 1, name: 'Desenvolvedor', role: 'Gerente', email: 'dev@autoagenda.com' }]);
      setServices([{ id: 1, name: 'Troca de Óleo', description: 'Serviço padrão' }]);
      setInventory([{ id: 1, name: 'Filtro (Teste)', category: 'Peças', price: '45,00', stock: 10, critical: false, Icon: Package }]);
      setAppointments([{ id: 1, name: 'João (Teste)', time: '14:30', car: 'Onix 2022', service: 'Troca de Óleo', isNew: true }]);
      return;
    }

    try {
       const config = silent ? { hideLoading: true } : {};
       // Carregamento paralelo de todas as APIs
       const [cliRes, empRes, prodRes, servRes, agenRes] = await Promise.all([
          api.get('/cliente-api', config),
          api.get('/funcionario-api', config),
          api.get('/produto-api', config),
          api.get('/servico-api', config).catch(() => ({ data: [] })), // Fallback se não existir
          api.get('/agendamento-api', config)
       ]);

       if (cliRes.data) {
         const newClients = cliRes.data.map(c => ({
           id: c.idCliente, name: c.nomeCliente, phone: c.telefone, email: c.email, veiculos: c.veiculos || []
         }));
         setClients(newClients);
         localStorage.setItem('autoagenda_clients', JSON.stringify(newClients));
       }

       if (empRes.data) {
         const newEmployees = empRes.data.map(e => ({
           id: e.idFuncionario, name: e.nomeFuncionario, role: e.acesso === 'admin' ? 'Gerente' : 'Mecânico', email: e.email, cpf: e.cpf, phone: e.telefone
         }));
         setEmployees(newEmployees);
         localStorage.setItem('autoagenda_employees', JSON.stringify(newEmployees));
       }

       if (prodRes.data) {
         const newInv = prodRes.data.map(p => {
           const minStockVal = p.estoqueMinimo !== undefined && p.estoqueMinimo !== null ? parseInt(p.estoqueMinimo, 10) : parseInt(p.estoqueMinino || 0, 10);
           const currentStock = parseInt(p.estoqueAtual || 0, 10);
           return {
             id: p.idProduto, 
             code: p.codigoProduto || '',
             name: p.nomeProduto, 
             category: p.categoria, 
             costPrice: p.precoCusto || 0,
             price: p.precoVenda, 
             stock: currentStock, 
             minStock: minStockVal,
             critical: currentStock < minStockVal,
             fornecedor: p.fornecedor || '',
             descricao: p.descricao || ''
           };
         });
         setInventory(newInv);
         localStorage.setItem('autoagenda_inventory', JSON.stringify(newInv));

         // Trigger de Estoque Crítico
         const criticalItems = newInv.filter(i => i.critical);
         if (criticalItems.length > 0) {
           const todayStr = new Date().toISOString().split('T')[0];
           const lastAlert = localStorage.getItem('autoagenda_last_critical_alert');
           if (lastAlert !== todayStr) {
              addNotification(
                'alert', 
                'notifications.stockTitle', 
                'notifications.stockMessage',
                { count: criticalItems.length }
              );
             localStorage.setItem('autoagenda_last_critical_alert', todayStr);
           }
         }
       }
       
       let servicesList = [];
       if (servRes.data) {
         servicesList = servRes.data.map(s => ({
           id: s.idServico, name: s.nomeServico, description: s.descServico
         }));
         setServices(servicesList);
         localStorage.setItem('autoagenda_services', JSON.stringify(servicesList));
       }

       if (agenRes.data) {
         const newAppts = agenRes.data.map(a => ({
           id: a.idAgendamento, 
           name: a.cliente?.nomeCliente || 'Desconhecido', 
           time: a.horaPrevisao ? a.horaPrevisao.slice(0, 5) : '--:--', 
           car: a.veiculo ? `${a.veiculo.modelo} - ${a.veiculo.placa || 'Sem placa'}` : 'Não informado', 
           service: a.servicos?.map(s => {
             const matched = servicesList.find(svc => svc.id === s.idServico);
             return matched ? matched.name : s.descricao || 'Serviço';
           }).join(', ') || 'Nenhum', 
           status: a.statusAgendamento,
           observacao: a.observacao,
           rawDate: a.dataPrevisao,
           idCliente: a.cliente?.idCliente || '',
           idVeiculo: a.veiculo?.idVeiculo || '',
           idServicos: a.servicos?.map(s => s.idServico) || []
         }));
         setAppointments(newAppts);
         localStorage.setItem('autoagenda_appointments', JSON.stringify(newAppts));
       }

    } catch(err) {
       console.error("Erro ao carregar dados das APIs:", err);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('@AutoAgenda:savedUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Não apagamos o savedUser para o Quick Login, apagamos apenas os caches de dados
    localStorage.removeItem('autoagenda_appointments');
    localStorage.removeItem('autoagenda_inventory');
    localStorage.removeItem('autoagenda_clients');
    localStorage.removeItem('autoagenda_employees');
    localStorage.removeItem('autoagenda_services');
  };

  // ----- CRUD Agendamentos -----
  const addAppointment = async (appointmentData, photos = []) => {
    try {
      const formData = new FormData();
      // O Spring Boot espera @RequestPart("agendamento") como JSON blob
      formData.append('agendamento', new Blob([JSON.stringify({
        dataPrevisao: appointmentData.date ? appointmentData.date.split('T')[0] : null,
        horaPrevisao: appointmentData.time || null,
        statusAgendamento: appointmentData.status || 'Pendente',
        observacao: appointmentData.observacao || '',
        funcionario: user && user.idFuncionario ? { idFuncionario: user.idFuncionario } : null
      })], { type: "application/json" }));
      
      formData.append('idCliente', appointmentData.clientName);
      formData.append('idVeiculo', appointmentData.carModel);
      if (Array.isArray(appointmentData.service)) {
        appointmentData.service.forEach(svcId => formData.append('idServicos', svcId));
      } else {
        formData.append('idServicos', appointmentData.service);
      }

      if (photos && photos.length > 0) {
        photos.forEach(file => {
          formData.append('fotos', file);
        });
      }

      await api.post('/agendamento-api', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addNotification('success', 'notifications.apptSavedTitle', 'notifications.apptSavedMessage');
      loadData(); // Recarrega do servidor
    } catch (err) {
      showToast('Erro ao salvar agendamento.', 'error');
      console.error("Erro ao salvar agendamento:", err);
    }
  };

  const updateAppointment = async (id, appointmentData, photos = []) => {
    try {
      const formData = new FormData();
      formData.append('agendamento', new Blob([JSON.stringify({
        idAgendamento: id,
        dataPrevisao: appointmentData.date ? appointmentData.date.split('T')[0] : null,
        horaPrevisao: appointmentData.time || null,
        statusAgendamento: appointmentData.status || 'Pendente',
        observacao: appointmentData.observacao || '',
        funcionario: user && user.idFuncionario ? { idFuncionario: user.idFuncionario } : null
      })], { type: "application/json" }));
      
      formData.append('idCliente', appointmentData.clientName);
      formData.append('idVeiculo', appointmentData.carModel);
      if (Array.isArray(appointmentData.service)) {
        appointmentData.service.forEach(svcId => formData.append('idServicos', svcId));
      } else {
        formData.append('idServicos', appointmentData.service);
      }

      if (photos && photos.length > 0) {
        photos.forEach(file => {
          formData.append('fotos', file);
        });
      }

      await api.post('/agendamento-api', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Agendamento atualizado com sucesso!', 'success');
      loadData();
    } catch (err) {
      let errorMsg = 'Erro ao atualizar agendamento.';
      if (err.response && err.response.data && err.response.data.erro) {
        errorMsg = err.response.data.erro;
      }
      showToast(errorMsg, 'error');
      console.error("Erro ao atualizar agendamento:", err);
    }
  };

  const concludeAppointment = async (id) => {
    try {
      const appToUpdate = appointments.find(a => a.id === id);
      if (!appToUpdate) throw new Error("Agendamento não encontrado localmente para conclusão");

      // Optimistic Update: atualiza a interface local imediatamente
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Concluído' } : a));

      const formData = new FormData();
      formData.append('agendamento', new Blob([JSON.stringify({
        idAgendamento: id,
        dataPrevisao: appToUpdate.rawDate ? appToUpdate.rawDate.split('T')[0] : null,
        horaPrevisao: appToUpdate.time !== '--:--' ? appToUpdate.time : null,
        statusAgendamento: 'Concluído',
        observacao: appToUpdate.observacao || '',
        funcionario: user && user.idFuncionario ? { idFuncionario: user.idFuncionario } : null
      })], { type: "application/json" }));
      
      formData.append('idCliente', appToUpdate.idCliente);
      formData.append('idVeiculo', appToUpdate.idVeiculo);
      if (appToUpdate.idServicos && appToUpdate.idServicos.length > 0) {
        appToUpdate.idServicos.forEach(svcId => formData.append('idServicos', svcId));
      }

      await api.post('/agendamento-api', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      addNotification('success', 'notifications.apptDoneTitle', 'notifications.apptDoneMessage');
      await loadData(); // Garante que a interface só recarregue o real após o BD confirmar
    } catch (err) {
      showToast('Erro ao concluir agendamento.', 'error');
      console.error("Erro ao concluir agendamento:", err);
      await loadData(); // Em caso de erro, reverte as mudanças voltando ao estado original do BD
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await api.delete(`/agendamento-api/${id}`);
      showToast('Agendamento excluído!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao excluir agendamento.', 'error');
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
        estoqueMinimo: parseInt(item.minStock) || 0,
        fornecedor: item.fornecedor || '',
        descricao: item.descricao || ''
      });
      showToast('Item salvo no estoque com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao salvar item no estoque.', 'error');
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
        estoqueMinimo: parseInt(item.minStock) || 0,
        fornecedor: item.fornecedor || '',
        descricao: item.descricao || ''
      });
      showToast('Item atualizado com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao atualizar item no estoque.', 'error');
      console.error("Erro ao atualizar produto:", err);
    }
  };

  const deleteInventoryItem = async (id) => {
    try {
      await api.delete(`/produto-api/${id}`);
      showToast('Item excluído do estoque.', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao excluir item.', 'error');
      console.error("Erro ao excluir produto:", err);
    }
  };

  const addClient = async (client) => {
    try {
      await api.post('/cliente-api', {
        nomeCliente: client.name,
        telefone: client.phone,
        email: client.email
      });
      showToast('Cliente salvo com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao salvar cliente.', 'error');
      console.error(err);
    }
  };
  const updateClient = async (id, data) => {
    try {
      await api.post('/cliente-api', { idCliente: id, nomeCliente: data.name, telefone: data.phone, email: data.email });
      showToast('Cliente atualizado com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao atualizar cliente.', 'error');
      console.error(err);
    }
  };
  const deleteClient = async (id) => {
    try {
      await api.patch(`/cliente-api/${id}/status`);
      showToast('Cliente removido com sucesso.', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao excluir cliente.', 'error');
      console.error(err);
    }
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
      showToast('Veículo salvo com sucesso!', 'success');
      loadData();
    } catch (err) {
      let errorMsg = 'Erro ao salvar veículo.';
      if (err.response && err.response.data) {
        errorMsg = err.response.data.erro || err.response.data.message || errorMsg;
      } else if (err.message) {
        errorMsg += ` (${err.message})`;
      }
      
      // SOLUÇÃO DE CONTORNO (WORKAROUND): Falso-Positivo do Jackson/Hibernate no Spring Boot
      // O banco de dados salva o veículo com sucesso, mas a API quebra ao tentar serializar o Proxy de resposta para JSON.
      if (errorMsg.includes('org.hibernate.proxy') || errorMsg.includes('Type definition error')) {
        showToast('Veículo salvo com sucesso!', 'success');
        loadData();
      } else {
        showToast(`Erro: ${errorMsg}`, 'error');
        console.error("Erro ao salvar veículo:", err);
      }
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await api.delete(`/veiculo-api/${id}`);
      showToast('Veículo excluído.', 'success');
      loadData();
    } catch (err) {
      showToast('Erro: Veículo possui histórico no sistema e não pode ser excluído por segurança.', 'error');
      console.error("Erro ao excluir veículo:", err);
    }
  };

  // ----- CRUD Funcionarios -----
  const addEmployee = async (employee) => {
    try {
      await api.post('/funcionario-api', {
        nomeFuncionario: employee.name,
        email: employee.email,
        usuario: employee.usuario || employee.email,
        cpf: employee.cpf || null,
        telefone: employee.phone || null,
        acesso: employee.role?.toLowerCase() || 'comum',
        senha: employee.senha || '123'
      });
      showToast('Funcionário adicionado com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao adicionar funcionário.', 'error');
      console.error(err);
    }
  };
  const updateEmployee = async (id, employee) => {
    try {
      await api.post('/funcionario-api', {
        idFuncionario: id,
        nomeFuncionario: employee.name,
        email: employee.email,
        usuario: employee.usuario || employee.email,
        cpf: employee.cpf || null,
        telefone: employee.phone || null,
        acesso: employee.role?.toLowerCase() || 'comum',
        senha: employee.senha || '123'
      });
      showToast('Funcionário atualizado com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao atualizar funcionário.', 'error');
      console.error(err);
    }
  };
  const deleteEmployee = async (id) => {
    try {
      await api.patch(`/funcionario-api/${id}/status`);
      showToast('Funcionário inativado com sucesso.', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao inativar funcionário.', 'error');
      console.error(err);
    }
  };

  // ----- CRUD Serviços -----
  const addService = async (service) => {
    try {
      await api.post('/servico-api', { nomeServico: service.name, descServico: service.description });
      showToast('Serviço salvo com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao salvar serviço.', 'error');
      console.error(err);
    }
  };
  const updateService = async (id, data) => {
    try {
      await api.post('/servico-api', { idServico: id, nomeServico: data.name, descServico: data.description });
      showToast('Serviço atualizado com sucesso!', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao atualizar serviço.', 'error');
      console.error(err);
    }
  };
  const deleteService = async (id) => {
    try {
      await api.delete(`/servico-api/${id}`);
      showToast('Serviço excluído com sucesso.', 'success');
      loadData();
    } catch (err) {
      showToast('Erro ao excluir serviço.', 'error');
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, loadData,
      appointments, addAppointment, updateAppointment, deleteAppointment, concludeAppointment,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
      clients, addClient, updateClient, deleteClient,
      employees, addEmployee, updateEmployee, deleteEmployee,
      services, addService, updateService, deleteService,
      addVehicle, deleteVehicle,
      notifications, addNotification, markAllAsRead, clearNotifications,
      toastMessage, showToast, hideToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
