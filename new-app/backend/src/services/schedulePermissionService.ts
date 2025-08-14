import prisma from './prisma';
import type { UserRole } from '@shared/types';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
}

/**
 * Check if a schedule is editable by the given user
 * Based on legacy redirectIfNotEditable() logic:
 * - Operations users can always edit
 * - Managers can only edit draft requests (request=2) 
 * - Personnel cannot edit schedules
 */
export const isScheduleEditable = async (scheduleId: number, user: AuthUser): Promise<boolean> => {
  // Operations users can edit any schedule
  if (user.roles.includes('operations')) {
    return true;
  }
  
  // Personnel users cannot edit schedules
  if (!user.roles.includes('manager')) {
    return false;
  }
  
  // Managers can only edit draft requests (request=2)
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    select: { request: true }
  });
  
  if (!schedule) {
    return false;
  }
  
  // Managers can edit draft requests (request=2)
  return schedule.request === 2;
};

/**
 * Validate that a user can perform shift operations on a schedule
 * Throws an error if not allowed
 */
export const requireScheduleEditPermission = async (scheduleId: number, user: AuthUser): Promise<void> => {
  const canEdit = await isScheduleEditable(scheduleId, user);
  
  if (!canEdit) {
    if (user.roles.includes('manager')) {
      throw new Error('Managers can only create shifts on draft requests');
    } else {
      throw new Error('Access denied');
    }
  }
};