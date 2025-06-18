'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Crown, 
  ClipboardList, 
  Euro, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface MetricsCardsProps {
  metrics: {
    totalClients: number
    grandsComptes: number
    odrJour: number
    odrMois: number
    odrAnnee: number
    montantJour: number
    montantMois: number
    montantAnnee: number
    facturesEnCours: number
    facturesImpayees: number
  }
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const cards = [
    {
      title: 'Chiffre d\'Affaires',
      value: formatCurrency(metrics.montantJour),
      subtitle: `${formatCurrency(metrics.montantMois)} ce mois`,
      icon: Euro,
      trend: { value: 12.5, isPositive: true },
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'ODR Actifs',
      value: metrics.odrJour.toString(),
      subtitle: `${metrics.odrMois} ce mois`,
      icon: ClipboardList,
      trend: { value: 8.2, isPositive: true },
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Clients',
      value: metrics.totalClients.toString(),
      subtitle: `${metrics.grandsComptes} grands comptes`,
      icon: Users,
      trend: { value: 5.1, isPositive: true },
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Factures',
      value: metrics.facturesEnCours.toString(),
      subtitle: `${metrics.facturesImpayees} impayées`,
      icon: FileText,
      trend: { value: 2.3, isPositive: false },
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className={`group relative overflow-hidden border ${card.borderColor} bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <div className={`w-5 h-5 rounded bg-gradient-to-r ${card.gradient} flex items-center justify-center`}>
                  <card.icon className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                  {card.value}
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  card.trend.isPositive 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {card.trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {card.trend.value}%
                </div>
              </div>
              <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                {card.subtitle}
              </p>
            </div>
          </CardContent>
          
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        </Card>
      ))}
    </div>
  )
}