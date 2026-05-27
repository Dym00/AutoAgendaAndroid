import React, { useState, useEffect } from 'react';
import { User, Car, Calendar, Wrench, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Login.module.css';

const AddAppointment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { appointments, clients, services, addAppointment, updateAppointment } = useAppContext();

  const isEditing = !!id;
  const title = isEditing ? t('common.edit') : t('appointments.newCustomer');

  const [formData, setFormData] = useState({
    clientName: '', carModel: '', date: '', time: '', services: []
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (isEditing && appointments.length > 0 && clients.length > 0) {
      const app = appointments.find(a => a.id === parseInt(id));
      if (app) {
        // Tentativa de achar os IDs reais através dos nomes
        const clientObj = clients.find(c => c.name === app.name);
        const clientId = clientObj ? clientObj.id : '';
        
        // Tentativa de achar o ID do veículo
        const carId = clientObj?.veiculos?.find(v => v.modelo === app.car)?.idVeiculo || '';
        
        // Encontrar IDs de serviços
        const servNames = (app.service || '').split(', ');
        const serviceIds = services.filter(s => servNames.includes(s.name)).map(s => s.id);
        
        let dateVal = '';
        let timeVal = '09:00'; // hora padrão since database doesn't store time
        if (app.time && app.time !== 'Sem data') {
          if (app.time.includes('T')) {
            const parts = app.time.split('T');
            dateVal = parts[0];
            timeVal = parts[1].substring(0, 5);
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(app.time)) {
            dateVal = app.time;
          } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(app.time)) {
            const [day, month, year] = app.time.split('/');
            dateVal = `${year}-${month}-${day}`;
          } else {
             dateVal = app.time; 
          }
        }

        setFormData({
          clientName: clientId,
          carModel: carId,
          date: dateVal,
          time: timeVal,
          services: serviceIds
        });
      }
    }
  }, [id, appointments, clients, services, isEditing]);

  const selectedClient = clients.find(c => c.id == formData.clientName);
  const veiculosDisponiveis = selectedClient && selectedClient.veiculos ? selectedClient.veiculos : [];

  const handleChange = (field) => (e) => {
    // Ao trocar de cliente, resetar o veículo
    if (field === 'clientName') {
        setFormData({ ...formData, [field]: e.target.value, carModel: '' });
    } else {
        setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.services.length === 0) {
      alert("Por favor, selecione pelo menos um serviço.");
      return;
    }

    const dataPrevisaoFormatada = formData.date && formData.time ? `${formData.date}T${formData.time}:00` : null;

    if (isEditing) {
      updateAppointment(parseInt(id), {
        clientName: formData.clientName,
        carModel: formData.carModel,
        date: dataPrevisaoFormatada,
        service: formData.services,
        status: 'Atualizado'
      });
    } else {
      addAppointment({
        clientName: formData.clientName,
        carModel: formData.carModel,
        date: dataPrevisaoFormatada,
        service: formData.services
      });
    }

    navigate('/appointments');
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Cliente Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.clientNameLabel')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <User size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px' }} />
              <select
                value={formData.clientName} onChange={handleChange('clientName')} required
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)' }}>
                <option value="" disabled>{t('forms.clientSelectPlaceholder')}</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Veículo Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.vehicleLabel')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Car size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px' }} />
              <select
                value={formData.carModel} onChange={handleChange('carModel')} required disabled={veiculosDisponiveis.length === 0}
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)' }}>
                <option value="" disabled>{veiculosDisponiveis.length > 0 ? t('forms.vehiclePlaceholder') : 'Selecione um cliente com veículos'}</option>
                {veiculosDisponiveis.map(v => <option key={v.idVeiculo} value={v.idVeiculo}>{v.modelo} - {v.placa}</option>)}
              </select>
            </div>
          </div>

          <Input label={t('forms.dateLabel')} id="date" type="date" icon={Calendar} value={formData.date} onChange={handleChange('date')} required min={new Date().toISOString().split('T')[0]} />
          <Input label={t('forms.timeLabel')} id="time" type="time" icon={Clock} value={formData.time} onChange={handleChange('time')} required />

          {/* Serviço Multi-Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.serviceLabel')} (Múltipla Seleção)</label>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {services.map(s => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--input-bg)' }}>
                  <input
                    type="checkbox"
                    style={{ transform: 'scale(1.2)' }}
                    checked={formData.services.includes(s.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, services: [...formData.services, s.id] });
                      } else {
                        setFormData({ ...formData, services: formData.services.filter(id => id !== s.id) });
                      }
                    }}
                  />
                  <span style={{ fontWeight: formData.services.includes(s.id) ? '600' : '400', color: formData.services.includes(s.id) ? 'var(--text-main)' : 'var(--text-secondary)' }}>{s.name} - R$ {s.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fotos Upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>FOTOS DO VEÍCULO (Opcional - Para resguardo)</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setPhotos(Array.from(e.target.files))}
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px dashed var(--primary)', backgroundColor: 'var(--input-bg)', color: 'var(--text-secondary)' }}
              />
            </div>
            {photos.length > 0 && <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>📸 {photos.length} foto(s) selecionada(s)</span>}
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit">{t('forms.saveAppointment')}</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAppointment;

