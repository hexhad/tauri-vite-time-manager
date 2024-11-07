import React from 'react';
import './styles/radio-input-module-styles.scss';

const RadioButton = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  size = 'medium', // small, medium, large
  color = 'primary', // primary, secondary, success, danger
}) => {
  return (
    <div className={`radio-container ${className} ${disabled ? 'disabled' : ''}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`radio-input ${size} ${color}`}
      />
      <label htmlFor={id} className={`radio-label ${size}`}>
        <span className="radio-button"></span>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;