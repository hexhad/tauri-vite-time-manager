import React from 'react';
import './styles/input-button-style.scss';

const CustomButton = ({ children, onClick, className = '', ...props }) => {
  return (
    <button 
      className={`button-container ${className}`} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
