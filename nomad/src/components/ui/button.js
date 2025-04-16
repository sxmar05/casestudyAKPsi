import React from 'react';
import './button.css';

export function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
} 