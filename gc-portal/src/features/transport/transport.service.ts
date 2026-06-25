import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { Driver } from './types';

class TransportRepository extends BaseRepository<Omit<Driver, 'id'>> {
  constructor() { super(COLLECTIONS.TRANSPORT); }
}

const repo = new TransportRepository();

export const transportService = {
  async create(data: Omit<Driver, 'id'>) { return repo.create(data); },
  async update(id: string, data: Partial<Omit<Driver, 'id'>>) { return repo.update(id, data); },
  async remove(id: string) { return repo.remove(id); },
};
