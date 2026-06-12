const fs = require('fs');

const ptPath = './src/i18n/locales/pt-BR.json';
const enPath = './src/i18n/locales/en.json';
const esPath = './src/i18n/locales/es.json';

const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

// Inject translations
const translations = {
  forms: {
    serviceDescLabel: { pt: 'DESCRIÇÃO DO SERVIÇO', en: 'SERVICE DESCRIPTION', es: 'DESCRIPCIÓN DEL SERVICIO' },
    serviceDescPlaceholder: { pt: 'Ex: Detalhamento do serviço prestado', en: 'Ex: Details of the service provided', es: 'Ej: Detalles del servicio prestado' }
  },
  employees: {
    confirmDelete: { pt: 'Deseja realmente excluir este funcionário?', en: 'Do you really want to delete this employee?', es: '¿Realmente deseas eliminar este empleado?' }
  },
  notifications: {
    empty: { pt: 'Nenhuma notificação por aqui.', en: 'No notifications around here.', es: 'No hay notificaciones por aquí.' },
    stockTitle: { pt: 'Atenção ao Estoque!', en: 'Inventory Alert!', es: '¡Atención al Inventario!' },
    stockMessage: { pt: 'Você possui {{count}} produto(s) abaixo do limite mínimo.', en: 'You have {{count}} product(s) below the minimum limit.', es: 'Tienes {{count}} producto(s) por debajo del límite mínimo.' },
    apptSavedTitle: { pt: 'Agendamento Salvo', en: 'Appointment Saved', es: 'Cita Guardada' },
    apptSavedMessage: { pt: 'O novo agendamento foi registrado com sucesso.', en: 'The new appointment was registered successfully.', es: 'La nueva cita se registró con éxito.' },
    apptDoneTitle: { pt: 'Agendamento Concluído', en: 'Appointment Completed', es: 'Cita Completada' },
    apptDoneMessage: { pt: 'O agendamento foi marcado como concluído com sucesso.', en: 'The appointment has been successfully marked as completed.', es: 'La cita ha sido marcada como completada con éxito.' }
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

console.log("Locales updated with notifs and services keys!");
