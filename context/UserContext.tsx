import { MOCK_USERS } from '@/lib/mock-data/users';
import { getStoredUsers, saveUsers, UserProfile } from '@/lib/storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface UserContextType {
  users: UserProfile[];
  loading: boolean;
  addUser: (user: Omit<UserProfile, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, user: Partial<UserProfile>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  isEmailDuplicate: (email: string, excludeId?: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    let data = await getStoredUsers();

    if (data.length === 0) {
      data = MOCK_USERS as UserProfile[];
      await saveUsers(data);
    }

    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const isEmailDuplicate = (email: string, excludeId?: string) => {
    return users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeId);
  };

  const addUser = async (user: Omit<UserProfile, 'id' | 'createdAt'>) => {
    if (isEmailDuplicate(user.email)) {
      throw new Error('Email already exists');
    }

    const newUser: UserProfile = {
      ...user,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    const currentUsers = await getStoredUsers();
    const updatedUsers = [newUser, ...currentUsers];
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
  };

  const updateUser = async (id: string, updatedFields: Partial<UserProfile>) => {
    if (updatedFields.email && isEmailDuplicate(updatedFields.email, id)) {
      throw new Error('Email already exists');
    }

    const currentUsers = await getStoredUsers();
    const updatedUsers = currentUsers.map(u =>
      u.id === id ? { ...u, ...updatedFields } : u
    );
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
  };

  const deleteUser = async (id: string) => {
    const currentUsers = await getStoredUsers();
    const updatedUsers = currentUsers.filter(u => u.id !== id);
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
  };

  return (
    <UserContext.Provider value={{ users, loading, addUser, updateUser, deleteUser, refresh: loadUsers, isEmailDuplicate }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
