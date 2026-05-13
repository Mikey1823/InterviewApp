import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children?: React.ReactNode;
  className?: string;
}

export function Button({ label, variant = 'primary', className, children, ...props }: ButtonProps) {
  const bgColors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border border-primary',
    ghost: 'bg-transparent',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary',
    ghost: 'text-primary',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`px-6 py-3 rounded-xl flex-row justify-center items-center ${bgColors[variant]} ${className || ''} ${props.disabled ? 'opacity-50' : ''}`}
      {...props}
    >
      {children}
      {label && (
        <Typography variant="body" className={`font-bold ${textColors[variant]} ${children ? 'ml-2' : ''}`}>
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
}
