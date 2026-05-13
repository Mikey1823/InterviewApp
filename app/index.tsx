import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useUsers } from '@/hooks/use-users';
import { UserCard } from '@/components/UserCard';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Plus, Search as SearchIcon, XCircle } from 'lucide-react-native';

export default function UserListScreen() {
  const { users, loading, refresh } = useUsers();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce logic
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
    }
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filter users based on debounced query
  const filteredUsers = useMemo(() => {
    return users.filter((user) => 
      user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [users, debouncedQuery]);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-14 px-6 pb-4">
        <Typography variant="h1" className="mb-1">Profiles</Typography>
        <Typography variant="muted" className="mb-6">Manage your luxury user base</Typography>
        
        <View className="relative justify-center h-14 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
          <View className="absolute left-4 z-10 h-full justify-center">
            {isSearching ? (
              <ActivityIndicator size="small" color="#125BFB" />
            ) : (
              <SearchIcon size={18} color="#94A3B8" />
            )}
          </View>
          <TextInput 
            placeholder="Search name, email or role..." 
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 pl-12 pr-12 font-roboto text-base h-full"
            style={Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}}
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              className="absolute right-4 h-full justify-center" 
              onPress={() => setSearchQuery('')}
            >
              <XCircle size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <UserCard user={item} index={index} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center mt-20 px-10">
              <Typography variant="body" className="text-gray-400 mb-6 text-center">
                {searchQuery ? `No results found for "${searchQuery}"` : "No users found. Start by adding a new profile."}
              </Typography>
              {!searchQuery && (
                <Button 
                  label="Add Your First User" 
                  onPress={() => router.push('/add-user')} 
                />
              )}
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#125BFB" />
        }
      />

      <View className="absolute bottom-10 right-6 shadow-2xl">
        <Button
          className="w-16 h-16 rounded-full p-0 items-center justify-center"
          onPress={() => router.push('/add-user')}
        >
           <Plus color="white" size={32} strokeWidth={2.5} />
        </Button>
      </View>
    </View>
  );
}
