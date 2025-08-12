import { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import Modal from '../components/ui/Modal';
import BoxyButton from '../components/ui/BoxyButton';
import type { UserListResponse, CreateUserRequest, UpdateUserRequest } from '@shared/types';

type ModalMode = 'create' | 'edit' | 'password-reset' | null;

export default function UsersPage() {
  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    isCreating,
    isUpdating,
    isResettingPassword,
    createError,
    updateError,
    resetError,
    createUserMutation,
    updateUserMutation,
  } = useUsers();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
  const [passwordResetResult, setPasswordResetResult] = useState<string | null>(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
  };

  const handleEditUser = (user: UserListResponse) => {
    setSelectedUser(user);
    setModalMode('edit');
  };

  const handleResetPassword = (user: UserListResponse) => {
    setSelectedUser(user);
    setModalMode('password-reset');
    resetPassword(user.email);
  };

  const handleSubmitUser = (userData: CreateUserRequest | UpdateUserRequest) => {
    if (modalMode === 'create') {
      createUser(userData as CreateUserRequest);
    } else if (modalMode === 'edit' && selectedUser) {
      updateUser({ id: selectedUser.id, userData: userData as UpdateUserRequest });
    }
  };

  // Handle successful mutations
  useEffect(() => {
    if (createUserMutation.isSuccess && createUserMutation.data) {
      setPasswordResetResult(
        `User created successfully! Temporary password: ${createUserMutation.data.tempPassword || '[Password not shown]'}`
      );
      setModalMode(null);
    }
  }, [createUserMutation.isSuccess, createUserMutation.data]);

  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      setModalMode(null);
    }
  }, [updateUserMutation.isSuccess]);

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case 'create':
        return 'Create New User';
      case 'edit':
        return 'Edit User';
      case 'password-reset':
        return 'Password Reset';
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <BoxyButton onClick={handleCreateUser}>
          Create User
        </BoxyButton>
      </div>

      {/* Password reset success message */}
      {passwordResetResult && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Success!</p>
              <p className="text-sm mt-1">{passwordResetResult}</p>
              <p className="text-xs mt-2 text-green-600">
                Make sure to save this password - it won't be shown again.
              </p>
            </div>
            <button
              onClick={() => setPasswordResetResult(null)}
              className="text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-medium">Error loading users:</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* User list */}
      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={(user) => {
          if (confirm(`Are you sure you want to delete ${user.username}?`)) {
            deleteUser(user.id);
          }
        }}
        onResetPassword={handleResetPassword}
        isLoading={isLoading}
      />

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        title={getModalTitle()}
      >
        <UserForm
          user={selectedUser || undefined}
          onSubmit={handleSubmitUser}
          onCancel={closeModal}
          isLoading={isCreating || isUpdating}
          error={createError || updateError}
        />
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        isOpen={modalMode === 'password-reset'}
        onClose={closeModal}
        title="Password Reset"
      >
        <div className="space-y-4">
          {isResettingPassword ? (
            <p>Resetting password for <strong>{selectedUser?.username}</strong>...</p>
          ) : resetError ? (
            <>
              <p className="text-red-600">
                Failed to reset password: {resetError.message}
              </p>
              <div className="flex justify-end">
                <BoxyButton onClick={closeModal}>Close</BoxyButton>
              </div>
            </>
          ) : (
            <>
              <p className="text-green-600">
                Password reset successfully for <strong>{selectedUser?.username}</strong>!
              </p>
              <p className="text-sm text-gray-600">
                A new temporary password has been generated. The user should change it on next login.
              </p>
              <div className="flex justify-end">
                <BoxyButton onClick={closeModal}>Close</BoxyButton>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}