//Zahraa
// src/components/Button/Button.jsx
import React from 'react';
import './Button.scss';

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    loading && 'button--loading',
    disabled && 'button--disabled',
    fullWidth && 'button--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="button__spinner"></div>}
      <span className={`button__content ${loading ? 'button__content--hidden' : ''}`}>
        {children}
      </span>
    </button>
  );
}