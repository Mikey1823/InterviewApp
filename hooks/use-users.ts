import { useUserContext } from '@/context/UserContext';

export function useUsers() {
  return useUserContext();
}
