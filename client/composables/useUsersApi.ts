import { useApi } from './useApi';

export type User = {
  _id: string;
  name: string;
  email?: string;
};

export type CreateUserPayload = {
  name: string;
  email?: string;
};

export function useUsersApi() {
  const api = useApi();

  return {
    getUsers: () => api.get<User[]>('/users'),
    createUser: (payload: CreateUserPayload) => api.post<User>('/users', payload),
  };
}
