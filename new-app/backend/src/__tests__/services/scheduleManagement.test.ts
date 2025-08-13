import { describe, expect, it, beforeEach } from '@jest/globals'
import * as scheduleService from '../../services/scheduleService'
import { createTestSchedule, createTestUser, createTestArea, createTestDay, createTestShift, cleanupTestData } from '../utils/testDb'

describe('Schedule Management', () => {
  let user: any
  let operationsUser: any
  let sourceSchedule: any
  let area: any
  let day: any

  beforeEach(async () => {
    await cleanupTestData()
    
    user = await createTestUser({ roles: ['manager'] })
    operationsUser = await createTestUser({ roles: ['operations'] })
    
    // Create a source schedule with some data
    sourceSchedule = await createTestSchedule({ 
      name: 'Source Schedule', 
      userId: user.id,
      request: 0 
    })
    
    area = await createTestArea(sourceSchedule.id, { name: 'Kitchen', shortName: 'K' })
    day = await createTestDay(sourceSchedule.id, { name: 'Monday', dayOfWeek: 1 })
    
    // Add some shifts to copy
    await createTestShift(sourceSchedule.id, {
      areaId: area.id,
      dayId: day.id,
      startAtSeconds: 32400, // 9:00 AM
      endAtSeconds: 36000,   // 10:00 AM
      numPeople: 2
    })
  })

  describe('copySchedule', () => {
    it('should copy a schedule with full data', async () => {
      const copyData = {
        name: 'Copied Schedule',
        sourceId: sourceSchedule.id,
        copyType: 'full' as const
      }

      const result = await scheduleService.copySchedule(user.id, copyData)

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: 'Copied Schedule'
      })

      // Verify the copy was created
      const copiedSchedule = await scheduleService.getScheduleDetail(result.id, user)
      expect(copiedSchedule.name).toBe('Copied Schedule')
      expect(copiedSchedule.areas).toHaveLength(1)
      expect(copiedSchedule.days).toHaveLength(1)
    })

    it('should copy only structure when copyType is structure', async () => {
      const copyData = {
        name: 'Structure Copy',
        sourceId: sourceSchedule.id,
        copyType: 'structure' as const
      }

      const result = await scheduleService.copySchedule(user.id, copyData)
      const copiedSchedule = await scheduleService.getScheduleDetail(result.id, user)

      expect(copiedSchedule.name).toBe('Structure Copy')
      expect(copiedSchedule.areas).toHaveLength(1)
      expect(copiedSchedule.days).toHaveLength(1)
      // Structure copy should have areas/days but not necessarily shifts/assignments
    })

    it('should reject duplicate schedule names', async () => {
      const copyData = {
        name: 'Source Schedule', // Same name as existing
        sourceId: sourceSchedule.id,
        copyType: 'full' as const
      }

      await expect(
        scheduleService.copySchedule(user.id, copyData)
      ).rejects.toThrow('A schedule with this name already exists')
    })

    it('should reject copying non-existent schedule', async () => {
      const copyData = {
        name: 'Copy of Nothing',
        sourceId: 999,
        copyType: 'full' as const
      }

      await expect(
        scheduleService.copySchedule(user.id, copyData)
      ).rejects.toThrow('Source schedule not found')
    })
  })

  describe('Template System', () => {
    describe('createTemplate', () => {
      it('should create a template from existing schedule', async () => {
        const templateData = {
          name: 'Kitchen Template',
          sourceId: sourceSchedule.id
        }

        const result = await scheduleService.createTemplate(operationsUser.id, templateData)

        expect(result).toMatchObject({
          id: expect.any(Number),
          name: 'Kitchen Template'
        })

        // Verify template was created properly
        const templates = await scheduleService.getTemplates()
        const createdTemplate = templates.find(t => t.id === result.id)
        expect(createdTemplate).toBeDefined()
        expect(createdTemplate?.name).toBe('Kitchen Template')
      })
    })

    describe('getTemplates', () => {
      it('should return all available templates', async () => {
        // Create a template first
        await scheduleService.createTemplate(operationsUser.id, {
          name: 'Test Template',
          sourceId: sourceSchedule.id
        })

        const templates = await scheduleService.getTemplates()

        expect(templates).toHaveLength(1)
        expect(templates[0]).toMatchObject({
          id: expect.any(Number),
          name: 'Test Template',
          createdAt: expect.any(String)
        })
      })

      it('should return empty array when no templates exist', async () => {
        const templates = await scheduleService.getTemplates()
        expect(templates).toHaveLength(0)
      })
    })
  })

  describe('Publishing System', () => {
    describe('publishSchedule', () => {
      it('should publish a schedule to a new group', async () => {
        const publishData = {
          scheduleId: sourceSchedule.id,
          groupName: 'January 2024',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
          groupType: 'new' as const
        }

        const result = await scheduleService.publishSchedule(publishData)

        expect(result).toMatchObject({
          groupId: expect.any(Number),
          scheduleId: sourceSchedule.id
        })
      })

      it('should reject publishing non-existent schedule', async () => {
        const publishData = {
          scheduleId: 999,
          groupName: 'Invalid Schedule',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
          groupType: 'new' as const
        }

        await expect(
          scheduleService.publishSchedule(publishData)
        ).rejects.toThrow('Schedule not found')
      })
    })

    describe('getScheduleGroups', () => {
      it('should return schedule groups with their schedules', async () => {
        // Publish a schedule first
        await scheduleService.publishSchedule({
          scheduleId: sourceSchedule.id,
          groupName: 'Test Group',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
          groupType: 'new'
        })

        const groups = await scheduleService.getScheduleGroups()

        expect(groups).toHaveLength(1)
        expect(groups[0]).toMatchObject({
          id: expect.any(Number),
          name: 'Test Group',
          start: expect.any(String),
          end: expect.any(String),
          schedules: expect.arrayContaining([
            expect.objectContaining({
              id: sourceSchedule.id,
              name: 'Published' // Schedule name changes to "Published" when published
            })
          ])
        })
      })

      it('should return empty array when no groups exist', async () => {
        const groups = await scheduleService.getScheduleGroups()
        expect(groups).toHaveLength(0)
      })
    })

    describe('getPublishedSchedule', () => {
      it('should return the currently active published schedule', async () => {
        const now = new Date()
        const start = new Date(now.getTime() - 24 * 60 * 60 * 1000) // Yesterday
        const end = new Date(now.getTime() + 24 * 60 * 60 * 1000)   // Tomorrow

        // Publish a schedule that's currently active
        await scheduleService.publishSchedule({
          scheduleId: sourceSchedule.id,
          groupName: 'Current Schedule',
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          groupType: 'new'
        })

        const publishedSchedule = await scheduleService.getPublishedSchedule()

        expect(publishedSchedule).toMatchObject({
          id: sourceSchedule.id,
          name: 'Published',
          groupName: 'Current Schedule',
          startDate: expect.any(String),
          endDate: expect.any(String)
        })
      })

      it('should return null when no active published schedule exists', async () => {
        const publishedSchedule = await scheduleService.getPublishedSchedule()
        expect(publishedSchedule).toBeNull()
      })
    })
  })

  describe('Complex Workflows', () => {
    it('should support template → copy → publish workflow', async () => {
      // 1. Create a template from source schedule
      const template = await scheduleService.createTemplate(operationsUser.id, {
        name: 'Standard Kitchen Template',
        sourceId: sourceSchedule.id
      })

      // 2. Create a new schedule from the template
      const newSchedule = await scheduleService.copySchedule(user.id, {
        name: 'February Schedule',
        sourceId: template.id,
        copyType: 'template'
      })

      // 3. Publish the new schedule
      const publishResult = await scheduleService.publishSchedule({
        scheduleId: newSchedule.id,
        groupName: 'February 2024',
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2024-02-29T23:59:59Z',
        groupType: 'new'
      })

      // Verify the complete workflow worked
      expect(template.name).toBe('Standard Kitchen Template')
      expect(newSchedule.name).toBe('February Schedule')
      expect(publishResult.scheduleId).toBe(newSchedule.id)

      // Verify template is available for reuse
      const templates = await scheduleService.getTemplates()
      expect(templates.find(t => t.id === template.id)).toBeDefined()

      // Verify published schedule group exists
      const groups = await scheduleService.getScheduleGroups()
      expect(groups.find(g => g.name === 'February 2024')).toBeDefined()
    })
  })
})