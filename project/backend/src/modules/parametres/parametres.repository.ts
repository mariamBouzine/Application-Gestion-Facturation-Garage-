import { Parametres } from '@prisma/client';
import { prisma } from '@/database/prisma';

export class ParametresRepository {
  async getOrCreate(): Promise<Parametres> {
    let parametres = await prisma.parametres.findFirst();
    
    if (!parametres) {
      parametres = await prisma.parametres.create({
        data: {
          activationAgentSuivi: true,
          activationAgentODR: true,
          activationAgentEmails: false,
          affichagePrixCarrosserie: true,
          affichagePrixMecanique: true,
          modesPaiementAutorises: ['ESPECES', 'CHEQUE', 'VIREMENT'],
          delaiAlerteEcheance: 3
        }
      });
    }

    return parametres;
  }

  async update(data: Partial<Parametres>): Promise<Parametres> {
    const existing = await this.getOrCreate();
    
    return prisma.parametres.update({
      where: { id: existing.id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }
}