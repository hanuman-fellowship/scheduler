import { api } from './api';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  UserListResponse
} from '@shared/types';

export const usersService = {
  // Get all users (Operations only)
  getUsers: async (): Promise<UserListResponse[]> => {
    const { data } = await api.get('/users');
    return data;
  },

  // Get single user by ID
  getUserById: async (id: number): Promise<UserListResponse> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<UserListResponse & { tempPassword?: string }> => {
    const { data } = await api.post('/users', userData);
    return data;
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<UserListResponse> => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Reset user password
  resetPassword: async (email: string): Promise<{ user: UserListResponse; newPassword: string }> => {
    const { data } = await api.post('/users/reset-password', { email });
    return data;
  }
};