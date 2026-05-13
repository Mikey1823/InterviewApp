import React, { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';

export const Card = forwardRef<View, ViewProps & { className?: string }>(({ className, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={`bg-white rounded-[32px] p-6 shadow-2xl shadow-blue-500/5 border border-slate-100/50 ${className || ''}`}
      {...props}
    />
  );
});

Card.displayName = 'Card';
