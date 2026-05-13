import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'muted';
  className?: string;
}

export function Typography({ variant = 'body', className, ...props }: TypographyProps) {
  const variants = {
    h1: 'text-3xl font-bold font-dmSans text-primary',
    h2: 'text-2xl font-bold font-dmSans text-primary',
    h3: 'text-xl font-semibold font-dmSans text-primary',
    body: 'text-base font-normal font-roboto text-gray-800',
    small: 'text-sm font-normal font-roboto text-gray-600',
    muted: 'text-sm font-normal font-roboto text-gray-400',
  };

  return <Text className={`${variants[variant]} ${className || ''}`} {...props} />;
}
