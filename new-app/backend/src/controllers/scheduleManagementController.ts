import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as scheduleService from '../services/scheduleService';

// Copy an existing schedule
export const copySchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await scheduleService.copySchedule(req.user!.id, req.body);
    res.status(201).json({
      message: 'Schedule copied successfully',
      schedule: result
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to copy schedule' });
    }
  }
};

// Create a template from an existing schedule
export const createTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await scheduleService.createTemplate(req.user!.id, req.body);
    res.status(201).json({
      message: 'Template created successfully',
      template: result
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create template' });
    }
  }
};

// Get all available templates
export const getTemplates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const templates = await scheduleService.getTemplates();
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

// Publish a schedule to a schedule group
export const publishSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await scheduleService.publishSchedule(req.body);
    res.json({
      message: 'Schedule published successfully',
      result
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to publish schedule' });
    }
  }
};

// Get all schedule groups with their schedules
export const getScheduleGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groups = await scheduleService.getScheduleGroups();
    res.json({ scheduleGroups: groups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule groups' });
  }
};

// Get all published schedules
export const getPublishedSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Getting published schedules...');
    const publishedSchedules = await scheduleService.getPublishedSchedules();
    console.log('Found published schedules:', publishedSchedules.length);
    res.json(publishedSchedules);
  } catch (error) {
    console.error('Error getting published schedules:', error);
    res.status(500).json({ error: 'Failed to fetch published schedules' });
  }
};

// Get the currently published schedule
export const getPublishedSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const publishedSchedule = await scheduleService.getPublishedSchedule();
    res.json({ publishedSchedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch published schedule' });
  }
};