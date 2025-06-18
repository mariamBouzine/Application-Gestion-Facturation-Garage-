import { prisma } from '@/database/prisma';

export class DashboardService {
  async getMetrics() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalClients,
      grandsComptes,
      odrJour,
      odrMois,
      odrAnnee,
      facturesEnCours,
      facturesImpayees
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { typeClient: 'GRAND_COMPTE' } }),
      prisma.ordreReparation.count({
        where: { createdAt: { gte: startOfDay } }
      }),
      prisma.ordreReparation.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.ordreReparation.count({
        where: { createdAt: { gte: startOfYear } }
      }),
      prisma.facture.count({
        where: { statut: 'EN_ATTENTE' }
      }),
      prisma.facture.count({
        where: { statut: 'IMPAYEE' }
      })
    ]);

    // Calculate amounts
    const [montantJour, montantMois, montantAnnee] = await Promise.all([
      prisma.ordreReparation.aggregate({
        where: { createdAt: { gte: startOfDay } },
        _sum: { montantTotal: true }
      }),
      prisma.ordreReparation.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { montantTotal: true }
      }),
      prisma.ordreReparation.aggregate({
        where: { createdAt: { gte: startOfYear } },
        _sum: { montantTotal: true }
      })
    ]);

    return {
      totalClients,
      grandsComptes,
      odrJour,
      odrMois,
      odrAnnee,
      montantJour: montantJour._sum.montantTotal || 0,
      montantMois: montantMois._sum.montantTotal || 0,
      montantAnnee: montantAnnee._sum.montantTotal || 0,
      facturesEnCours,
      facturesImpayees
    };
  }

  async getAlerts() {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Get invoices due soon (warning)
    const facturesWarning = await prisma.facture.findMany({
      where: {
        statut: 'EN_ATTENTE',
        dateEcheance: {
          gte: now,
          lte: threeDaysFromNow
        }
      },
      include: {
        client: {
          select: {
            nom: true,
            prenom: true
          }
        }
      },
      take: 10
    });

    // Get overdue invoices
    const facturesOverdue = await prisma.facture.findMany({
      where: {
        statut: 'IMPAYEE',
        dateEcheance: {
          lt: now
        }
      },
      include: {
        client: {
          select: {
            nom: true,
            prenom: true
          }
        }
      },
      take: 10
    });

    return {
      warning: facturesWarning.map(facture => ({
        id: facture.id,
        numeroFacture: facture.numeroFacture,
        clientNom: `${facture.client.prenom} ${facture.client.nom}`,
        montant: facture.montantTTC,
        dateEcheance: facture.dateEcheance,
        joursRestants: Math.ceil((facture.dateEcheance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        type: 'WARNING' as const
      })),
      overdue: facturesOverdue.map(facture => ({
        id: facture.id,
        numeroFacture: facture.numeroFacture,
        clientNom: `${facture.client.prenom} ${facture.client.nom}`,
        montant: facture.montantTTC,
        dateEcheance: facture.dateEcheance,
        joursRestants: Math.ceil((now.getTime() - facture.dateEcheance.getTime()) / (1000 * 60 * 60 * 24)) * -1,
        type: 'OVERDUE' as const
      }))
    };
  }

  async getRecentActivity(limit: number = 10) {
    // This would typically combine multiple tables to show recent activity
    // For now, we'll return recent ODRs as an example
    const recentODRs = await prisma.ordreReparation.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            nom: true,
            prenom: true
          }
        }
      }
    });

    return recentODRs.map(odr => ({
      id: odr.id,
      type: 'ODR' as const,
      title: 'Nouvel ODR créé',
      description: `${odr.numeroODR} - ${odr.typeService} pour ${odr.client.prenom} ${odr.client.nom}`,
      amount: odr.montantTotal,
      timestamp: odr.createdAt,
      serviceType: odr.typeService
    }));
  }
}