import { creativeArtsRepository } from './creative-arts.repository';
import type { CreativeGroup } from './types';

const SEED_DATA: Omit<CreativeGroup, 'id'>[] = [
  { name: 'Dancing Stars', leader: 'Destiny Manuel', subtitle: 'Dance Ministry', desc: 'Worship God through expressive movement, choreography, praise dance, and kingdom creativity.', scripture: '1 Peter 4:10', photo: '' },
  { name: 'The Choir', leader: 'Jade Mienies', subtitle: 'Harmony & Worship', desc: 'Unite voices and hearts together to glorify God through powerful choral worship and music excellence.', scripture: 'Romans 12:1', photo: '' },
  { name: 'Film Stars', leader: 'Chelsie Ross', subtitle: 'Film Ministry', desc: 'Capture revival moments through cameras, graphics, editing, photography, livestreaming, and media.', scripture: 'Colossians 3:16', photo: '' },
];

export const creativeArtsService = {
  async seed() {
    for (const group of SEED_DATA) {
      await creativeArtsRepository.create(group);
    }
  },
  async create(data: Omit<CreativeGroup, 'id'>) {
    return creativeArtsRepository.create(data);
  },
  async update(id: string, data: Partial<Omit<CreativeGroup, 'id'>>) {
    return creativeArtsRepository.update(id, data);
  },
  async updatePhoto(id: string, photo: string) {
    return creativeArtsRepository.update(id, { photo });
  },
  async remove(id: string) {
    return creativeArtsRepository.remove(id);
  },
};
