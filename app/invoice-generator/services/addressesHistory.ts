import { Address } from '../types';

// Tipos de direcciones
export type AddressType = 'emitter' | 'customer';

// Claves de almacenamiento para cada tipo
const STORAGE_KEYS = {
  emitter: 'emittersHistory',
  customer: 'customersHistory'
};

const MAX_ADDRESSES = 50; // Limitar a 50 direcciones por tipo

// Obtiene el historial de direcciones del localStorage por tipo
export const getAddressesHistory = (type: AddressType): Address[] => {
  if (typeof window === 'undefined') return [];
  
  const storageKey = STORAGE_KEYS[type];
  const savedHistory = localStorage.getItem(storageKey);
  return savedHistory ? JSON.parse(savedHistory) : [];
};

// Añade o actualiza una dirección en el historial correspondiente
export const saveAddressToHistory = (address: Address, type: AddressType): void => {
  if (typeof window === 'undefined' || !address.name.trim()) return;
  
  const storageKey = STORAGE_KEYS[type];
  let currentHistory = getAddressesHistory(type);
  
  // Buscar si la dirección ya existe (por NIF o por nombre si no hay NIF)
  const existingAddressIndex = currentHistory.findIndex(a => 
    (address.nif && a.nif === address.nif) || 
    (!address.nif && a.name === address.name)
  );
  
  if (existingAddressIndex >= 0) {
    // Eliminar la dirección existente de su posición actual
    currentHistory.splice(existingAddressIndex, 1);
  }
  
  // Añadir la dirección al principio del array (más reciente primero)
  currentHistory.unshift(address);
  
  // Limitar el número de direcciones
  if (currentHistory.length > MAX_ADDRESSES) {
    currentHistory = currentHistory.slice(0, MAX_ADDRESSES);
  }
  
  // Guardar historial actualizado
  localStorage.setItem(storageKey, JSON.stringify(currentHistory));
};

// Busca direcciones que coincidan con un término de búsqueda
export const searchAddresses = (searchTerm: string, type: AddressType): Address[] => {
  if (!searchTerm.trim()) return [];
  
  const addresses = getAddressesHistory(type);
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return addresses.filter(address => 
    address.name.toLowerCase().includes(lowerSearchTerm) ||
    (address.nif && address.nif.toLowerCase().includes(lowerSearchTerm))
  );
};

// Para mantener compatibilidad con el código existente
export const getCustomersHistory = (): Address[] => getAddressesHistory('customer');
export const saveCustomerToHistory = (customer: Address): void => saveAddressToHistory(customer, 'customer');
export const searchCustomers = (searchTerm: string): Address[] => searchAddresses(searchTerm, 'customer'); 