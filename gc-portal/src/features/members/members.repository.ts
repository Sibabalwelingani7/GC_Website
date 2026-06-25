import { where, type QueryConstraint } from 'firebase/firestore';
import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { Member } from './types';

class MembersRepository extends BaseRepository<Omit<Member, 'id'>> {
  constructor() {
    super(COLLECTIONS.MEMBERS);
  }

  async getByDepartment(dept: string) {
    return this.getAll([where('dept', '==', dept)]);
  }
}

export const membersRepository = new MembersRepository();
