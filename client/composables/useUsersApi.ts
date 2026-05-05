import { useApi } from './useApi';

export type User = {
  _id: string;
  name: string;
  email?: string;
};

export function useUsersApi() {
  const api = useApi();

  return {
    getUsers: () => api.get<User[]>('/users'),
  };
}
