import api from './api';
import {
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
} from '@shared/types';

interface CreateUserResponse extends UserListResponse {
  tempPassword?: string;
}

interface ResetPasswordResponse {
  message: string;
  newPassword?: string;
  user: UserListResponse;
}

export const userService = {
  // Get all users
  async getUsers(): Promise<UserListResponse[]> {
    const { data } = await api.get('/users');
    return data;
  },

  // Get single user by ID
  async getUser(id: number): Promise<UserListResponse> {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const { data } = await api.post('/users', userData);
    return data;
  },

  // Update user
  async updateUser(id: number, userData: UpdateUserRequest): Promise<UserListResponse> {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Reset user password
  async resetPassword(email: string): Promise<ResetPasswordResponse> {
    const { data } = await api.post('/users/reset-password', { email } as ResetPasswordRequest);
    return data;
  },
};