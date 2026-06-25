import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { StaffUser } from './types';

class UsersRepository extends BaseRepository<Omit<StaffUser, 'id'>> {
  constructor() {
    super(COLLECTIONS.STAFF);
  }
}

export const usersRepository = new UsersRepository();
