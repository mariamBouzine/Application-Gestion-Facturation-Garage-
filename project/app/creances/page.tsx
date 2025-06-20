'use client'

import { useState } from 'react'
import { CreanceForm } from '@/components/forms/creance-form'
import { toast } from 'sonner'

// Mock data - replace with your actual data fetching
const mockODRs = [
  {
    id: '1',
    numeroODR: 'ODR-2024-001',
    clientNom: 'Martin Dupont',
    vehicule: 'Peugeot 308',
    montantTotal: 1250.50,
    dateCreation: new Date('2024-01-15'),
    statut: 'TERMINE' as const
  },
  {
    id: '2',
    numeroODR: 'ODR-2024-002',
    clientNom: 'Sophie Bernard',
    vehicule: 'Renault Clio',
    montantTotal: 850.00,
    dateCreation: new Date('2024-01-20'),
    statut: 'FACTURE' as const
  },
  {
    id: '3',
    numeroODR: 'ODR-2024-003',
    clientNom: 'Pierre Moreau',
    vehicule: 'Citroën C3',
    montantTotal: 450.75,
    dateCreation: new Date('2024-01-22'),
    statut: 'TERMINE' as const
  }
]

const mockModelesCreance = [
  {
    id: '1',
    nom: 'Première Relance',
    description: 'Courrier de relance amiable pour facture impayée',
    typeDocument: 'RELANCE' as const
  },
  {
    id: '2',
    nom: 'Deuxième Relance',
    description: 'Relance ferme avec majoration de retard',
    typeDocument: 'RELANCE' as const
  },
  {
    id: '3',
    nom: 'Mise en Demeure Standard',
    description: 'Mise en demeure avant action en justice',
    typeDocument: 'MISE_EN_DEMEURE' as const
  },
  {
    id: '4',
    nom: 'Sommation de Payer',
    description: 'Dernier avertissement avant procédure judiciaire',
    typeDocument: 'SOMMATION' as const
  }
]

const mockResultats = [
  {
    id: '1',
    odr: mockODRs[0],
    modeleUtilise: mockModelesCreance[0],
    lienTelechargement: '/documents/creance-odr-001-relance-1.pdf',
    dateGeneration: new Date('2024-01-25T10:30:00'),
    statut: 'TELECHARGE' as const
  },
  {
    id: '2',
    odr: mockODRs[1],
    modeleUtilise: mockModelesCreance[2],
    lienTelechargement: '/documents/creance-odr-002-mise-en-demeure.pdf',
    dateGeneration: new Date('2024-01-26T14:15:00'),
    statut: 'GENERE' as const
  }
]

export default function CreancesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [resultats, setResultats] = useState(mockResultats)

  const handleGenerer = async (odrId: string, modeleId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const odr = mockODRs.find(o => o.id === odrId)
      const modele = mockModelesCreance.find(m => m.id === modeleId)
      
      if (odr && modele) {
        const nouveauResultat = {
          id: `${Date.now()}`,
          odr,
          modeleUtilise: modele,
          lienTelechargement: `/documents/creance-${odr.numeroODR.toLowerCase()}-${modele.nom.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          dateGeneration: new Date(),
          statut: 'GENERE' as const
        }
        
        setResultats(prev => [nouveauResultat, ...prev])
        toast.success('Document de créance généré avec succès!')
      }
    } catch (error) {
      console.error('Erreur génération:', error)
      toast.error('Erreur lors de la génération du document')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <CreanceForm
        odrs={mockODRs}
        modelesCreance={mockModelesCreance}
        resultats={resultats}
        onGenerer={handleGenerer}
        isLoading={isLoading}
      />
    </div>
  )
}