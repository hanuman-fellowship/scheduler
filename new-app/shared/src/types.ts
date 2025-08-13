// All shared types for the scheduler app
import { z } from 'zod';

// Export time utilities for use throughout the app
export * from './timeUtils';
import type { TimePeriodName } from './timeUtils';

// ============================================================================
// Auth Types
// ============================================================================

export type UserRole = 'operations' | 'manager' | 'personnel';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  error: {
    message: string;
    field?: string;
    code: string;
  };
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
}

export interface ScheduleResponse {
  id: number;
  name: string;
  request: 0 | 1 | 2; // 0=normal, 1=submitted, 2=draft
  template: boolean;
  createdAt: string;
}

export interface SchedulesResponse {
  mine: ScheduleResponse[];
  all?: ScheduleResponse[]; // if operations role
}

export interface PersonResponse {
  id: number;
  first: string;
  last: string;
  displayName?: string; // Optional display name from database
  name: string; // computed display name
  category: {
    id: number;
    name: string;
    color: string;
  };
}

export interface AreaResponse {
  id: number;
  name: string;
  shortName: string;
  shifts: ShiftResponse[];
  floatingShifts: FloatingShiftResponse[];
}

export interface ShiftResponse {
  id: number;
  areaId: number;
  dayId: number;
  startAtSeconds: number; // Seconds since midnight (0-86399)
  endAtSeconds: number;   // Seconds since midnight (0-86399)
  numPeople: number;
}

export interface FloatingShiftResponse {
  id: number;
  areaId: number;
  personId: number;
  hours: number;
}

export interface DayResponse {
  id: number;
  name: string;
  date: string | null;
  dayOfWeek: number;
}

// ============================================================================
// Request Types (for forms/user input)
// ============================================================================

export interface CreateUserRequest {
  username: string;
  email: string;
  roles: UserRole[];
  areaIds?: number[];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  roles?: UserRole[];
  areaIds?: number[];
}

export interface DeleteUserRequest {
  id: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UserListResponse {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
  areas?: AreaResponse[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Category Types
// ============================================================================

export interface CategoryResponse {
  id: number;
  name: string;
  color: string;
  scheduleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
}

export const CreateCategoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code'),
});

export interface CopyScheduleRequest {
  sourceId: number;
  name: string;
}

export interface CreateShiftRequest {
  areaId: number;
  dayId: number;
  startAtSeconds: number; // Seconds since midnight
  endAtSeconds: number;   // Seconds since midnight
  numPeople: number;
}

export interface CreateAssignmentRequest {
  shiftId: number;
  personId: number | null; // null for "other"
  name?: string; // if personId = null
}

export interface UpdateAssignmentRequest {
  personId?: number | null;
  name?: string;
  star?: boolean;
}

// ============================================================================
// Validation Schemas (simple, only for user forms)
// ============================================================================

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const ChangePasswordRequestSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const CreateShiftFormSchema = z.object({
  startAtSeconds: z.number().min(0).max(86399), // 0-86399 seconds in a day
  endAtSeconds: z.number().min(0).max(86399),
  numPeople: z.number().min(1),
});

export const CopyScheduleFormSchema = z.object({
  name: z.string().min(1),
});

export const CreateUserFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Valid email is required'),
  roles: z.array(z.enum(['operations', 'manager', 'personnel'])).min(1, 'At least one role is required'),
  areaIds: z.array(z.number()).optional(),
});

export const UpdateUserFormSchema = z.object({
  username: z.string().min(1, 'Username is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  roles: z.array(z.enum(['operations', 'manager', 'personnel'])).min(1, 'At least one role is required').optional(),
  areaIds: z.array(z.number()).optional(),
});

export const ResetPasswordFormSchema = z.object({
  email: z.string().email('Valid email is required'),
});

// ============================================================================
// Schedule View Types
// ============================================================================

export interface TimePeriod {
  name: TimePeriodName;
  startSeconds: number; // Start boundary in seconds since midnight
  endSeconds: number;   // End boundary in seconds since midnight
}

export interface ScheduleBounds {
  days: { [key: number]: string }; // { 1: "Sunday", 2: "Monday", ... }
  timePeriods: TimePeriod[]; // 3 hardcoded periods: Morning, Afternoon, Evening
}

export interface HoursByDay {
  [dayId: number]: number;
}

export interface AssignmentResponse {
  id: number;
  shiftId: number;
  personId: number | null;
  name?: string;
  star: boolean;
  person?: {
    id: number;
    first: string;
    last: string;
    name?: string;
    displayName?: string;
    category?: {
      id: number;
      name: string;
      color: string;
    };
  };
}

export interface AvailablePersonResponse {
  id: number;
  name: string;
  displayName?: string;
  category: {
    id: number;
    name: string;
    color: string;
  };
  available: boolean;
  conflictReason?: string;
}

export interface AssignmentWithShiftResponse extends AssignmentResponse {
  shift: {
    id: number;
    areaId: number;
    dayId: number;
    startAtSeconds: number; // Seconds since midnight
    endAtSeconds: number;   // Seconds since midnight
    numPeople: number;
    area: {
      id: number;
      name: string;
      shortName: string;
    };
  };
}

export interface ShiftWithAssignments extends ShiftResponse {
  assignments: AssignmentResponse[];
}

export interface AreaScheduleResponse {
  area: AreaResponse & {
    shifts: ShiftWithAssignments[];
    manager?: {
      id: number;
      username: string;
    };
  };
  bounds: ScheduleBounds;
  editable: boolean;
  requestId?: number;
  notes?: string;
}

export interface PersonScheduleResponse {
  person: PersonResponse & {
    assignments: AssignmentWithShiftResponse[];
  };
  bounds: ScheduleBounds;
  editable: boolean;
  totalHours: HoursByDay;
  notes: {
    operations: { id: number; content: string }[];
    personnel: { id: number; content: string }[];
  };
  offDays: number[]; // array of dayIds where person is off
}

export interface GapsScheduleResponse {
  unassignedShifts: ShiftWithAssignments[];
  bounds: ScheduleBounds;
}

export interface ScheduleViewMode {
  type: 'area' | 'person' | 'gaps';
  id: number | 'gaps';
  mode: 'view' | 'edit' | 'request' | 'print';
}