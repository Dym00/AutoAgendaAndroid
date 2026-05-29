import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Plus, Trash2, Car } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const AddClient = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clients, addClient, updateClient, addVehicle, deleteVehicle } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('clients.editTitle') : t('clients.addTitle');

  const [formData, setFormData] = useState({
    name: '', phone: '', email: ''
  });
  const [loading, setLoading] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    marca: '', modelo: '', placa: ''
  });

  useEffect(() => {
    if (isEditing) {
      const client = clients.find(c => c.id === parseInt(id));
      if (client) {
        setFormData({
          name: client.name,
          phone: client.phone,
          email: client.email
        });
      }
    }
  }, [id, clients, isEditing]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isEditing) {
        updateClient(parseInt(id), formData);
      } else {
        addClient(formData);
      }
      setLoading(false);
      navigate('/clients');
    }, 600);
  };

  const handleAddVehicle = async () => {
    if (newVehicle.marca && newVehicle.modelo && newVehicle.placa) {
      await addVehicle(parseInt(id), newVehicle);
      setNewVehicle({ marca: '', modelo: '', placa: '' });
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Deseja realmente remover este veículo?")) {
      await deleteVehicle(vehicleId);
    }
  };

  const currentClient = isEditing ? clients.find(c => c.id === parseInt(id)) : null;
  const clientVehicles = currentClient?.veiculos || [];

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`} style={{ paddingBottom: '32px', overflowY: 'auto' }}>
        <form className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: '0px' }}>
          
          <Input 
            label={t('forms.fullNameLabel')} 
            id="name" 
            placeholder={t('forms.clientNamePlaceholder')} 
            icon={User} 
            value={formData.name} 
            onChange={handleChange('name')} 
            required 
          />
          
          <Input 
            label={t('forms.phoneLabel')} 
            id="phone" 
            placeholder={t('forms.phonePlaceholder')} 
            icon={Phone} 
            type="tel"
            value={formData.phone} 
            onChange={handleChange('phone')} 
            required 
          />
          
          <Input 
            label={t('forms.emailLabel')} 
            id="email" 
            type="email" 
            placeholder={t('forms.emailPlaceholder')} 
            icon={Mail} 
            value={formData.email} 
            onChange={handleChange('email')} 
            required 
          />
          
          <div className={styles.buttonContainer} style={{ marginBottom: '16px' }}>
            <Button type="submit" loading={loading}>
              {loading ? "PROCESSANDO..." : (isEditing ? t('common.save') : t('forms.saveClient'))}
            </Button>
          </div>
        </form>

        {!isEditing ? (
          <p style={{ fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
            * Após salvar o cliente, você poderá adicionar e gerenciar seus veículos editando o cadastro.
          </p>
        ) : (
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={20} color="var(--primary)" /> Gerenciar Veículos ({clientVehicles.length})
            </h3>

            {clientVehicles.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px', border: '1px dashed var(--border)', borderRadius: '8px', marginBottom: '16px' }}>
                Nenhum veículo cadastrado.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {clientVehicles.map(v => (
                  <div key={v.idVeiculo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--input-bg)' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{v.modelo} - {v.marca}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>Placa: {v.placa}</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteVehicle(v.idVeiculo)}
                      style={{ background: 'none', border: 'none', color: '#ff4444', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--input-bg)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>Novo Veículo</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Marca (Ex: Chevrolet)" 
                  value={newVehicle.marca} 
                  onChange={(e) => setNewVehicle({ ...newVehicle, marca: e.target.value })}
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', fontSize: '14px' }}
                />
                <input 
                  type="text" 
                  placeholder="Modelo (Ex: Onix)" 
                  value={newVehicle.modelo} 
                  onChange={(e) => setNewVehicle({ ...newVehicle, modelo: e.target.value })}
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', fontSize: '14px' }}
                />
                <input 
                  type="text" 
                  placeholder="Placa (Ex: ABC1D23)" 
                  value={newVehicle.placa} 
                  onChange={(e) => setNewVehicle({ ...newVehicle, placa: e.target.value.toUpperCase() })}
                  maxLength={7}
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-main)', fontSize: '14px' }}
                />
                <button 
                  type="button"
                  onClick={handleAddVehicle}
                  disabled={!newVehicle.marca || !newVehicle.modelo || !newVehicle.placa}
                  style={{ 
                    width: '100%',
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    backgroundColor: 'var(--primary)', 
                    color: 'var(--text-main)', 
                    fontWeight: '700', 
                    fontSize: '14px',
                    cursor: 'pointer',
                    opacity: (!newVehicle.marca || !newVehicle.modelo || !newVehicle.placa) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Plus size={18} />
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddClient;
