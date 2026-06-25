import { BaseRepository } from '@/services/base.repository';
import { COLLECTIONS } from '@/constants';
import type { CreativeGroup } from './types';

class CreativeArtsRepository extends BaseRepository<Omit<CreativeGroup, 'id'>> {
  constructor() {
    super(COLLECTIONS.CREATIVE_ARTS);
  }
}

export const creativeArtsRepository = new CreativeArtsRepository();
