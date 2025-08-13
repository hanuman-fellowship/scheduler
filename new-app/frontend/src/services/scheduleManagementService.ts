import { 
  CopyScheduleInput,
  CreateTemplateInput,
  PublishScheduleInput,
  TemplateResponse,
  ScheduleGroupResponse,
  PublishedScheduleResponse
} from '@shared/types';
import { apiClient } from './api';

export const scheduleManagementService = {
  // Copy an existing schedule
  async copySchedule(data: CopyScheduleInput): Promise<{ id: number; name: string }> {
    const response = await apiClient.post('/schedules/copy', data);
    return response.data.schedule;
  },

  // Create a template from an existing schedule
  async createTemplate(data: CreateTemplateInput): Promise<{ id: number; name: string }> {
    const response = await apiClient.post('/schedules/templates', data);
    return response.data.template;
  },

  // Get all available templates
  async getTemplates(): Promise<TemplateResponse[]> {
    const response = await apiClient.get('/schedules/templates');
    return response.data.templates;
  },

  // Publish a schedule to a schedule group
  async publishSchedule(data: PublishScheduleInput): Promise<{ groupId: number; scheduleId: number }> {
    const response = await apiClient.post('/schedules/publish', data);
    return response.data.result;
  },

  // Get all schedule groups with their schedules
  async getScheduleGroups(): Promise<ScheduleGroupResponse[]> {
    const response = await apiClient.get('/schedules/groups');
    return response.data.scheduleGroups;
  },

  // Get the currently published schedule
  async getPublishedSchedule(): Promise<PublishedScheduleResponse | null> {
    const response = await apiClient.get('/schedules/published');
    return response.data.publishedSchedule;
  }
};