import { usersRepository } from './users.repository';
import type { StaffUser } from './types';

export const usersService = {
  async create(data: Omit<StaffUser, 'id'>) {
    return usersRepository.create(data);
  },
  async update(id: string, data: Partial<Omit<StaffUser, 'id'>>) {
    return usersRepository.update(id, data);
  },
  async remove(id: string) {
    return usersRepository.remove(id);
  },
};
