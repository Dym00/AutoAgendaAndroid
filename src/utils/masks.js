export const maskPhone = (value) => {
  if (!value) return '';
  value = String(value).replace(/\D/g, '');
  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (value.length > 0) {
    value = value.replace(/^(\d{0,2})/, '($1');
  }
  return value;
};

export const maskCNPJ = (value) => {
  if (!value) return '';
  value = String(value).replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');
  return value.substring(0, 18);
};

export const maskCPF = (value) => {
  if (!value) return '';
  value = String(value).replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return value.substring(0, 14);
};

export const maskCurrency = (value) => {
  if (value === undefined || value === null) return '';
  
  let numString = String(value).replace(/\D/g, '');
  if (numString === '') return '';
  
  let num = parseInt(numString, 10);
  if (isNaN(num)) return '';

  let floatValue = num / 100;
  
  let formatted = floatValue.toFixed(2).replace('.', ',');
  formatted = formatted.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  
  return `R$ ${formatted}`;
};

export const unmaskCurrency = (value) => {
  if (!value) return 0;
  const numString = String(value).replace(/\D/g, '');
  return parseInt(numString, 10) / 100;
};

export const maskPlate = (value) => {
  if (!value) return '';
  value = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (value.length > 3) {
    value = value.substring(0, 3) + '-' + value.substring(3, 7);
  }
  return value.substring(0, 8);
};

export const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false;
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;
  
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;
  
  return true;
};

export const isValidCPF = (cpf) => {
  if (!cpf) return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};
