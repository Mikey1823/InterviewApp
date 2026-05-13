import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Typography variant="small" className="mb-1 font-semibold">{label}</Typography>}
      <TextInput
        className={`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-roboto text-base ${error ? 'border-red-500' : 'focus:border-primary'} ${className || ''}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Typography variant="small" className="mt-1 text-red-500">{error}</Typography>}
    </View>
  );
}
