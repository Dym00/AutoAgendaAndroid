const fs = require('fs');

const ptPath = './src/i18n/locales/pt-BR.json';
const enPath = './src/i18n/locales/en.json';
const esPath = './src/i18n/locales/es.json';

const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

// Inject translations
const translations = {
  notifications: {
    justNow: { pt: 'Agora mesmo', en: 'Just now', es: 'Ahora mismo' },
    minsAgo: { pt: 'Há {{count}} min', en: '{{count}} min ago', es: 'Hace {{count}} min' },
    hoursAgo: { pt: 'Há {{count}} hora(s)', en: '{{count}} hour(s) ago', es: 'Hace {{count}} hora(s)' },
    daysAgo: { pt: 'Há {{count}} dia(s)', en: '{{count}} day(s) ago', es: 'Hace {{count}} día(s)' },
    clearAll: { pt: 'Limpar Todas', en: 'Clear All', es: 'Limpiar Todas' },
    "Agendamento Salvo": { pt: 'Agendamento Salvo', en: 'Appointment Saved', es: 'Cita Guardada' },
    "Atenção ao Estoque!": { pt: 'Atenção ao Estoque!', en: 'Inventory Alert!', es: '¡Atención al Inventario!' },
    "Agendamento Concluído": { pt: 'Agendamento Concluído', en: 'Appointment Completed', es: 'Cita Completada' },
    "O novo agendamento foi registrado com sucesso.": { pt: 'O novo agendamento foi registrado com sucesso.', en: 'The new appointment was registered successfully.', es: 'La nueva cita se registró con éxito.' },
    "O agendamento foi marcado como concluído com sucesso.": { pt: 'O agendamento foi marcado como concluído com sucesso.', en: 'The appointment has been successfully marked as completed.', es: 'La cita ha sido marcada como completada con éxito.' }
  },
  status: {
    pending: { pt: 'Pendente', en: 'Pending', es: 'Pendiente' },
    scheduled: { pt: 'Agendado', en: 'Scheduled', es: 'Programado' },
    confirmed: { pt: 'Confirmado', en: 'Confirmed', es: 'Confirmado' },
    inProgress: { pt: 'Em Andamento', en: 'In Progress', es: 'En Progreso' },
    completed: { pt: 'Concluído', en: 'Completed', es: 'Completado' },
    canceled: { pt: 'Cancelado', en: 'Canceled', es: 'Cancelado' }
  },
  forms: {
    selectClientFirst: { pt: 'Selecione um cliente com veículos', en: 'Select a client with vehicles', es: 'Seleccione un cliente con vehículos' },
    statusLabel: { pt: 'STATUS DO AGENDAMENTO', en: 'APPOINTMENT STATUS', es: 'ESTADO DE LA CITA' },
    multipleSelection: { pt: '(Múltipla Seleção)', en: '(Multiple Selection)', es: '(Selección Múltiple)' },
    noDescription: { pt: 'Sem descrição', en: 'No description', es: 'Sin descripción' },
    obsLabel: { pt: 'OBSERVAÇÃO (Opcional)', en: 'NOTES (Optional)', es: 'NOTAS (Opcional)' },
    obsPlaceholder: { pt: 'Detalhes adicionais sobre o serviço ou estado do veículo...', en: 'Additional details about the service or vehicle status...', es: 'Detalles adicionales sobre el servicio o estado del vehículo...' },
    photosLabel: { pt: 'FOTOS DO VEÍCULO (Opcional)', en: 'VEHICLE PHOTOS (Optional)', es: 'FOTOS DEL VEHÍCULO (Opcional)' },
    takePhoto: { pt: 'Tirar Foto', en: 'Take Photo', es: 'Tomar Foto' },
    gallery: { pt: 'Galeria', en: 'Gallery', es: 'Galería' },
    photosSelected: { pt: 'foto(s) selecionada(s)', en: 'photo(s) selected', es: 'foto(s) seleccionada(s)' }
  },
  common: {
    processing: { pt: 'PROCESSANDO...', en: 'PROCESSING...', es: 'PROCESANDO...' }
  }
};

const mergeTranslations = (target, source, lang) => {
  for (const key in source) {
    if (!target[key]) target[key] = {};
    for (const subKey in source[key]) {
      target[key][subKey] = source[key][subKey][lang];
    }
  }
};

mergeTranslations(pt, translations, 'pt');
mergeTranslations(en, translations, 'en');
mergeTranslations(es, translations, 'es');

fs.writeFileSync(ptPath, JSON.stringify(pt, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(esPath, JSON.stringify(es, null, 2));

console.log("Locales updated with phase 3 keys!");
