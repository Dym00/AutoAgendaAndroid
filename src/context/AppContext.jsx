import React, { createContext, useState, useContext } from 'react';
import { Package, SlidersHorizontal, Droplets, Zap, User, Wrench, Briefcase } from 'lucide-react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const [appointments, setAppointments] = useState([
    { id: 1, name: "Ana Silva", time: "10:00", car: "Chevrolet Onix 2022", service: "Troca de Óleo e Inspeção", isNew: false },
    { id: 2, name: "Carlos Mendes", time: "11:30", car: "Ford Ka 2021", service: "Substituição de Pastilhas de Freio", isNew: false },
    { id: 3, name: "Beatriz Souza", time: "14:30", car: "Volkswagen T-Cross 2023", service: "Rodízio e Alinhamento de Pneus", isNew: true },
    { id: 4, name: "Hector Semenssato", time: "15:30", car: "Fiat Tempra 1992", service: "Troca de Óleo e Inspeção", isNew: false },
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Óleo Sintético 5W30', category: 'Líquidos & Fluidos', price: '45,00', stock: 130, critical: false, Icon: Package },
    { id: 2, name: 'Pastilhas de Freio Cerâmica', category: 'Alerta de Estoque Baixo', price: '120,00', stock: 2, critical: true, Icon: SlidersHorizontal },
    { id: 3, name: 'Filtro de Ar Condicionado', category: 'Filtros & Cabine', price: '35,00', stock: 40, critical: false, Icon: Package },
    { id: 4, name: 'Fluido de Freio', category: 'Líquidos & Fluidos', price: '25,00', stock: 15, critical: false, Icon: Droplets },
    { id: 5, name: 'Velas de Ignição', category: 'Ignição & Elétrica', price: '60,00', stock: 8, critical: false, Icon: Zap },
  ]);

  const [clients, setClients] = useState([
    { id: 1, name: 'João Silva', phone: '(11) 98765-4321', email: 'joao@email.com' },
    { id: 2, name: 'Maria Souza', phone: '(11) 91234-5678', email: 'maria@email.com' }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ricardo Oliveira', role: 'Gerente / Mecânico Chefe', email: 'ricardo@autoagenda.com' },
    { id: 2, name: 'Paulo Santos', role: 'Mecânico', email: 'paulo@autoagenda.com' }
  ]);

  const [services, setServices] = useState([
    { id: 1, name: 'Troca de Óleo', price: '80,00' },
    { id: 2, name: 'Alinhamento e Balanceamento', price: '150,00' }
  ]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addAppointment = (appointment) => {
    setAppointments([...appointments, { ...appointment, id: Date.now() }]);
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const addInventoryItem = (item) => {
    setInventory([...inventory, { ...item, id: Date.now(), Icon: Package }]);
  };

  const updateInventoryItem = (id, updatedData) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, ...updatedData } : i));
  };

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const addClient = (client) => setClients([...clients, { ...client, id: Date.now() }]);
  const updateClient = (id, data) => setClients(clients.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteClient = (id) => setClients(clients.filter(c => c.id !== id));

  const addEmployee = (employee) => setEmployees([...employees, { ...employee, id: Date.now() }]);
  const updateEmployee = (id, data) => setEmployees(employees.map(e => e.id === id ? { ...e, ...data } : e));
  const deleteEmployee = (id) => setEmployees(employees.filter(e => e.id !== id));

  const addService = (service) => setServices([...services, { ...service, id: Date.now() }]);
  const updateService = (id, data) => setServices(services.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteService = (id) => setServices(services.filter(s => s.id !== id));

  return (
    <AppContext.Provider value={{ 
      user, login, logout,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
      clients, addClient, updateClient, deleteClient,
      employees, addEmployee, updateEmployee, deleteEmployee,
      services, addService, updateService, deleteService
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
