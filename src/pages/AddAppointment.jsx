import React, { useState, useEffect, useRef } from 'react';
import { User, Car, Calendar, Wrench, Clock, Camera as CameraIcon, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import TopBar from '../components/layout/TopBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AccessibleNode } from '../components/ui/AccessibleNode';
import styles from './Login.module.css';

const AddAppointment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { appointments, clients, services, addAppointment, updateAppointment } = useAppContext();

  const isEditing = !!id;
  const title = isEditing ? t('common.edit') : t('appointments.newCustomer');

  const [formData, setFormData] = useState({
    clientName: '', carModel: '', date: '', time: '', status: 'Pendente', observacao: '', services: []
  });
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const obsRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    setPhotos(prev => [...prev, ...newFiles]);
    
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
    
    e.target.value = '';
  };

  const takeNativePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      // Se a imagem for capturada com sucesso, converte-a para um Blob/File
      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        
        // Determina o formato (ex: jpeg) e cria o arquivo
        const format = image.format || 'jpeg';
        const file = new File([blob], `camera_${Date.now()}.${format}`, {
          type: `image/${format}`
        });

        // Atualiza os estados de foto que serão enviados ao backend e o preview
        setPhotos(prev => [...prev, file]);
        setPreviewUrls(prev => [...prev, image.webPath]);
      }
    } catch (e) {
      console.warn("Câmera cancelada ou erro:", e);
    }
  };

  const removePhoto = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveExistingPhoto = async (photoId) => {
    try {
      await api.delete(`/fotos-api/${photoId}`);
      setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      console.error('Erro ao deletar foto existente', err);
      alert('Erro ao excluir a foto salva.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && appointments.length > 0 && clients.length > 0) {
        const app = appointments.find(a => a.id === parseInt(id));
        if (app) {
          const clientObj = clients.find(c => c.name === app.name);
          const clientId = app.idCliente || (clientObj ? clientObj.id : '');
          const carId = app.idVeiculo || (clientObj?.veiculos?.find(v => v.modelo === app.car)?.idVeiculo || '');
          const serviceIds = (app.idServicos && app.idServicos.length > 0) ? app.idServicos : services.filter(s => (app.service || '').split(', ').includes(s.name)).map(s => s.id);
          
          let dateVal = app.rawDate ? app.rawDate.split('T')[0] : '';
          let timeVal = app.time || '';

          setFormData({
            clientName: clientId,
            carModel: carId,
            date: dateVal,
            time: timeVal,
            status: app.status || 'Pendente',
            observacao: app.observacao || '',
            services: serviceIds
          });
          
          try {
            const res = await api.get(`/fotos-api/listar/${id}`);
            if (res.data) {
              setExistingPhotos(res.data);
            }
          } catch (error) {
            console.warn('Nenhuma foto existente encontrada.');
          }
        }
      }
    };
    fetchData();
  }, [id, appointments, clients, services, isEditing]);

  useEffect(() => {
    if (obsRef.current && formData.observacao !== undefined && formData.observacao !== null) {
      if (obsRef.current.value !== String(formData.observacao)) {
        obsRef.current.value = formData.observacao;
      }
    }
  }, [formData.observacao]);

  const selectedClient = clients.find(c => c.id == formData.clientName);
  const veiculosDisponiveis = selectedClient && selectedClient.veiculos ? selectedClient.veiculos : [];

  const handleChange = (field) => (e) => {
    if (field === 'clientName') {
        setFormData({ ...formData, [field]: e.target.value, carModel: '' });
    } else {
        setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      alert("Por favor, selecione pelo menos um serviço.");
      return;
    }
    setLoading(true);
    
    // Garantir que a observação seja enviada caso tenha sido digitada mas não salva pelo bug de composição do Android
    const finalData = { ...formData, service: formData.services };
    
    if (isEditing) {
      await updateAppointment(parseInt(id), finalData, photos);
    } else {
      await addAppointment(finalData, photos);
    }
    
    setLoading(false);
    navigate('/appointments');
  };

  return (
    <>
      <TopBar title={title} showBack={true} />
      <div className={`page-content full-height ${styles.container}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.vehicleLabel')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <Car size={20} color="var(--text-light)" style={{ position: 'absolute', left: '16px' }} />
              <select
                value={formData.carModel} onChange={handleChange('carModel')} required disabled={veiculosDisponiveis.length === 0}
                style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)' }}>
                <option value="" disabled>{veiculosDisponiveis.length > 0 ? t('forms.vehiclePlaceholder') : t('forms.selectClientFirst', 'Selecione um cliente com veículos')}</option>
                {veiculosDisponiveis.map(v => <option key={v.idVeiculo} value={v.idVeiculo}>{v.modelo} - {v.placa}</option>)}
              </select>
            </div>
          </div>

          <Input label={t('forms.dateLabel')} id="date" type="date" icon={Calendar} value={formData.date} onChange={handleChange('date')} required />
          <Input label={t('forms.timeLabel', 'HORÁRIO')} id="time" type="time" icon={Clock} value={formData.time} onChange={handleChange('time')} />
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.statusLabel', 'STATUS DO AGENDAMENTO')}</label>
            <div style={{ marginTop: '8px' }}>
              <select
                value={formData.status} onChange={handleChange('status')} required
                style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)' }}>
                <option value="Pendente">{t('status.pending', 'Pendente')}</option>
                <option value="Agendado">{t('status.scheduled', 'Agendado')}</option>
                <option value="Confirmado">{t('status.confirmed', 'Confirmado')}</option>
                <option value="Em Andamento">{t('status.inProgress', 'Em Andamento')}</option>
                <option value="Concluído">{t('status.completed', 'Concluído')}</option>
                <option value="Cancelado">{t('status.canceled', 'Cancelado')}</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.serviceLabel')} {t('forms.multipleSelection', '(Múltipla Seleção)')}</label>
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
                  <span style={{ fontWeight: formData.services.includes(s.id) ? '600' : '400', color: formData.services.includes(s.id) ? 'var(--text-main)' : 'var(--text-secondary)' }}>{s.name} - {s.description || t('forms.noDescription', 'Sem descrição')}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
             <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.obsLabel', 'OBSERVAÇÃO (Opcional)')}</label>
             <textarea 
               ref={obsRef}
               defaultValue={formData.observacao || ''}
               maxLength={255}
               onChange={(e) => {
                 setFormData({ ...formData, observacao: e.target.value });
               }}
               placeholder={t('forms.obsPlaceholder', 'Detalhes adicionais sobre o serviço ou estado do veículo...')}
               style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--input-bg)', marginTop: '8px', minHeight: '100px', resize: 'vertical' }}
             />
             <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
               {(formData.observacao || '').length}/255
             </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.photosLabel', 'FOTOS DO VEÍCULO (Opcional)')}</label>
            <input type="file" multiple accept="image/*" ref={galleryInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            
            <div style={{ marginTop: '8px', padding: '24px', borderRadius: '12px', border: '2px dashed var(--border)', backgroundColor: 'var(--input-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <AccessibleNode as="button" textToSpeak={t('a11y.takePhoto', 'Tirar foto com a câmera')} type="button" onClick={takeNativePhoto} style={{
                  flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'var(--text-main)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px',
                  boxShadow: 'var(--shadow-sm)', border: 'none', cursor: 'pointer'
                }}>
                  <CameraIcon size={24} />
                  {t('forms.takePhoto', 'Tirar Foto')}
                </AccessibleNode>
                <AccessibleNode as="button" textToSpeak={t('a11y.openGallery', 'Escolher foto da galeria')} type="button" onClick={() => galleryInputRef.current?.click()} style={{
                  flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface)', color: 'var(--text-main)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px',
                  border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer'
                }}>
                  <ImageIcon size={24} />
                  {t('forms.gallery', 'Galeria')}
                </AccessibleNode>
              </div>
            </div>

            {existingPhotos.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('forms.savedPhotos', 'FOTOS SALVAS NA NUVEM')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                  {existingPhotos.map((photo) => (
                    <div key={photo.id} style={{ 
                      position: 'relative', width: '80px', height: '80px', borderRadius: '8px', 
                      overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '2px solid var(--primary)' 
                    }}>
                      <img src={`${api.defaults.baseURL}/fotos-api/imagem/${photo.id}`} alt="Foto Existente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <AccessibleNode as="button" textToSpeak={t('a11y.removePhoto', 'Remover foto')} type="button" onClick={() => handleRemoveExistingPhoto(photo.id)} style={{
                        position: 'absolute', top: '4px', right: '4px', backgroundColor: 'var(--danger)', 
                        color: '#FFF', border: 'none', borderRadius: '50%', width: '20px', height: '20px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        padding: 0
                      }}>
                        <X size={12} strokeWidth={3} />
                      </AccessibleNode>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid de Previews das fotos NOVAS */}
            {previewUrls.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                {previewUrls.map((url, index) => (
                  <div key={index} style={{ 
                    position: 'relative', width: '80px', height: '80px', borderRadius: '8px', 
                    overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' 
                  }}>
                    <img src={url} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <AccessibleNode as="button" textToSpeak={t('a11y.removePhoto', 'Remover foto')} type="button" onClick={() => removePhoto(index)} style={{
                      position: 'absolute', top: '4px', right: '4px', backgroundColor: 'var(--danger)', 
                      color: '#FFF', border: 'none', borderRadius: '50%', width: '20px', height: '20px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      padding: 0
                    }}>
                      <X size={12} strokeWidth={3} />
                    </AccessibleNode>
                  </div>
                ))}
              </div>
            )}
            {photos.length > 0 && <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>📸 {photos.length} {t('forms.photosSelected', 'foto(s) selecionada(s)')}</span>}
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit" loading={loading}>
              {loading ? t('common.processing', 'PROCESSANDO...') : (isEditing ? t('common.save') : t('forms.saveAppointment'))}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAppointment;

