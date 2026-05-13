import React, { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Typography } from './ui/Typography';
import { UserProfile } from '@/lib/storage';
import { Link } from 'expo-router';
import { ChevronRight, Calendar } from 'lucide-react-native';

interface UserCardProps {
  user: UserProfile;
  index: number;
}

export function UserCard({ user, index }: UserCardProps) {
  const containerRef = useRef<View>(null);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20, scale: 0.95 }, 
        { 
          opacity: 1, 
          y: 0,
          scale: 1, 
          duration: 0.8, 
          delay: index * 0.1, 
          ease: 'power3.out' 
        }
      );
    }
  }, [index]);

  return (
    <Link href={`/profile/${user.id}`} asChild>
      <TouchableOpacity activeOpacity={0.9} className="mb-4">
        <Card ref={containerRef} className="flex-row items-center p-5 border-blue-50/50">
          <Avatar src={user.avatar} fallback={user.name} size={64} />
          
          <View className="ml-5 flex-1">
            <Typography variant="h3" className="text-lg font-bold text-slate-900 tracking-tight mb-0.5">
              {user.name}
            </Typography>
            
            <Typography variant="muted" className="text-sm mb-3" numberOfLines={1}>
              {user.email}
            </Typography>
            
            <View className="flex-row items-center">
              <Calendar size={12} color="#94A3B8" />
              <Typography variant="small" className="text-[11px] text-slate-400 ml-1 font-medium">
                Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </Typography>
            </View>
          </View>
          
          {/* Right-aligned actions container for Role Tag and Arrow Icon alignment */}
          <View className="flex-row items-center ml-4">
            <View className="bg-primary/5 px-3 py-1.5 rounded-xl mr-3 border border-primary/10">
              <Typography variant="small" className="text-primary text-[10px] font-black uppercase tracking-wider">
                {user.role}
              </Typography>
            </View>
            
            <View className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-sm">
               <ChevronRight size={20} color="#125BFB" strokeWidth={3} />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Link>
  );
}
