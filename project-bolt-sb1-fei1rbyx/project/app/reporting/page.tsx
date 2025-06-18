'use client'

import { useState } from 'react'
import { ReportingConfig } from '@/components/forms/reporting-config'
import { toast } from 'sonner'

interface ReportingConfigType {
  heureEnvoi: string
  emails: string[]
  contenuRapport: {
    odr: boolean
    paiement: boolean
    facture: boolean
    nouveauxClients: boolean
  }
}

// Mock initial config
const initialConfig: ReportingConfigType = {
  heureEnvoi: '08:00',
  emails: ['admin@garage.com'],
  contenuRapport: {
    odr: true,
    paiement: false,
    facture: true,
    nouveauxClients: false
  }
}

export default function ReportingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<ReportingConfigType>(initialConfig)

  const handleSave = async (newConfig: ReportingConfigType) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setConfig(newConfig)
      toast.success('Configuration sauvegardée avec succès!')
      
      // Log the saved config (in real app, this would be an API call)
      console.log('Configuration sauvegardée:', newConfig)
      
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration du Reporting</h1>
          <p className="text-gray-600">
            Configurez l'envoi automatique de vos rapports quotidiens
          </p>
        </div>

        {/* Reporting Configuration Form */}
        <ReportingConfig
          config={config}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}