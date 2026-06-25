import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { CalendarEvent } from './types';

class CalendarRepository extends BaseRepository<Omit<CalendarEvent, 'id'>> {
  constructor() { super(COLLECTIONS.EVENTS); }
}

const repo = new CalendarRepository();

export const calendarService = {
  async create(data: Omit<CalendarEvent, 'id'>) { return repo.create(data); },
  async remove(id: string) { return repo.remove(id); },
};
