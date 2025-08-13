import { describe, it, expect, beforeEach } from '@jest/globals'
import * as assignmentService from '../../services/assignmentService'
import { prisma } from '../utils/testConfig'
import { 
  createTestUser, 
  createTestSchedule, 
  createTestArea, 
  createTestDay, 
  createTestShift, 
  createTestPerson,
  createTestAssignment,
  createTestCategory,
  cleanupTestData 
} from '../utils/testDb'

describe('assignmentService', () => {
  beforeEach(async () => {
    await cleanupTestData()
  })

  describe('createAssignment', () => {
    it('should create assignment for person', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' })
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 1 })
      const shift = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 32400, // 9:00 AM
        endAtSeconds: 36000,   // 10:00 AM
        numPeople: 2
      })
      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person = await createTestPerson({ first: 'John', last: 'Doe' })

      // Add person to schedule
      await prisma.peopleSchedule.create({
        data: {
          scheduleId: schedule.id,
          personId: person.id,
          residentCategoryId: category.id
        }
      })

      const assignmentData = {
        scheduleId: schedule.id,
        shiftId: shift.id,
        personId: person.id
      }

      const result = await assignmentService.createAssignment(assignmentData)

      expect(result).toMatchObject({
        shiftId: shift.id,
        personId: person.id,
        name: undefined,
        star: false,
        person: {
          id: person.id,
          first: 'John',
          last: 'Doe'
        }
      })
    })

    it.skip('should create assignment for "other" with name', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' })
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 1 })
      const shift = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 32400,
        endAtSeconds: 36000,
        numPeople: 2
      })

      const assignmentData = {
        scheduleId: schedule.id,
        shiftId: shift.id,
        personId: null,
        name: 'External Worker'
      }

      const result = await assignmentService.createAssignment(assignmentData)

      expect(result).toMatchObject({
        shiftId: shift.id,
        personId: null,
        name: 'External Worker',
        star: false,
        person: undefined
      })
    })

    it('should reject assignment when shift is full', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' })
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 1 })
      const shift = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 32400,
        endAtSeconds: 36000,
        numPeople: 1 // Only 1 person allowed
      })
      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person1 = await createTestPerson({ first: 'John', last: 'Doe' })
      const person2 = await createTestPerson({ first: 'Jane', last: 'Smith' })

      // Add people to schedule
      await prisma.peopleSchedule.createMany({
        data: [
          { scheduleId: schedule.id, personId: person1.id, residentCategoryId: category.id },
          { scheduleId: schedule.id, personId: person2.id, residentCategoryId: category.id }
        ]
      })

      // Fill the shift
      await createTestAssignment(schedule.id, { shiftId: shift.id, personId: person1.id })

      // Try to assign second person
      const assignmentData = {
        scheduleId: schedule.id,
        shiftId: shift.id,
        personId: person2.id
      }

      await expect(assignmentService.createAssignment(assignmentData))
        .rejects.toThrow('Shift is already full')
    })

    it('should reject duplicate assignment', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' })
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 1 })
      const shift = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 32400,
        endAtSeconds: 36000,
        numPeople: 2
      })
      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person = await createTestPerson({ first: 'John', last: 'Doe' })

      // Add person to schedule
      await prisma.peopleSchedule.create({
        data: {
          scheduleId: schedule.id,
          personId: person.id,
          residentCategoryId: category.id
        }
      })

      // Create first assignment
      await createTestAssignment(schedule.id, { shiftId: shift.id, personId: person.id })

      // Try to assign same person again
      const assignmentData = {
        scheduleId: schedule.id,
        shiftId: shift.id,
        personId: person.id
      }

      await expect(assignmentService.createAssignment(assignmentData))
        .rejects.toThrow('Person is already assigned to this shift')
    })

    it.skip('should reject "other" assignment without name', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' })
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 1 })
      const shift = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 32400,
        endAtSeconds: 36000,
        numPeople: 2
      })

      const assignmentData = {
        scheduleId: schedule.id,
        shiftId: shift.id,
        personId: null,
        name: ''
      }

      await expect(assignmentService.createAssignment(assignmentData))
        .rejects.toThrow('Name is required for "other" assignments')
    })
  })

  describe('updateAssignment', () => {
    it('should update assignment star status', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person = await createTestPerson({ first: 'John', last: 'Doe' })
      const assignment = await createTestAssignment(schedule.id, { personId: person.id })

      const result = await assignmentService.updateAssignment(assignment.id, { star: true })

      expect(result?.star).toBe(true)
    })

    it('should update assignment person', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person1 = await createTestPerson({ first: 'John', last: 'Doe' })
      const person2 = await createTestPerson({ first: 'Jane', last: 'Smith' })
      const assignment = await createTestAssignment(schedule.id, { personId: person1.id })

      // Add both people to schedule
      await prisma.peopleSchedule.createMany({
        data: [
          { scheduleId: schedule.id, personId: person1.id, residentCategoryId: category.id },
          { scheduleId: schedule.id, personId: person2.id, residentCategoryId: category.id }
        ]
      })

      const result = await assignmentService.updateAssignment(assignment.id, { personId: person2.id })

      expect(result?.personId).toBe(person2.id)
      expect(result?.person?.first).toBe('Jane')
    })

    it('should return null for non-existent assignment', async () => {
      const result = await assignmentService.updateAssignment(999, { star: true })
      expect(result).toBeNull()
    })
  })

  describe('deleteAssignment', () => {
    it('should delete assignment successfully', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const assignment = await createTestAssignment(schedule.id, {})

      const result = await assignmentService.deleteAssignment(assignment.id)
      expect(result).toBe(true)

      const deletedAssignment = await prisma.assignment.findUnique({
        where: { id: assignment.id }
      })
      expect(deletedAssignment).toBeNull()
    })

    it('should return false for non-existent assignment', async () => {
      const result = await assignmentService.deleteAssignment(999)
      expect(result).toBe(false)
    })
  })

  describe('toggleAssignmentStar', () => {
    it('should toggle star from false to true', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const assignment = await createTestAssignment(schedule.id, {})

      const result = await assignmentService.toggleAssignmentStar(assignment.id)

      expect(result?.star).toBe(true)
    })

    it('should toggle star from true to false', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const assignment = await createTestAssignment(schedule.id, {})

      // First toggle to true
      await assignmentService.toggleAssignmentStar(assignment.id)
      
      // Then toggle back to false
      const result = await assignmentService.toggleAssignmentStar(assignment.id)

      expect(result?.star).toBe(false)
    })

    it('should return null for non-existent assignment', async () => {
      const result = await assignmentService.toggleAssignmentStar(999)
      expect(result).toBeNull()
    })
  })

  describe('getAvailablePeopleForShift', () => {
    it('should return people with availability status', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' })
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 1 })
      const shift = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 32400, // 9:00 AM
        endAtSeconds: 36000,   // 10:00 AM
        numPeople: 2
      })
      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person1 = await createTestPerson({ first: 'John', last: 'Doe' })
      const person2 = await createTestPerson({ first: 'Jane', last: 'Smith' })

      // Add people to schedule
      await prisma.peopleSchedule.createMany({
        data: [
          { scheduleId: schedule.id, personId: person1.id, residentCategoryId: category.id },
          { scheduleId: schedule.id, personId: person2.id, residentCategoryId: category.id }
        ]
      })

      const result = await assignmentService.getAvailablePeopleForShift(shift.id)

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: person1.id,
        name: 'John Doe',
        category: {
          id: expect.any(Number),
          name: 'Residents',
          color: '#008080'
        },
        available: true
      })
    })

    it('should detect time conflicts', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' })
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 1 })
      
      // Create overlapping shifts
      const shift1 = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 32400, // 9:00 AM
        endAtSeconds: 36000,   // 10:00 AM
        numPeople: 1
      })
      
      const shift2 = await createTestShift(schedule.id, {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: 34200, // 9:30 AM (overlaps with shift1)
        endAtSeconds: 37800,   // 10:30 AM
        numPeople: 1
      })

      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person = await createTestPerson({ first: 'John', last: 'Doe' })

      // Add person to schedule and assign to first shift
      await prisma.peopleSchedule.create({
        data: {
          scheduleId: schedule.id,
          personId: person.id,
          residentCategoryId: category.id
        }
      })
      
      await createTestAssignment(schedule.id, { shiftId: shift1.id, personId: person.id })

      const result = await assignmentService.getAvailablePeopleForShift(shift2.id)

      expect(result).toHaveLength(1)
      expect(result[0].available).toBe(false)
      expect(result[0].conflictReason).toContain('Conflicts with 32400-36000')
    })
  })

  describe('getShiftAssignments', () => {
    it('should return shift assignments ordered by star and name', async () => {
      const user = await createTestUser({ roles: ['operations'] })
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id })
      const category = await createTestCategory(schedule.id, { name: 'Residents', color: '#008080' })
      const person1 = await createTestPerson({ first: 'John', last: 'Doe' })
      const person2 = await createTestPerson({ first: 'Alice', last: 'Smith' })
      
      // Create assignments for the same shift
      const assignment1 = await createTestAssignment(schedule.id, { personId: person1.id })
      const assignment2 = await createTestAssignment(schedule.id, { personId: person2.id, shiftId: assignment1.shiftId })

      // Star the second assignment
      await prisma.assignment.update({
        where: { id: assignment2.id },
        data: { star: true }
      })

      const result = await assignmentService.getShiftAssignments(assignment1.shiftId)

      expect(result).toHaveLength(2)
      // Starred assignment should come first
      expect(result[0].star).toBe(true)
      expect(result[0].person?.first).toBe('Alice')
      expect(result[1].star).toBe(false)
      expect(result[1].person?.first).toBe('John')
    })
  })
})