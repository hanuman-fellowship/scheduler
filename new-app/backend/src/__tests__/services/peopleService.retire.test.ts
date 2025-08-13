import { describe, expect, it, beforeEach } from '@jest/globals'
import * as peopleService from '../../services/peopleService'
import { createTestSchedule, createTestUser, createTestCategory, createTestPerson, cleanupTestData } from '../utils/testDb'

describe('peopleService retire/restore', () => {
  let schedule: any
  let user: any
  let category: any
  let person: any

  beforeEach(async () => {
    await cleanupTestData()
    user = await createTestUser({ roles: ['operations'] })
    schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
    category = await createTestCategory(schedule.id, { 
      name: 'Residents', 
      color: '#008080'
    })
    person = await createTestPerson({
      first: 'John',
      last: 'Doe'
    })
    
    // Create people schedule relationship manually
    await (await import('../utils/testConfig')).prisma.peopleSchedule.create({
      data: {
        personId: person.id,
        scheduleId: schedule.id,
        residentCategoryId: category.id
      }
    })
  })

  describe('retirePerson', () => {
    it('should retire person from schedule', async () => {
      const result = await peopleService.retirePerson(person.id, schedule.id)
      
      expect(result).toBe('John Doe')
      
      // Person should no longer be in schedule
      const peopleInSchedule = await peopleService.getAllPeople()
      const personInSchedule = peopleInSchedule.find(p => p.id === person.id)
      expect(personInSchedule?.category).toBeUndefined()
    })

    it('should throw error if person not found', async () => {
      await expect(
        peopleService.retirePerson(999, schedule.id)
      ).rejects.toThrow('Person not found')
    })

    it('should throw error if person not in schedule', async () => {
      // First retire the person
      await peopleService.retirePerson(person.id, schedule.id)
      
      // Try to retire again
      await expect(
        peopleService.retirePerson(person.id, schedule.id)
      ).rejects.toThrow('Person not found in current schedule')
    })
  })

  describe('retireMultiplePeople', () => {
    it('should retire multiple people at once', async () => {
      const person2 = await createTestPerson({
        first: 'Jane',
        last: 'Smith'
      })

      // Create people schedule relationship manually
      const { prisma } = await import('../utils/testConfig')
      await prisma.peopleSchedule.create({
        data: {
          personId: person2.id,
          scheduleId: schedule.id,
          residentCategoryId: category.id
        }
      })

      const result = await peopleService.retireMultiplePeople(
        [person.id, person2.id], 
        schedule.id
      )
      
      expect(result).toHaveLength(2)
      expect(result).toContain('John Doe')
      expect(result).toContain('Jane Smith')
    })

    it('should handle partial failures gracefully', async () => {
      const result = await peopleService.retireMultiplePeople(
        [person.id, 999], // 999 doesn't exist
        schedule.id
      )
      
      // Should still retire the valid person
      expect(result).toHaveLength(1)
      expect(result).toContain('John Doe')
    })
  })

  describe('getRestorablePeople', () => {
    it('should return people not in current schedule', async () => {
      // First retire the person
      await peopleService.retirePerson(person.id, schedule.id)
      
      const restorablePeople = await peopleService.getRestorablePeople(schedule.id)
      
      expect(restorablePeople).toHaveLength(1)
      expect(restorablePeople[0].id).toBe(person.id)
      expect(restorablePeople[0].displayName).toBe('John Doe')
    })

    it('should not return people already in schedule', async () => {
      const restorablePeople = await peopleService.getRestorablePeople(schedule.id)
      
      // Person is in schedule, so should not be restorable
      expect(restorablePeople).toHaveLength(0)
    })
  })

  describe('restorePerson', () => {
    it('should restore person to schedule with category', async () => {
      // First retire the person
      await peopleService.retirePerson(person.id, schedule.id)
      
      // Now restore them
      const result = await peopleService.restorePerson(person.id, schedule.id, category.id)
      
      expect(result).toBe('John Doe')
      
      // Person should be back in schedule
      const peopleInSchedule = await peopleService.getAllPeople()
      const restoredPerson = peopleInSchedule.find(p => p.id === person.id)
      expect(restoredPerson?.category?.id).toBe(category.id)
    })

    it('should throw error if person not found', async () => {
      await expect(
        peopleService.restorePerson(999, schedule.id, category.id)
      ).rejects.toThrow('Person not found')
    })

    it('should throw error if person already in schedule', async () => {
      await expect(
        peopleService.restorePerson(person.id, schedule.id, category.id)
      ).rejects.toThrow('Person is already in this schedule')
    })
  })

  describe('getPeopleByCategory', () => {
    it('should group people by category', async () => {
      const category2 = await createTestCategory(schedule.id, { 
        name: 'Staff', 
        color: '#FF0000'
      })
      const person2 = await createTestPerson({
        first: 'Jane',
        last: 'Smith'
      })

      // Create people schedule relationship manually
      const { prisma } = await import('../utils/testConfig')
      await prisma.peopleSchedule.create({
        data: {
          personId: person2.id,
          scheduleId: schedule.id,
          residentCategoryId: category2.id
        }
      })

      const peopleByCategory = await peopleService.getPeopleByCategory()
      
      expect(Object.keys(peopleByCategory)).toHaveLength(2)
      expect(peopleByCategory[category.id].people).toHaveLength(1)
      expect(peopleByCategory[category2.id].people).toHaveLength(1)
      
      // Should include category information
      expect(peopleByCategory[category.id].category.name).toBe('Residents')
      expect(peopleByCategory[category2.id].category.name).toBe('Staff')
    })

    it('should return empty object if no people', async () => {
      // Retire the person
      await peopleService.retirePerson(person.id, schedule.id)
      
      const peopleByCategory = await peopleService.getPeopleByCategory()
      
      expect(Object.keys(peopleByCategory)).toHaveLength(0)
    })
  })
})