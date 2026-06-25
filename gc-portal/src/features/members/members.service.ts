import { membersRepository } from './members.repository';
import type { Member } from './types';

export const membersService = {
  async getAll(): Promise<Member[]> {
    return membersRepository.getAll() as Promise<Member[]>;
  },

  async getByDepartment(dept: string): Promise<Member[]> {
    return membersRepository.getByDepartment(dept) as Promise<Member[]>;
  },
};
