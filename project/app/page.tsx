'use client'

import { useState, useEffect } from 'react'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { ActivityFilter } from '@/components/dashboard/activity-filter'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton'
import { getDashboardMetrics } from '@/lib/mock-data'

// Mock data for alerts and activities
const mockAlertes = [
  {
    id: '1',
    numeroFacture: 'FAC-2024-001',
    clientNom: 'Martin Dubois',
    montant: 850.50,
    dateEcheance: new Date('2024-01-25T00:00:00Z'),
    joursRestants: 2,
    type: 'WARNING' as const
  },
  {
    id: '2',
    numeroFacture: 'FAC-2024-002',
    clientNom: 'Garage Centrale SARL',
    montant: 1250.00,
    dateEcheance: new Date('2024-01-20T00:00:00Z'),
    joursRestants: -3,
    type: 'OVERDUE' as const
  },
  {
    id: '3',
    numeroFacture: 'FAC-2024-003',
    clientNom: 'Sophie Lambert',
    montant: 450.75,
    dateEcheance: new Date('2024-01-26T00:00:00Z'),
    joursRestants: 3,
    type: 'WARNING' as const
  },
  {
    id: '4',
    numeroFacture: 'FAC-2024-004',
    clientNom: 'Transport Martin',
    montant: 2150.00,
    dateEcheance: new Date('2024-01-18T00:00:00Z'),
    joursRestants: -5,
    type: 'OVERDUE' as const
  }
]

const mockActivities = [
  {
    id: '1',
    type: 'ODR' as const,
    title: 'Nouvel ODR créé',
    description: 'ODR-2024-012 - Réparation carrosserie pour Martin Dubois (Peugeot 308)',
    amount: 850.50,
    timestamp: new Date('2024-01-23T16:30:00Z'),
    serviceType: 'CARROSSERIE' as const
  },
  {
    id: '2',
    type: 'FACTURE' as const,
    title: 'Facture payée',
    description: 'FAC-2024-008 - Paiement reçu par virement bancaire',
    amount: 1200.00,
    timestamp: new Date('2024-01-23T14:15:00Z')
  },
  {
    id: '3',
    type: 'DEVIS' as const,
    title: 'Devis accepté',
    description: 'DEV-2024-025 - Révision complète acceptée par le client',
    amount: 450.00,
    timestamp: new Date('2024-01-23T12:45:00Z'),
    serviceType: 'MECANIQUE' as const
  },
  {
    id: '4',
    type: 'CLIENT' as const,
    title: 'Nouveau client',
    description: 'Inscription de Sophie Martin - Entreprise Transport Plus',
    timestamp: new Date('2024-01-23T10:20:00Z')
  },
  {
    id: '5',
    type: 'ODR' as const,
    title: 'ODR terminé',
    description: 'ODR-2024-010 - Réparation mécanique terminée (Renault Clio)',
    amount: 320.00,
    timestamp: new Date('2024-01-22T17:00:00Z'),
    serviceType: 'MECANIQUE' as const
  },
  {
    id: '6',
    type: 'DEVIS' as const,
    title: 'Nouveau devis',
    description: 'DEV-2024-026 - Devis carrosserie pour accident mineur',
    amount: 750.00,
    timestamp: new Date('2024-01-22T15:30:00Z'),
    serviceType: 'CARROSSERIE' as const
  }
]

export default function Dashboard() {
  const [selectedActivity, setSelectedActivity] = useState<'ALL' | 'CARROSSERIE' | 'MECANIQUE'>('ALL')
  const [metrics, setMetrics] = useState(getDashboardMetrics())
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Refresh metrics when component mounts or when activity filter changes
  useEffect(() => {
    if (!isLoading) {
      setMetrics(getDashboardMetrics())
    }
  }, [selectedActivity, isLoading])

  // Filter activities based on selected filter
  const filteredActivities = mockActivities.filter(activity => {
    if (selectedActivity === 'ALL') return true
    return activity.serviceType === selectedActivity
  })

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Tableau de Bord
              </h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-emerald-700">En direct</span>
              </div>
            </div>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
              Vue d'ensemble de l'activité de votre garage automobile
            </p>
            <p className="text-sm text-slate-500">
              Dernière mise à jour: {new Date().toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <ActivityFilter 
              selectedActivity={selectedActivity}
              onActivityChange={setSelectedActivity}
            />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Indicateurs Clés</h2>
          <MetricsCards metrics={metrics} />
        </div>

        {/* Alerts Panel */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Alertes et Notifications</h2>
          <AlertsPanel alertes={mockAlertes} />
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Activité Récente</h2>
            <span className="text-sm text-slate-500">
              {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''}
              {selectedActivity !== 'ALL' && ` • ${selectedActivity.toLowerCase()}`}
            </span>
          </div>
          <RecentActivity activities={filteredActivities} />
        </div>
      </div>
    </div>
  )
}