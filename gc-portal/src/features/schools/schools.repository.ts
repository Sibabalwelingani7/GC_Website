import { where } from 'firebase/firestore';
import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { School, SchoolType } from './types';

class SchoolsRepository extends BaseRepository<Omit<School, 'id'>> {
  constructor() {
    super(COLLECTIONS.CAMPUSES);
  }

  async getByType(type: SchoolType) {
    return this.getAll([where('instType', '==', type)]);
  }
}

export const schoolsRepository = new SchoolsRepository();
