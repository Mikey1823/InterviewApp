import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { useUsers } from '@/hooks/use-users';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const ROLES = ['Rider', 'Merchant', 'Local Seller'] as const;
const PH_PHONE_REGEX = /^(09|\+639)\d{9}$/;

export default function AddUserScreen() {
  const { addUser, isEmailDuplicate } = useUsers();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Rider' as typeof ROLES[number],
    address: '',
    avatar: '',
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

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
    } else if (isEmailDuplicate(form.email.trim())) {
      newErrors.email = 'This email is already registered';
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

  const confirmSubmit = () => {
    if (validate()) {
      setShowConfirm(true);
    }
  };

  const handleFinalSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await addUser({
        ...form,
        email: form.email.trim(),
        phone: form.phone.trim().replace(/\s/g, ''),
      });
      router.back();
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e.message || "Something went wrong.");
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
        <View className="flex-row justify-between items-center mb-8">
           <Typography variant="h2">Create Account</Typography>
           <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 p-2 rounded-full">
              <X size={20} color="#6B7280" />
           </TouchableOpacity>
        </View>
        
        <View className="items-center mb-10">
           <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <View className="w-32 h-32 bg-primary/5 rounded-full items-center justify-center border-2 border-dashed border-primary/20 overflow-hidden">
                {form.avatar ? (
                  <Image source={{ uri: form.avatar }} className="w-full h-full" />
                ) : (
                  <>
                    <Camera size={32} color="#125BFB" />
                    <Typography variant="small" className="text-primary font-bold mt-1">Add Photo</Typography>
                  </>
                )}
              </View>
           </TouchableOpacity>
        </View>

        <Input 
          label="Full Name *" 
          placeholder="e.g. John Doe" 
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          error={errors.name}
        />

        <Input 
          label="Email Address *" 
          placeholder="e.g. john@lork.app" 
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
          placeholder="e.g. 123 Main St, City" 
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
            label={loading ? "Creating..." : "Create Account"} 
            className="h-14"
            onPress={confirmSubmit}
            disabled={loading}
          />
          
          <Button 
            variant="ghost" 
            label="Cancel" 
            className="mt-2"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>

      {/* Custom Confirmation Modal for better Web compatibility */}
      <Modal
        transparent
        visible={showConfirm}
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <Typography variant="h2" className="mb-2 text-center">Confirm Creation</Typography>
            <Typography variant="body" className="mb-8 text-center text-gray-500">Are you sure you want to create this account?</Typography>
            
            <View className="gap-y-3">
              <Button label="Yes, Create Account" onPress={handleFinalSubmit} className="h-14" />
              <Button variant="ghost" label="Cancel" onPress={() => setShowConfirm(false)} className="h-14" />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
