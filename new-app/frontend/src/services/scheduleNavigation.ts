import { api } from './api';
import type { AreaResponse, PersonResponse } from '@shared/types';

export interface AreaForSelection {
  id: number;
  name: string;
  shortName: string;
}

export interface PersonForSelection {
  id: number;
  name: string;
  first: string;
  last: string;
  category: {
    id: number;
    name: string;
    color: string;
  };
}

export interface PeopleByCategory {
  [categoryName: string]: PersonForSelection[];
}

// localStorage keys for remembering selections
const LAST_AREA_KEY = 'scheduler_last_area_id';
const LAST_PERSON_KEY = 'scheduler_last_person_id';

export const scheduleNavigationService = {
  /**
   * Get all areas for selection modal
   */
  async getAreasForSelection(): Promise<AreaForSelection[]> {
    // Get current schedule from store - for now hardcode to 1 (Published schedule)
    const response = await api.get('/areas?scheduleId=1');
    return response.data.map((area: AreaResponse) => ({
      id: area.id,
      name: area.name,
      shortName: area.shortName
    }));
  },

  /**
   * Get all people grouped by category for selection modal
   */
  async getPeopleForSelection(): Promise<PeopleByCategory> {
    // Get current schedule from store - for now hardcode to 1 (Published schedule)
    const response = await api.get('/people?scheduleId=1');
    const people: PersonResponse[] = response.data;
    
    // Group people by category
    const peopleByCategory: PeopleByCategory = {};
    
    people.forEach(person => {
      const categoryName = person.category.name;
      if (!peopleByCategory[categoryName]) {
        peopleByCategory[categoryName] = [];
      }
      
      peopleByCategory[categoryName].push({
        id: person.id,
        name: person.name,
        first: person.first,
        last: person.last,
        category: person.category
      });
    });

    // Sort people within each category by name
    Object.keys(peopleByCategory).forEach(categoryName => {
      peopleByCategory[categoryName].sort((a, b) => a.name.localeCompare(b.name));
    });

    return peopleByCategory;
  },

  /**
   * Remember the last selected area
   */
  setLastSelectedArea(areaId: number): void {
    localStorage.setItem(LAST_AREA_KEY, areaId.toString());
  },

  /**
   * Get the last selected area ID
   */
  getLastSelectedArea(): number | null {
    const stored = localStorage.getItem(LAST_AREA_KEY);
    return stored ? parseInt(stored, 10) : null;
  },

  /**
   * Remember the last selected person
   */
  setLastSelectedPerson(personId: number): void {
    localStorage.setItem(LAST_PERSON_KEY, personId.toString());
  },

  /**
   * Get the last selected person ID
   */
  getLastSelectedPerson(): number | null {
    const stored = localStorage.getItem(LAST_PERSON_KEY);
    return stored ? parseInt(stored, 10) : null;
  },

  /**
   * Navigate to area schedule view
   */
  navigateToAreaSchedule(areaId: number): string {
    this.setLastSelectedArea(areaId);
    return `/schedule-view/area/${areaId}`;
  },

  /**
   * Navigate to person schedule view
   */
  navigateToPersonSchedule(personId: number): string {
    this.setLastSelectedPerson(personId);
    return `/schedule-view/person/${personId}`;
  }
};