import { Request, Response } from 'express';
import * as assignmentController from '../../controllers/assignmentController';
import * as assignmentService from '../../services/assignmentService';
import * as scheduleService from '../../services/scheduleService';
import { z } from 'zod';

// Mock services
jest.mock('../../services/assignmentService');
jest.mock('../../services/scheduleService');

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: Array<'operations' | 'manager' | 'personnel'>;
  };
}

describe('Assignment Controller', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    roles: ['operations' as const]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock
    });

    mockRes = {
      json: jsonMock,
      status: statusMock,
      send: sendMock
    };

    mockReq = {
      user: mockUser,
      body: {},
      params: {}
    };
  });

  describe('createAssignment', () => {
    it('should create assignment successfully', async () => {
      const mockSchedule = { id: 1, name: 'Test Schedule' };
      const mockAssignment = {
        id: 1,
        shiftId: 1,
        personId: 1,
        name: undefined,
        star: false,
        person: { id: 1, first: 'John', last: 'Doe' }
      };

      mockReq.body = {
        shiftId: 1,
        personId: 1,
        name: undefined
      };

      (scheduleService.getScheduleDetail as jest.Mock).mockResolvedValue(mockSchedule as any);
      (assignmentService.createAssignment as jest.Mock).mockResolvedValue(mockAssignment as any);

      await assignmentController.createAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(scheduleService.getScheduleDetail as jest.Mock).toHaveBeenCalledWith(1, mockUser);
      expect(assignmentService.createAssignment).toHaveBeenCalledWith({
        shiftId: 1,
        personId: 1,
        name: undefined,
        scheduleId: 1
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockAssignment);
    });

    it('should handle validation errors', async () => {
      mockReq.body = {
        shiftId: 'invalid', // Should be number
        personId: 1
      };

      const mockSchedule = { id: 1, name: 'Test Schedule' };
      (scheduleService.getScheduleDetail as jest.Mock).mockResolvedValue(mockSchedule as any);

      await assignmentController.createAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Invalid assignment data',
          code: 'INVALID_INPUT',
          details: expect.any(Array)
        }
      });
    });

    it('should handle service errors', async () => {
      mockReq.body = {
        shiftId: 1,
        personId: 1
      };

      const mockSchedule = { id: 1, name: 'Test Schedule' };
      (scheduleService.getScheduleDetail as jest.Mock).mockResolvedValue(mockSchedule as any);
      (assignmentService.createAssignment as jest.Mock).mockRejectedValue(
        new Error('Shift is already full')
      );

      await assignmentController.createAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Shift is already full',
          code: 'ASSIGNMENT_ERROR'
        }
      });
    });

    it('should handle unexpected errors', async () => {
      mockReq.body = {
        shiftId: 1,
        personId: 1
      };

      const mockSchedule = { id: 1, name: 'Test Schedule' };
      (scheduleService.getScheduleDetail as jest.Mock).mockResolvedValue(mockSchedule as any);
      (assignmentService.createAssignment as jest.Mock).mockRejectedValue('Unknown error');

      await assignmentController.createAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Failed to create assignment',
          code: 'INTERNAL_ERROR'
        }
      });
    });
  });

  describe('updateAssignment', () => {
    it('should update assignment successfully', async () => {
      const mockAssignment = {
        id: 1,
        shiftId: 1,
        personId: 2,
        star: true
      };

      mockReq.params = { id: '1' };
      mockReq.body = {
        personId: 2,
        star: true
      };

      (assignmentService.updateAssignment as jest.Mock).mockResolvedValue(mockAssignment as any);

      await assignmentController.updateAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(assignmentService.updateAssignment).toHaveBeenCalledWith(1, {
        personId: 2,
        star: true
      });
      expect(jsonMock).toHaveBeenCalledWith(mockAssignment);
    });

    it('should handle assignment not found', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { star: true };

      (assignmentService.updateAssignment as jest.Mock).mockResolvedValue(null);

      await assignmentController.updateAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Assignment not found',
          code: 'NOT_FOUND'
        }
      });
    });

    it('should handle invalid assignment ID', async () => {
      mockReq.params = { id: 'invalid' };
      mockReq.body = { star: true };

      await assignmentController.updateAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Invalid assignment data',
          code: 'INVALID_INPUT',
          details: expect.any(Array)
        }
      });
    });
  });

  describe('deleteAssignment', () => {
    it('should delete assignment successfully', async () => {
      mockReq.params = { id: '1' };

      (assignmentService.deleteAssignment as jest.Mock).mockResolvedValue(true);

      await assignmentController.deleteAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(assignmentService.deleteAssignment).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should handle assignment not found', async () => {
      mockReq.params = { id: '999' };

      (assignmentService.deleteAssignment as jest.Mock).mockResolvedValue(false);

      await assignmentController.deleteAssignment(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Assignment not found',
          code: 'NOT_FOUND'
        }
      });
    });
  });

  describe('toggleAssignmentStar', () => {
    it('should toggle star status successfully', async () => {
      const mockAssignment = {
        id: 1,
        shiftId: 1,
        personId: 1,
        star: true
      };

      mockReq.params = { id: '1' };

      (assignmentService.toggleAssignmentStar as jest.Mock).mockResolvedValue(mockAssignment as any);

      await assignmentController.toggleAssignmentStar(mockReq as AuthRequest, mockRes as Response);

      expect(assignmentService.toggleAssignmentStar).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(mockAssignment);
    });

    it('should handle assignment not found', async () => {
      mockReq.params = { id: '999' };

      (assignmentService.toggleAssignmentStar as jest.Mock).mockResolvedValue(null);

      await assignmentController.toggleAssignmentStar(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Assignment not found',
          code: 'NOT_FOUND'
        }
      });
    });
  });

  describe('getAvailablePeopleForShift', () => {
    it('should get available people successfully', async () => {
      const mockPeople = [
        {
          id: 1,
          name: 'John Doe',
          category: { id: 1, name: 'Staff', color: '#FF0000' },
          available: true
        },
        {
          id: 2,
          name: 'Jane Smith',
          category: { id: 1, name: 'Staff', color: '#FF0000' },
          available: false,
          conflictReason: 'Off day'
        }
      ];

      mockReq.params = { shiftId: '1' };

      (assignmentService.getAvailablePeopleForShift as jest.Mock).mockResolvedValue(mockPeople as any);

      await assignmentController.getAvailablePeopleForShift(mockReq as AuthRequest, mockRes as Response);

      expect(assignmentService.getAvailablePeopleForShift).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(mockPeople);
    });

    it('should handle invalid shift ID', async () => {
      mockReq.params = { shiftId: 'invalid' };

      await assignmentController.getAvailablePeopleForShift(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Invalid shift ID',
          code: 'INVALID_INPUT',
          details: expect.any(Array)
        }
      });
    });

    it('should handle service errors', async () => {
      mockReq.params = { shiftId: '1' };

      (assignmentService.getAvailablePeopleForShift as jest.Mock).mockRejectedValue(
        new Error('Shift not found')
      );

      await assignmentController.getAvailablePeopleForShift(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Shift not found',
          code: 'ASSIGNMENT_ERROR'
        }
      });
    });
  });

  describe('getShiftAssignments', () => {
    it('should get shift assignments successfully', async () => {
      const mockAssignments = [
        {
          id: 1,
          shiftId: 1,
          personId: 1,
          star: false,
          person: { id: 1, first: 'John', last: 'Doe' }
        },
        {
          id: 2,
          shiftId: 1,
          personId: null,
          name: 'External Helper',
          star: true
        }
      ];

      mockReq.params = { shiftId: '1' };

      (assignmentService.getShiftAssignments as jest.Mock).mockResolvedValue(mockAssignments as any);

      await assignmentController.getShiftAssignments(mockReq as AuthRequest, mockRes as Response);

      expect(assignmentService.getShiftAssignments).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith(mockAssignments);
    });

    it('should handle invalid shift ID', async () => {
      mockReq.params = { shiftId: 'invalid' };

      await assignmentController.getShiftAssignments(mockReq as AuthRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: {
          message: 'Invalid shift ID',
          code: 'INVALID_INPUT',
          details: expect.any(Array)
        }
      });
    });
  });
});