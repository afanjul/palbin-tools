import { useState, useEffect, useRef } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { Address } from '../types';
import { searchAddresses, AddressType } from '../services/addressesHistory';
import './AddressAutocomplete.css';

interface AddressAutocompleteProps {
  id: string;
  value: string;
  onChange: (address: Address) => void;
  currentAddress: Address;
  label: string;
  addressType: AddressType;
}

export function AddressAutocomplete({ 
  id, 
  value, 
  onChange,
  currentAddress, 
  label,
  addressType
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Actualizar el valor de entrada cuando cambia el valor de la prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cerrar la lista de sugerencias al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Actualizar el nombre de la dirección actual
    onChange({ ...currentAddress, name: value });
    
    // Buscar sugerencias
    if (value.trim().length > 1) {
      const results = searchAddresses(value, addressType);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Seleccionar una sugerencia
  const handleSelectSuggestion = (address: Address) => {
    onChange(address);
    setInputValue(address.name);
    setShowSuggestions(false);
  };

  return (
    <div className="position-relative" ref={wrapperRef}>
      <Form.Floating>
        <Form.Control
          type="text"
          id={id}
          placeholder={label}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
          autoComplete="off"
        />
        <label htmlFor={id}>{label}</label>
      </Form.Floating>
      
      {showSuggestions && (
        <ListGroup className="address-autocomplete-suggestions">
          {suggestions.map((address, index) => (
            <ListGroup.Item 
              key={index} 
              action 
              onClick={() => handleSelectSuggestion(address)}
              className="address-suggestion-item"
            >
              <div className="address-suggestion-name">{address.name}</div>
              {address.nif && <div className="address-suggestion-nif">{address.nif}</div>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
} 