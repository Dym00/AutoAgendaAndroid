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
  const { appointments, addAppointment, updateAppointment } = useAppContext();
  
  const isEditing = !!id;
  const title = isEditing ? t('common.edit') : t('appointments.newCustomer');

  const [formData, setFormData] = useState({
    clientName: '', carModel: '', date: '', time: '', service: ''
  });

  useEffect(() => {
    if (isEditing) {
      const app = appointments.find(a => a.id === parseInt(id));
      if (app) {
        // Reverse engineering the mocks since form uses relational IDs
        const clientId = clientesMock.find(c => c.name === app.name)?.id || '';
        const carId = veiculosMock.find(v => v.model === app.car)?.id || '';
        const serviceId = servicosMock.find(s => s.desc === app.service)?.id || '';
        
        setFormData({
          clientName: clientId,
          carModel: carId,
          date: '', // Mock doesnt have date
          time: app.time,
          service: serviceId
        });
      }
    }
  }, [id, appointments, isEditing]);

  // Mocks de dados relacionais que viriam das APIs: /mobile/cliente-api, /mobile/veiculo-api, /mobile/servico-api
  const clientesMock = [{ id: 1, name: 'João Silva' }, { id: 2, name: 'Maria Souza' }];
  const veiculosMock = [{ id: 1, model: 'Chevrolet Onix 2022' }, { id: 2, model: 'Honda Civic 2019' }];
  const servicosMock = [{ id: 1, desc: 'Troca de Óleo' }, { id: 2, desc: 'Alinhamento' }];

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clienteName = clientesMock.find(c => c.id == formData.clientName)?.name || 'Cliente';
    const carName = veiculosMock.find(v => v.id == formData.carModel)?.model || 'Carro';
    const serviceName = servicosMock.find(s => s.id == formData.service)?.desc || 'Serviço';

    if (isEditing) {
      updateAppointment(parseInt(id), {
        name: clienteName,
        time: formData.time,
        car: carName,
        service: serviceName
      });
    } else {
      addAppointment({
        name: clienteName,
        time: formData.time,
        car: carName,
        service: serviceName,
        isNew: false
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
                {clientesMock.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Veículo Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.vehicleLabel')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Car size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px' }} />
              <select 
                value={formData.carModel} onChange={handleChange('carModel')} required
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)' }}>
                <option value="" disabled>{t('forms.vehiclePlaceholder')}</option>
                {veiculosMock.map(v => <option key={v.id} value={v.id}>{v.model}</option>)}
              </select>
            </div>
          </div>

          <Input label={t('forms.dateLabel')} id="date" type="date" icon={Calendar} value={formData.date} onChange={handleChange('date')} required />
          <Input label={t('forms.timeLabel')} id="time" type="time" icon={Clock} value={formData.time} onChange={handleChange('time')} required />
          
          {/* Serviço Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.serviceLabel')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Wrench size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px' }} />
              <select 
                value={formData.service} onChange={handleChange('service')} required
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)' }}>
                <option value="" disabled>{t('forms.serviceSelectPlaceholder')}</option>
                {servicosMock.map(s => <option key={s.id} value={s.id}>{s.desc}</option>)}
              </select>
            </div>
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
