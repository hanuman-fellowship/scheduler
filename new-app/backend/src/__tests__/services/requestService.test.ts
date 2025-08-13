import { describe, expect, it, beforeEach } from '@jest/globals'
import * as requestService from '../../services/requestService'
import { createTestSchedule, createTestUser, createTestArea, cleanupTestData } from '../utils/testDb'

describe('requestService', () => {
  let manager: any
  let operationsUser: any
  let area: any
  let publishedSchedule: any

  beforeEach(async () => {
    await cleanupTestData()
    
    manager = await createTestUser({ roles: ['manager'] })
    operationsUser = await createTestUser({ roles: ['operations'] })
    publishedSchedule = await createTestSchedule({ 
      name: 'Published Schedule', 
      userId: null, 
      request: 0 
    })
    area = await createTestArea(publishedSchedule.id, { name: 'Kitchen', shortName: 'K' })
    
    // Create manager-area relationship
    await (await import('../utils/testConfig')).prisma.manager.create({
      data: {
        userId: manager.id,
        areaId: area.id
      }
    })
  })

  describe('createRequest', () => {
    it('should create a draft request for authorized manager', async () => {
      const requestData = {
        name: 'January Session',
        areaId: area.id,
        baseType: 'blank' as const,
      }

      const result = await requestService.createRequest(manager.id, requestData)

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: 'January Session'
      })
    })

    it('should reject request from unauthorized manager', async () => {
      const unauthorizedManager = await createTestUser({ roles: ['manager'] })
      
      const requestData = {
        name: 'Unauthorized Request',
        areaId: area.id,
        baseType: 'blank' as const,
      }

      await expect(
        requestService.createRequest(unauthorizedManager.id, requestData)
      ).rejects.toThrow('You do not have permission to manage this area')
    })

    it('should reject duplicate request names', async () => {
      const requestData = {
        name: 'Test Request',
        areaId: area.id,
        baseType: 'blank' as const,
      }

      // Create first request
      await requestService.createRequest(manager.id, requestData)

      // Try to create another with same name
      await expect(
        requestService.createRequest(manager.id, requestData)
      ).rejects.toThrow('A request with this name already exists')
    })
  })

  describe('submitRequest', () => {
    it('should submit a draft request', async () => {
      // Create a draft request first
      const requestData = {
        name: 'Test Submit Request',
        areaId: area.id,
        baseType: 'blank' as const,
      }
      const draftRequest = await requestService.createRequest(manager.id, requestData)

      // Submit the request
      const result = await requestService.submitRequest(manager.id, draftRequest.id)

      expect(result).toBe('Test Submit Request')
    })

    it('should reject submitting non-existent request', async () => {
      await expect(
        requestService.submitRequest(manager.id, 999)
      ).rejects.toThrow('Request not found or already submitted')
    })
  })

  describe('getManagerDraftRequests', () => {
    it('should return draft requests for manager', async () => {
      // Create a draft request
      const requestData = {
        name: 'Manager Draft Test',
        areaId: area.id,
        baseType: 'blank' as const,
      }
      await requestService.createRequest(manager.id, requestData)

      const drafts = await requestService.getManagerDraftRequests(manager.id)

      expect(drafts).toHaveLength(1)
      expect(drafts[0]).toMatchObject({
        name: 'Manager Draft Test',
        areaName: 'Kitchen'
      })
    })

    it('should return empty array when no drafts exist', async () => {
      const drafts = await requestService.getManagerDraftRequests(manager.id)

      expect(drafts).toHaveLength(0)
    })
  })

  describe('getSubmittedRequests', () => {
    it('should return submitted requests grouped by area', async () => {
      // Create and submit a request
      const requestData = {
        name: 'Submitted Test Request',
        areaId: area.id,
        baseType: 'blank' as const,
      }
      const draftRequest = await requestService.createRequest(manager.id, requestData)
      await requestService.submitRequest(manager.id, draftRequest.id)

      const requestsByArea = await requestService.getSubmittedRequests()

      expect(Object.keys(requestsByArea)).toHaveLength(1)
      expect(requestsByArea['Kitchen']).toBeDefined()
      expect(requestsByArea['Kitchen'].requests).toHaveLength(1)
      expect(requestsByArea['Kitchen'].requests[0]).toMatchObject({
        name: 'Submitted Test Request',
        areaName: 'Kitchen',
        request: 1
      })
    })

    it('should return empty object when no submitted requests exist', async () => {
      const requestsByArea = await requestService.getSubmittedRequests()

      expect(Object.keys(requestsByArea)).toHaveLength(0)
    })
  })

  describe('deleteRequest', () => {
    it('should allow manager to delete their own request', async () => {
      // Create a draft request
      const requestData = {
        name: 'Request to Delete',
        areaId: area.id,
        baseType: 'blank' as const,
      }
      const draftRequest = await requestService.createRequest(manager.id, requestData)

      // Delete the request
      const result = await requestService.deleteRequest(draftRequest.id, manager.id)

      expect(result).toBe('Request to Delete')
    })

    it('should prevent manager from deleting other manager requests', async () => {
      const otherManager = await createTestUser({ roles: ['manager'] })
      await (await import('../utils/testConfig')).prisma.manager.create({
        data: {
          userId: otherManager.id,
          areaId: area.id
        }
      })
      
      // Create request with other manager
      const requestData = {
        name: 'Other Manager Request',
        areaId: area.id,
        baseType: 'blank' as const,
      }
      const otherRequest = await requestService.createRequest(otherManager.id, requestData)

      // Try to delete with different manager
      await expect(
        requestService.deleteRequest(otherRequest.id, manager.id)
      ).rejects.toThrow('Request not found or insufficient permissions')
    })

    it('should allow operations to delete any request', async () => {
      // Create a request
      const requestData = {
        name: 'Operations Delete Test',
        areaId: area.id,
        baseType: 'blank' as const,
      }
      const request = await requestService.createRequest(manager.id, requestData)

      // Operations should be able to delete without userId restriction
      const result = await requestService.deleteRequest(request.id)

      expect(result).toBe('Operations Delete Test')
    })
  })
})