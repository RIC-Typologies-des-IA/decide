import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg border bg-white
            placeholder:text-gray-400 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
            transition-colors duration-200
            ${error ? 'border-red-500' : 'border-gray-200'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
