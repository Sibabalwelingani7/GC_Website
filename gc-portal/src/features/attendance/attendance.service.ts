import { serverTimestamp } from 'firebase/firestore';
import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { AttendanceRecord } from './types';

class AttendanceRepository extends BaseRepository<Omit<AttendanceRecord, 'id'>> {
  constructor() {
    super(COLLECTIONS.ATTENDANCE);
  }
}

const repo = new AttendanceRepository();

export const attendanceService = {
  async create(date: string, count: number) {
    return repo.create({ date, count, createdAt: serverTimestamp() });
  },
  async remove(id: string) {
    return repo.remove(id);
  },
};
