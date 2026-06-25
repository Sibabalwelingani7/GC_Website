import { schoolsRepository } from './schools.repository';
import type { SchoolType } from './types';

export const schoolsService = {
  async create(data: { name: string; address: string; photo: string; instType: SchoolType }) {
    return schoolsRepository.create(data);
  },
  async updatePhoto(id: string, photo: string) {
    return schoolsRepository.update(id, { photo });
  },
  async remove(id: string) {
    return schoolsRepository.remove(id);
  },
};
