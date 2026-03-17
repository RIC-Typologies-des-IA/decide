import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
