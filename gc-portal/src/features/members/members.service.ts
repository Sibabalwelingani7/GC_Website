import { membersRepository } from './members.repository';
import type { Member } from './types';

export const membersService = {
  async create(data: Omit<Member, 'id'>) {
    return membersRepository.create(data);
  },

  async update(id: string, data: Partial<Omit<Member, 'id'>>) {
    return membersRepository.update(id, data);
  },

  async remove(id: string) {
    return membersRepository.remove(id);
  },

  async updateAttendance(id: string, status: string) {
    return membersRepository.update(id, { attendance: status });
  },
};
