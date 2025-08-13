import { 
  CreateRequestInput, 
  RequestsByArea, 
  DraftRequestResponse, 
  BaseOptionsResponse 
} from '@shared/types';
import { apiClient } from './api';

export const requestService = {
  // Create a new draft request
  async createRequest(data: CreateRequestInput): Promise<{ id: number; name: string }> {
    const response = await apiClient.post('/requests', data);
    return response.data.request;
  },

  // Get all draft requests for current manager
  async getDraftRequests(): Promise<DraftRequestResponse[]> {
    const response = await apiClient.get('/requests/drafts');
    return response.data.drafts;
  },

  // Submit a draft request
  async submitRequest(requestId: number): Promise<void> {
    await apiClient.post(`/requests/${requestId}/submit`);
  },

  // Get all submitted requests (operations only)
  async getSubmittedRequests(): Promise<RequestsByArea> {
    const response = await apiClient.get('/requests/submitted');
    return response.data.requestsByArea;
  },

  // Accept a submitted request (operations only)
  async acceptRequest(requestId: number, clearAreaFirst: boolean = true): Promise<void> {
    await apiClient.post(`/requests/${requestId}/accept`, { clearAreaFirst });
  },

  // Delete a request
  async deleteRequest(requestId: number): Promise<void> {
    await apiClient.delete(`/requests/${requestId}`);
  },

  // Get base schedule options for creating requests
  async getBaseOptions(areaId: number): Promise<BaseOptionsResponse['baseOptions']> {
    const response = await apiClient.get(`/requests/base-options/${areaId}`);
    return response.data.baseOptions;
  }
};