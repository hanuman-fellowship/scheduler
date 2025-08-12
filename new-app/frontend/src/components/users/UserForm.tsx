import { useState, useEffect } from 'react';
import type { CreateUserRequest, UpdateUserRequest, UserRole, UserListResponse } from '@shared/types';
import { useAreas } from '../../hooks/useAreas';
import BoxyButton from '../ui/BoxyButton';

interface UserFormProps {
  user?: UserListResponse;
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'operations', label: 'Operations' },
  { value: 'manager', label: 'Manager' },
  { value: 'personnel', label: 'Personnel' }
];

export default function UserForm({ user, onSubmit, onCancel, isLoading = false, error }: UserFormProps) {
  const { areas } = useAreas();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    roles: user?.roles || ['personnel'] as UserRole[],
    areaIds: user?.areas?.map(a => a.id) || [] as number[]
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        roles: user.roles,
        areaIds: user.areas?.map(a => a.id) || []
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter(r => r !== role)
      }));
    }
  };

  const handleAreaChange = (areaId: number, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        areaIds: [...prev.areaIds, areaId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        areaIds: prev.areaIds.filter(id => id !== areaId)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username *
        </label>
        <input
          type="text"
          id="username"
          required
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roles *
        </label>
        <div className="space-y-2">
          {USER_ROLES.map((role) => (
            <label key={role.value} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.roles.includes(role.value)}
                onChange={(e) => handleRoleChange(role.value, e.target.checked)}
                className="mr-2"
                disabled={isLoading}
              />
              <span className="text-sm">{role.label}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.roles.includes('manager') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Managed Areas
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
            {areas.map((area) => (
              <label key={area.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.areaIds.includes(area.id)}
                  onChange={(e) => handleAreaChange(area.id, e.target.checked)}
                  className="mr-2"
                  disabled={isLoading}
                />
                <span className="text-sm">{area.name} ({area.shortName})</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select areas this manager will be responsible for
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <BoxyButton onClick={onCancel}>
          Cancel
        </BoxyButton>
        <BoxyButton onClick={handleSubmit}>
          {isLoading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
        </BoxyButton>
      </div>
    </form>
  );
}