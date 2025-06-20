import { Parametres } from '@prisma/client';
import { ParametresRepository } from './parametres.repository';

export class ParametresService {
  private parametresRepository: ParametresRepository;

  constructor() {
    this.parametresRepository = new ParametresRepository();
  }

  async getParametres(): Promise<Parametres> {
    return this.parametresRepository.getOrCreate();
  }

  async updateParametres(data: Partial<Parametres>): Promise<Parametres> {
    return this.parametresRepository.update(data);
  }
}