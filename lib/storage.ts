import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@lork_users';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Rider' | 'Merchant' | 'Local Seller';
  address: string;
  avatar: string;
  createdAt: string;
}

export const getStoredUsers = async (): Promise<UserProfile[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading users', e);
    return [];
  }
};

export const saveUsers = async (users: UserProfile[]) => {
  try {
    const jsonValue = JSON.stringify(users);
    await AsyncStorage.setItem(USERS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving users', e);
  }
};
