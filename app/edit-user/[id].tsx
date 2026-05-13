import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Alert } from 'react-native';
import { useUsers } from '@/hooks/use-users';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Camera, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const ROLES = ['Rider', 'Merchant', 'Local Seller'] as const;
const PH_PHONE_REGEX = /^(09|\+639)\d{9}$/;

export default function EditUserScreen() {
  const { id } = useLocalSearchParams();
  const { users, updateUser, isEmailDuplicate } = useUsers();
  const router = useRouter();
  const user = users.find(u => u.id === id);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Rider' as typeof ROLES[number],
    address: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        avatar: user.avatar,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Typography variant="body">User not found.</Typography>
        <Button label="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Updated from deprecation
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0].uri });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Fullname is required';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (isEmailDuplicate(form.email.trim(), id as string)) {
      newErrors.email = 'This email is already in use by another account';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!PH_PHONE_REGEX.test(form.phone.trim().replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid PH format (e.g. 09123456789)';
    }

    if (!form.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await updateUser(id as string, {
        ...form,
        email: form.email.trim(),
        phone: form.phone.trim().replace(/\s/g, ''),
      });
      router.back();
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row items-center mb-8">
           <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color="#125BFB" />
           </TouchableOpacity>
           <Typography variant="h2">Edit Account</Typography>
        </View>
        
        <View className="items-center mb-10">
           <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <View className="w-32 h-32 bg-primary/5 rounded-full items-center justify-center border-2 border-dashed border-primary/20 overflow-hidden">
                {form.avatar ? (
                  <Image source={{ uri: form.avatar }} className="w-full h-full" />
                ) : (
                  <>
                    <Camera size={32} color="#125BFB" />
                    <Typography variant="small" className="text-primary font-bold mt-1">Change Photo</Typography>
                  </>
                )}
              </View>
           </TouchableOpacity>
        </View>

        <Input 
          label="Full Name *" 
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          error={errors.name}
        />

        <Input 
          label="Email Address *" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          error={errors.email}
        />

        <Input 
          label="Phone Number (PH) *" 
          placeholder="e.g. 09123456789"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
          error={errors.phone}
        />

        <View className="mb-6">
          <Typography variant="small" className="mb-1 font-semibold">Role *</Typography>
          <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex-row">
            {ROLES.map((role) => (
              <TouchableOpacity 
                key={role}
                onPress={() => setForm({ ...form, role })}
                className={`flex-1 py-3 items-center justify-center ${form.role === role ? 'bg-primary' : ''}`}
              >
                <Typography 
                  variant="small" 
                  className={`font-bold ${form.role === role ? 'text-white' : 'text-gray-500'}`}
                >
                  {role}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input 
          label="Address *" 
          multiline 
          numberOfLines={3}
          textAlignVertical="top"
          className="h-24 pt-3"
          value={form.address}
          onChangeText={(text) => setForm({ ...form, address: text })}
          error={errors.address}
        />

        <View className="mt-8">
          <Button 
            label={loading ? "Updating..." : "Save Changes"} 
            className="h-14"
            onPress={handleSubmit}
            disabled={loading}
          />
          
          <Button 
            variant="ghost" 
            label="Discard Changes" 
            className="mt-2"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
