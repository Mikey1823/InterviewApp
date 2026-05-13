import React from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUsers } from '@/hooks/use-users';
import { Avatar } from '@/components/ui/Avatar';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Trash2, Mail, Calendar, MapPin, Phone, Briefcase, Edit3, ArrowLeft } from 'lucide-react-native';

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const { users, deleteUser } = useUsers();
  const router = useRouter();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Typography variant="body" className="mb-4">Oops! User not found.</Typography>
        <Button label="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete this profile? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            await deleteUser(user.id);
            router.back();
          } 
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-primary/5 h-56 items-center justify-center">
        <View className="absolute top-12 left-6 right-6 flex-row justify-between z-10">
          <TouchableOpacity onPress={() => router.back()} className="bg-white/80 p-2 rounded-full">
            <ArrowLeft size={20} color="#125BFB" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push(`/edit-user/${user.id}`)} 
            className="bg-white/80 p-2 rounded-full"
          >
            <Edit3 size={20} color="#125BFB" />
          </TouchableOpacity>
        </View>
        <Avatar src={user.avatar} fallback={user.name} size={140} className="border-4 border-white shadow-2xl" />
      </View>
      
      <View className="px-6 bg-white rounded-t-[40px] pt-10 min-h-screen mt-4">
        <Typography variant="h1" className="text-center mb-1">{user.name}</Typography>
        <Typography variant="body" className="text-center text-primary/60 font-medium mb-6">{user.role}</Typography>
        
        <View className="flex-row justify-between mb-8 px-4">
           <View className="items-center">
              <View className="bg-gray-50 p-3 rounded-2xl mb-2">
                 <Mail size={20} color="#125BFB" />
              </View>
              <Typography variant="small" className="font-semibold">Email</Typography>
           </View>
           <View className="items-center">
              <View className="bg-gray-50 p-3 rounded-2xl mb-2">
                 <Briefcase size={20} color="#125BFB" />
              </View>
              <Typography variant="small" className="font-semibold">Role</Typography>
           </View>
           <View className="items-center">
              <View className="bg-gray-50 p-3 rounded-2xl mb-2">
                 <Calendar size={20} color="#125BFB" />
              </View>
              <Typography variant="small" className="font-semibold">Joined</Typography>
           </View>
        </View>

        <Card className="mb-8">
          <Typography variant="h3" className="mb-3">Account Details</Typography>
          <View className="space-y-4">
            <View className="flex-row items-center mb-4">
              <View className="w-8">
                <Phone size={18} color="#9CA3AF" />
              </View>
              <Typography variant="body" className="ml-1 font-medium">{user.phone}</Typography>
            </View>
            <View className="flex-row items-center mb-4">
              <View className="w-8">
                <Mail size={18} color="#9CA3AF" />
              </View>
              <Typography variant="body" className="ml-1 font-medium">{user.email}</Typography>
            </View>
            <View className="flex-row items-center mb-4">
              <View className="w-8">
                <Briefcase size={18} color="#9CA3AF" />
              </View>
              <Typography variant="body" className="ml-1 font-medium">{user.role}</Typography>
            </View>
            <View className="flex-row items-start">
              <View className="w-8 mt-1">
                <MapPin size={18} color="#9CA3AF" />
              </View>
              <Typography variant="body" className="ml-1 font-medium flex-1">{user.address}</Typography>
            </View>
          </View>
        </Card>

        <View className="space-y-4">
          <Card className="flex-row items-center justify-between border-primary/10 mb-4">
             <View className="flex-row items-center">
                <Calendar size={18} color="#9CA3AF" />
                <Typography variant="body" className="ml-3 font-medium">
                  {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
             </View>
          </Card>
        </View>

        <Button 
          variant="outline" 
          className="mt-12 border-red-100 bg-red-50/30"
          onPress={handleDelete}
        >
           <Trash2 color="#EF4444" size={20} />
           <Typography variant="body" className="text-red-500 font-bold ml-2">Delete Account</Typography>
        </Button>
        <View className="h-20" />
      </View>
    </ScrollView>
  );
}
