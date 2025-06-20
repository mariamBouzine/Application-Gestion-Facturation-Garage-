'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  FileText,
  Calendar,
  Euro,
  User,
  Car,
  X,
  Copy,
  Download,
  Send,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Hash,
  PaintBucket,
  Wrench,
  CreditCard,
  Building
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

interface DevisDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  devis: any | null
  onEdit?: (devis: any) => void
  onStatusChange?: (devisId: string, newStatus: string) => void
  clients: any[]
  vehicules: any[]
}

export function DevisDetailsDialog({
  open,
  onOpenChange,
  devis,
  onEdit,
  onStatusChange,
  clients,
  vehicules
}: DevisDetailsDialogProps) {
  if (!devis) return null

  const client = clients.find(c => c.id === devis.clientId)
  const vehicule = vehicules.find(v => v.id === devis.vehiculeId)

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copié dans le presse-papiers`)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(devis)
      onOpenChange(false)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(devis.id, newStatus)
      toast.success(`Statut mis à jour vers: ${getStatutLabel(newStatus)}`)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ACCEPTE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REFUSE':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'EXPIRE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En Attente'
      case 'ACCEPTE':
        return 'Accepté'
      case 'REFUSE':
        return 'Refusé'
      case 'EXPIRE':
        return 'Expiré'
      default:
        return statut
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return <Clock className="h-4 w-4" />
      case 'ACCEPTE':
        return <CheckCircle className="h-4 w-4" />
      case 'REFUSE':
        return <XCircle className="h-4 w-4" />
      case 'EXPIRE':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
          <DialogHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-white text-2xl font-bold">
                    Devis {devis.numeroDevis}
                  </DialogTitle>
                  <DialogDescription className="text-indigo-200 text-base">
                    Créé le {format(devis.date, 'dd MMMM yyyy', { locale: fr })}
                  </DialogDescription>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <Badge className={`${getStatutColor(devis.statut)} bg-white/20 border-white/30 text-white`}>
                      {getStatutIcon(devis.statut)}
                      <span className="ml-1">{getStatutLabel(devis.statut)}</span>
                    </Badge>
                    <Badge className="bg-white/20 border border-white/30 text-white">
                      {devis.typeService === 'CARROSSERIE' ? (
                        <>
                          <PaintBucket className="mr-1 h-3 w-3" />
                          Carrosserie
                        </>
                      ) : (
                        <>
                          <Wrench className="mr-1 h-3 w-3" />
                          Mécanique
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Information */}
          {client && (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                    <User className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Client</h3>
                    <p className="text-slate-600">Informations du client</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      label: 'Nom complet', 
                      value: `${client.prenom} ${client.nom}`, 
                      icon: <User className="h-4 w-4" />
                    },
                    { 
                      label: 'Numéro client', 
                      value: client.numeroClient, 
                      icon: <Hash className="h-4 w-4" />
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="text-slate-500">{item.icon}</div>
                        <div>
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-slate-600">{item.value}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleCopy(item.value, item.label)}
                        className="hover:bg-slate-200 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Information */}
          {vehicule && (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                    <Car className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Véhicule</h3>
                    <p className="text-slate-600">Détails du véhicule</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      label: 'Marque et modèle', 
                      value: `${vehicule.marque} ${vehicule.modele}`, 
                      icon: <Car className="h-4 w-4" />
                    },
                    { 
                      label: 'Immatriculation', 
                      value: vehicule.immatriculation, 
                      icon: <Hash className="h-4 w-4" />
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="text-slate-500">{item.icon}</div>
                        <div>
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-slate-600">{item.value}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleCopy(item.value, item.label)}
                        className="hover:bg-slate-200 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Devis Details */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
                  <FileText className="text-purple-600 h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Détails du Devis</h3>
                  <p className="text-slate-600">Informations générales</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    label: 'Date de création', 
                    value: format(devis.date, 'dd/MM/yyyy', { locale: fr }), 
                    icon: <Calendar className="h-4 w-4" />
                  },
                  { 
                    label: 'Date de validité', 
                    value: format(devis.dateValidite, 'dd/MM/yyyy', { locale: fr }), 
                    icon: <Calendar className="h-4 w-4" />
                  },
                  { 
                    label: 'Total HT', 
                    value: `${devis.totalHT.toFixed(2)} €`, 
                    icon: <Euro className="h-4 w-4" />
                  },
                  { 
                    label: 'Total TTC', 
                    value: `${devis.totalTTC.toFixed(2)} €`, 
                    icon: <Euro className="h-4 w-4" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-500">{item.icon}</div>
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-slate-600">{item.value}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(item.value, item.label)}
                      className="hover:bg-slate-200 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100">
                  <CheckCircle className="text-orange-600 h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Gestion du Statut</h3>
                  <p className="text-slate-600">Modifier le statut du devis</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { status: 'EN_ATTENTE', label: 'En Attente', icon: Clock, color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' },
                  { status: 'ACCEPTE', label: 'Accepté', icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
                  { status: 'REFUSE', label: 'Refusé', icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' },
                  { status: 'EXPIRE', label: 'Expiré', icon: AlertTriangle, color: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100' }
                ].map((item) => (
                  <Button
                    key={item.status}
                    variant="outline"
                    onClick={() => handleStatusChange(item.status)}
                    disabled={devis.statut === item.status}
                    className={`${item.color} transition-all duration-200 ${devis.statut === item.status ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-slate-100 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            <p>Créé le : {format(devis.createdAt || devis.date, 'dd/MM/yyyy à HH:mm', { locale: fr })}</p>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-slate-200 transition-colors">
            <X className="h-4 w-4 mr-2" /> 
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}