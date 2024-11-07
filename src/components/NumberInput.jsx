import React, { useState } from 'react';
import './styles/input-picker-styles.scss';

const NumberInput = ({ 
  min = 0,
  max = 59,
  placeholder = '00',
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ariaLabel = 'Number input'
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (newValue === '' || (
      !isNaN(newValue) && 
      Number(newValue) >= min && 
      Number(newValue) <= max
    )) {
      setLocalValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleBlur = () => {
    if (localValue !== '' && Number(localValue) < 10) {
      const paddedValue = localValue.padStart(2, '0');
      setLocalValue(paddedValue);
      onChange?.(paddedValue);
    }
  };

  return (
    <div className="number-input-container">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`
          number-input-field
          ${error ? 'number-input-error' : ''}
          ${className}
        `}
      />
    </div>
  );
};

export default NumberInput;