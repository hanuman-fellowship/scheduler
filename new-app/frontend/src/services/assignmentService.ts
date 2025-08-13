import api from './api';
import type { 
  AssignmentResponse, 
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  AvailablePersonResponse 
} from '@shared/types';

/**
 * Assignment service for managing shift assignments
 * Small, testable functions following our standards
 */

export const assignmentService = {
  /**
   * Create a new assignment for a shift
   */
  async createAssignment(data: CreateAssignmentRequest): Promise<AssignmentResponse> {
    const response = await api.post<AssignmentResponse>('/assignments', data);
    return response.data;
  },

  /**
   * Update an existing assignment
   */
  async updateAssignment(id: number, data: UpdateAssignmentRequest): Promise<AssignmentResponse> {
    const response = await api.put<AssignmentResponse>(`/assignments/${id}`, data);
    return response.data;
  },

  /**
   * Delete an assignment
   */
  async deleteAssignment(id: number): Promise<void> {
    await api.delete(`/assignments/${id}`);
  },

  /**
   * Toggle star status for an assignment
   */
  async toggleStar(id: number): Promise<AssignmentResponse> {
    const response = await api.post<AssignmentResponse>(`/assignments/${id}/star`);
    return response.data;
  },

  /**
   * Get available people for a shift with conflict information
   */
  async getAvailablePeople(shiftId: number): Promise<AvailablePersonResponse[]> {
    const response = await api.get<AvailablePersonResponse[]>(
      `/assignments/shift/${shiftId}/available-people`
    );
    return response.data;
  },

  /**
   * Get all assignments for a shift
   */
  async getShiftAssignments(shiftId: number): Promise<AssignmentResponse[]> {
    const response = await api.get<AssignmentResponse[]>(
      `/assignments/shift/${shiftId}`
    );
    return response.data;
  }
};