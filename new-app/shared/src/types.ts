// All shared types for the scheduler app
import { z } from 'zod';

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
  name: string; // display name
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
  start: string; // "HH:MM:SS"
  end: string; // "HH:MM:SS"
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

export interface CopyScheduleRequest {
  sourceId: number;
  name: string;
}

export interface CreateShiftRequest {
  areaId: number;
  dayId: number;
  start: string;
  end: string;
  numPeople: number;
}

export interface CreateAssignmentRequest {
  shiftId: number;
  personId: number; // 0 for "other"
  name?: string; // if personId = 0
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
  start: z.string().min(1),
  end: z.string().min(1),
  numPeople: z.number().min(1),
});

export const CopyScheduleFormSchema = z.object({
  name: z.string().min(1),
});