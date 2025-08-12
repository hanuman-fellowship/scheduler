import { useState } from 'react';
import type { UserListResponse } from '@shared/types';
import BoxyButton from '../ui/BoxyButton';
import Modal from '../ui/Modal';

interface UserListProps {
  users: UserListResponse[];
  onEdit: (user: UserListResponse) => void;
  onDelete: (user: UserListResponse) => void;
  onResetPassword: (user: UserListResponse) => void;
  isLoading?: boolean;
}

export default function UserList({ 
  users, 
  onEdit, 
  onDelete, 
  onResetPassword, 
  isLoading = false 
}: UserListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<UserListResponse | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const getRoleBadges = (roles: string[]) => {
    const roleColors = {
      operations: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      personnel: 'bg-green-100 text-green-800'
    };

    return roles.map(role => (
      <span
        key={role}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {role}
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                Username
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                Roles
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                Areas
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  {user.username}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {getRoleBadges(user.roles)}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.areas && user.areas.length > 0 ? (
                    <div className="text-sm">
                      {user.areas.map(area => area.shortName).join(', ')}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">None</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onResetPassword(user)}
                      className="text-orange-600 hover:text-orange-800 text-sm"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete user <strong>{deleteConfirm?.username}</strong>?
          </p>
          <p className="text-sm text-red-600">
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <BoxyButton onClick={() => setDeleteConfirm(null)}>
              Cancel
            </BoxyButton>
            <BoxyButton onClick={handleDeleteConfirm}>
              Delete User
            </BoxyButton>
          </div>
        </div>
      </Modal>
    </>
  );
}