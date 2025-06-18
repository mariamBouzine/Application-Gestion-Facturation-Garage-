'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Clock, Euro, Eye, CheckCircle, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AlerteFacture {
  id: string
  numeroFacture: string
  clientNom: string
  montant: number
  dateEcheance: Date
  joursRestants: number
  type: 'WARNING' | 'OVERDUE'
}

interface AlertsPanelProps {
  alertes: AlerteFacture[]
}

export function AlertsPanel({ alertes }: AlertsPanelProps) {
  const alertesWarning = alertes.filter(a => a.type === 'WARNING')
  const alertesOverdue = alertes.filter(a => a.type === 'OVERDUE')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const EmptyState = ({ type }: { type: 'warning' | 'overdue' }) => (
    <div className="flex flex-col items-center justify-center h-48 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
        type === 'warning' ? 'bg-emerald-100' : 'bg-emerald-100'
      }`}>
        <CheckCircle className="h-8 w-8 text-emerald-600" />
      </div>
      <p className="text-slate-600 font-medium">
        {type === 'warning' ? 'Aucune échéance proche' : 'Aucune facture impayée'}
      </p>
      <p className="text-sm text-slate-500 mt-1">
        {type === 'warning' 
          ? 'Toutes vos factures sont dans les délais' 
          : 'Tous vos paiements sont à jour'
        }
      </p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alertes Échéances Proches */}
      <Card className="border border-amber-200 bg-gradient-to-br from-white to-amber-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Échéances Proches</h3>
                <p className="text-sm text-slate-600">Factures à échéance dans 3 jours</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
              {alertesWarning.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {alertesWarning.length === 0 ? (
              <EmptyState type="warning" />
            ) : (
              <div className="space-y-3">
                {alertesWarning.map((alerte) => (
                  <div
                    key={alerte.id}
                    className="group p-4 rounded-lg border border-amber-200 bg-white hover:shadow-md transition-all duration-200 hover:border-amber-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                            {alerte.numeroFacture}
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800 text-xs">
                            J-{Math.abs(alerte.joursRestants)}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-slate-900 truncate group-hover:text-slate-800">
                          {alerte.clientNom}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Euro className="h-3 w-3" />
                            <span className="font-medium">{formatCurrency(alerte.montant)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(alerte.dateEcheance, 'dd/MM/yyyy', { locale: fr })}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="flex-shrink-0 hover:bg-amber-50">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Factures Impayées */}
      <Card className="border border-red-200 bg-gradient-to-br from-white to-red-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Factures Impayées</h3>
                <p className="text-sm text-slate-600">Échéances dépassées</p>
              </div>
            </div>
            <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
              {alertesOverdue.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {alertesOverdue.length === 0 ? (
              <EmptyState type="overdue" />
            ) : (
              <div className="space-y-3">
                {alertesOverdue.map((alerte) => (
                  <div
                    key={alerte.id}
                    className="group p-4 rounded-lg border border-red-200 bg-white hover:shadow-md transition-all duration-200 hover:border-red-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                            {alerte.numeroFacture}
                          </Badge>
                          <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs">
                            +{Math.abs(alerte.joursRestants)} jours
                          </Badge>
                        </div>
                        <h4 className="font-medium text-slate-900 truncate group-hover:text-slate-800">
                          {alerte.clientNom}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Euro className="h-3 w-3" />
                            <span className="font-medium text-red-600">{formatCurrency(alerte.montant)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(alerte.dateEcheance, 'dd/MM/yyyy', { locale: fr })}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="flex-shrink-0 hover:bg-red-50">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}