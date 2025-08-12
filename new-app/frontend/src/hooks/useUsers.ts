import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users';
import type { CreateUserRequest, UpdateUserRequest } from '@shared/types';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Get all users
  const {
    data: users = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getUsers,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserRequest) => usersService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UpdateUserRequest }) =>
      usersService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => usersService.resetPassword(email),
  });

  return {
    users,
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    createError: createUserMutation.error,
    updateError: updateUserMutation.error,
    deleteError: deleteUserMutation.error,
    resetError: resetPasswordMutation.error,
    createUserMutation,
    updateUserMutation,
    resetPasswordMutation,
  };
};