import React from 'react';
import { View, Image } from 'react-native';
import { Typography } from './Typography';

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, fallback, size = 56, className }: AvatarProps) {
  return (
    <View className="relative">
      <View 
        className={`bg-primary/10 items-center justify-center rounded-2xl overflow-hidden border-2 border-white shadow-sm ${className || ''}`}
        style={{ width: size, height: size }}
      >
        {src ? (
          <Image 
            source={{ uri: src }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Typography variant="h3" className="text-primary font-bold uppercase">
            {fallback.substring(0, 1)}
          </Typography>
        )}
      </View>
      <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
    </View>
  );
}
