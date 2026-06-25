import { where } from 'firebase/firestore';
import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';

export interface Member {
  name: string;
  phone: string;
  address: string;
  dob: string;
  dept: string;
  occ: string;
  target: string;
  subData?: string;
  photo?: string;
  email?: string;
  attendance: string;
}

class MembersRepository extends BaseRepository<Member> {
  constructor() {
    super(COLLECTIONS.MEMBERS);
  }

  async getByDepartment(dept: string) {
    return this.getAll([where('dept', '==', dept)]);
  }
}

export const membersRepository = new MembersRepository();
