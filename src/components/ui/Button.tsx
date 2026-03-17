import React, { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', loading, disabled, className = '', ...props }, ref) => {
    const baseStyles = `
      w-full px-4 py-3 rounded-lg font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
      transition-colors duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantStyles = {
      primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
      secondary: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Chargement...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
