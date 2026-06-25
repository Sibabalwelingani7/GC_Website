import { membersRepository, type Member } from './members.repository';

export const membersService = {
  async getAll() {
    return membersRepository.getAll();
  },

  async getByDepartment(dept: string) {
    return membersRepository.getByDepartment(dept);
  },

  async create(data: Omit<Member, 'id'>) {
    return membersRepository.create(data);
  },

  async update(id: string, data: Partial<Member>) {
    return membersRepository.update(id, data);
  },

  async remove(id: string) {
    return membersRepository.remove(id);
  },
};
