'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { FileText, Wrench, PaintBucket, Euro, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ActivityItem {
  id: string
  type: 'DEVIS' | 'ODR' | 'FACTURE' | 'CLIENT'
  title: string
  description: string
  amount?: number
  timestamp: Date
  serviceType?: 'CARROSSERIE' | 'MECANIQUE'
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityConfig = (type: string, serviceType?: string) => {
    switch (type) {
      case 'DEVIS':
        return {
          icon: FileText,
          gradient: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700'
        }
      case 'ODR':
        return serviceType === 'CARROSSERIE' ? {
          icon: PaintBucket,
          gradient: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700'
        } : {
          icon: Wrench,
          gradient: 'from-emerald-500 to-emerald-600',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700'
        }
      case 'FACTURE':
        return {
          icon: Euro,
          gradient: 'from-amber-500 to-amber-600',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700'
        }
      case 'CLIENT':
        return {
          icon: Users,
          gradient: 'from-indigo-500 to-indigo-600',
          bgColor: 'bg-indigo-50',
          textColor: 'text-indigo-700'
        }
      default:
        return {
          icon: FileText,
          gradient: 'from-slate-500 to-slate-600',
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-700'
        }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getServiceTypeBadge = (serviceType?: string) => {
    if (!serviceType) return null
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${
          serviceType === 'CARROSSERIE' 
            ? 'bg-purple-50 text-purple-700 border-purple-200' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}
      >
        {serviceType === 'CARROSSERIE' ? 'Carrosserie' : 'Mécanique'}
      </Badge>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className="border border-slate-200">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">Aucune activité récente</h3>
          <p className="text-sm text-slate-500">
            Les nouvelles activités apparaîtront ici
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Clock className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Activité Récente</h3>
            <p className="text-sm text-slate-600 font-normal">Dernières actions dans votre garage</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const config = getActivityConfig(activity.type, activity.serviceType)
              const Icon = config.icon
              
              return (
                <div key={activity.id} className="relative">
                  {/* Timeline line */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-6 top-12 w-px h-8 bg-slate-200" />
                  )}
                  
                  <div className="group flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-all duration-200">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className={`${config.bgColor} border border-slate-200`}>
                        <div className={`w-6 h-6 rounded bg-gradient-to-r ${config.gradient} flex items-center justify-center`}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 group-hover:text-slate-800 transition-colors">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          {activity.amount && (
                            <span className="text-sm font-semibold text-emerald-600">
                              {formatCurrency(activity.amount)}
                            </span>
                          )}
                          {getServiceTypeBadge(activity.serviceType)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(activity.timestamp, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}