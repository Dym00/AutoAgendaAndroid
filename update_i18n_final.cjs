const fs = require('fs');

const ptPath = './src/i18n/locales/pt-BR.json';
const enPath = './src/i18n/locales/en.json';
const esPath = './src/i18n/locales/es.json';

const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

// Inject translations
const translations = {
  nav: {
    services: { pt: 'Gestão de serviços da oficina', en: 'Workshop Services Management', es: 'Gestión de servicios del taller' },
    editShop: { pt: 'Editar Dados da Oficina', en: 'Edit Workshop Data', es: 'Editar Datos del Taller' }
  },
  status: {
    pending: { pt: 'Pendente', en: 'Pending', es: 'Pendiente' },
    scheduled: { pt: 'Agendado', en: 'Scheduled', es: 'Programado' },
    confirmed: { pt: 'Confirmado', en: 'Confirmed', es: 'Confirmado' },
    inProgress: { pt: 'Em Andamento', en: 'In Progress', es: 'En Progreso' },
    finished: { pt: 'Concluído', en: 'Finished', es: 'Completado' },
    concluido: { pt: 'Concluído', en: 'Finished', es: 'Completado' },
    canceled: { pt: 'Cancelado', en: 'Canceled', es: 'Cancelado' }
  },
  common: {
    finish: { pt: 'CONCLUIR', en: 'FINISH', es: 'COMPLETAR' },
    processing: { pt: 'PROCESSANDO...', en: 'PROCESSING...', es: 'PROCESANDO...' }
  },
  clients: {
    manageVehicles: { pt: 'Gerenciar Veículos', en: 'Manage Vehicles', es: 'Gestionar Vehículos' },
    noVehicles: { pt: 'Nenhum veículo cadastrado.', en: 'No vehicles registered.', es: 'Ningún vehículo registrado.' },
    licensePlate: { pt: 'Placa', en: 'License Plate', es: 'Placa' },
    brandExample: { pt: 'Marca (Ex: Chevrolet)', en: 'Brand (Ex: Chevrolet)', es: 'Marca (Ej: Chevrolet)' },
    modelExample: { pt: 'Modelo (Ex: Onix)', en: 'Model (Ex: Onix)', es: 'Modelo (Ej: Onix)' },
    plateExample: { pt: 'Placa (Ex: ABC-1234)', en: 'Plate (Ex: ABC-1234)', es: 'Placa (Ej: ABC-1234)' },
    add: { pt: 'Adicionar', en: 'Add', es: 'Añadir' },
    afterSaveNote: { pt: '* Após salvar o cliente, você poderá adicionar e gerenciar seus veículos editando o cadastro.', en: '* After saving the client, you can add and manage their vehicles by editing the profile.', es: '* Después de guardar al cliente, podrás añadir y gestionar sus vehículos editando el perfil.' }
  },
  forms: {
    providerLabel: { pt: 'FORNECEDOR', en: 'PROVIDER', es: 'PROVEEDOR' },
    providerPlaceholder: { pt: 'Nome do Fornecedor', en: 'Provider Name', es: 'Nombre del Proveedor' },
    select: { pt: 'Selecione', en: 'Select', es: 'Seleccione' },
    categoryOil: { pt: 'Óleo', en: 'Oil', es: 'Aceite' },
    categoryFilter: { pt: 'Filtro', en: 'Filter', es: 'Filtro' },
    categoryTire: { pt: 'Pneu', en: 'Tire', es: 'Neumático' },
    categoryBattery: { pt: 'Bateria', en: 'Battery', es: 'Batería' },
    categoryOther: { pt: 'Outro', en: 'Other', es: 'Otro' },
    detailedDescription: { pt: 'DESCRIÇÃO DETALHADA', en: 'DETAILED DESCRIPTION', es: 'DESCRIPCIÓN DETALLADA' },
    additionalInfo: { pt: 'Informações adicionais do produto', en: 'Additional product information', es: 'Información adicional del producto' }
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

console.log("Locales updated!");
