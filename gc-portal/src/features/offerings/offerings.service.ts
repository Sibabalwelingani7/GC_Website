import { serverTimestamp } from 'firebase/firestore';
import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { OfferingRecord } from './types';

class OfferingsRepository extends BaseRepository<Omit<OfferingRecord, 'id'>> {
  constructor() { super(COLLECTIONS.OFFERINGS); }
}

const repo = new OfferingsRepository();

export const offeringsService = {
  async create(date: string, amount: number) {
    return repo.create({ date, amount, createdAt: serverTimestamp() });
  },
  async remove(id: string) {
    return repo.remove(id);
  },
};
