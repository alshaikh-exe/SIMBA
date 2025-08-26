//Zahraa
// import React from "react";

// const Button = ({ children, onClick, type = "button", disabled = false, variant = "primary" }) => {
//   const baseStyle = {
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "4px",
//     cursor: disabled ? "not-allowed" : "pointer",
//     opacity: disabled ? 0.6 : 1
//   };

//   const variants = {
//     primary: { backgroundColor: "#007bff", color: "white" },
//     secondary: { backgroundColor: "#6c757d", color: "white" },
//     danger: { backgroundColor: "#dc3545", color: "white" }
//   };

//   const style = { ...baseStyle, ...variants[variant] };

//   return (
//     <button type={type} onClick={onClick} disabled={disabled} style={style}>
//       {children}
//     </button>
//   );
// };

// export default Button;
// src/components/Button/Button.jsx
import React from 'react';
import './Button.module.scss';

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