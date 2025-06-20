'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { 
  FileText, 
  User,
  Car,
  Calendar,
  Euro,
  Copy,
  ExternalLink,
  Clock,
  Hash,
  Wrench,
  Building,
  Phone,
  Mail,
  MapPin,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Timer,
  Receipt,
  Download
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ODRDetails {
  id: string
  numeroODR: string
  date: string
  dateValidite?: string
  clientNom: string
  clientEmail: string
  clientTelephone: string
  numeroClient: string
  immatriculationVehicule: string
  marqueVehicule: string
  modeleVehicule: string
  typeService: 'MECANIQUE' | 'CARROSSERIE'
  statut: 'EN_COURS' | 'TERMINE' | 'ANNULE'
  montantHT: number
  montantTTC: number
  tva: number
  observations: string
  prestations: Array<{
    id: string
    nom: string
    quantite: number
    prixUnitaire: number
    total: number
  }>
  createdAt: string
  updatedAt: string
}

interface ODRDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  odr: ODRDetails | null
  onEdit?: (odr: ODRDetails) => void
}

export function ODRDetailsDialog({
  open,
  onOpenChange,
  odr,
  onEdit
}: ODRDetailsDialogProps) {
  if (!odr) return null

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Timer className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        )
      case 'TERMINE':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        )
      case 'ANNULE':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Annulé
          </Badge>
        )
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getServiceBadge = (service: string) => {
    return service === 'CARROSSERIE' ? (
      <Badge className="bg-orange-100 text-orange-700">
        <Car className="h-3 w-3 mr-1" />
        Carrosserie
      </Badge>
    ) : (
      <Badge className="bg-indigo-100 text-indigo-700">
        <Wrench className="h-3 w-3 mr-1" />
        Mécanique
      </Badge>
    )
  }

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copié dans le presse-papiers`)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(odr)
      onOpenChange(false)
    }
  }

  const getDaysFromCreation = () => {
    const created = new Date(odr.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header Section */}
        <div className="relative bg-blue-600 p-8 rounded-t-lg">
          <DialogHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-white/10">
                  <AvatarFallback className="bg-white text-blue-700 font-bold text-xl">
                    <FileText className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-white text-3xl font-bold">
                    ODR {odr.numeroODR}
                  </DialogTitle>
                  <DialogDescription className="text-blue-200 flex items-center gap-2">
                    <Hash className="h-4 w-4" /> {odr.numeroClient} - {odr.clientNom}
                  </DialogDescription>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatutBadge(odr.statut)}
                    {getServiceBadge(odr.typeService)}
                  </div>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(odr.montantTTC)}
                </div>
                <div className="text-blue-200 text-sm">TTC</div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Stats Cards */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{
              icon: <Calendar className="text-blue-600" />, 
              label: 'Date création', 
              value: format(new Date(odr.date), 'dd MMM yyyy', { locale: fr })
            },{
              icon: <Clock className="text-orange-600" />, 
              label: 'Ancienneté', 
              value: `${getDaysFromCreation()} jours`
            },{
              icon: <Euro className="text-green-600" />, 
              label: 'Montant HT', 
              value: `${odr.montantHT.toFixed(2)}€`
            },{
              icon: <Receipt className="text-purple-600" />, 
              label: 'Prestations', 
              value: odr.prestations.length
            }].map((item, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition duration-300">
                <CardContent className="p-4 text-center">
                  <div className="mx-auto mb-2 w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100">
                    {item.icon}
                  </div>
                  <div className="text-lg font-bold text-slate-800">{item.value}</div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6">
            {/* Client Information */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                    <User className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Informations Client</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: 'Nom complet', value: odr.clientNom, type: 'text' },
                    { label: 'Numéro client', value: odr.numeroClient, type: 'text' },
                    { label: 'Email', value: odr.clientEmail, type: 'email' },
                    { label: 'Téléphone', value: odr.clientTelephone, type: 'tel' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-600 break-words max-w-[250px]">{item.value}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(item.value, item.label)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        {item.type === 'email' && (
                          <Button variant="ghost" size="icon" onClick={() => window.open(`mailto:${item.value}`)}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        {item.type === 'tel' && (
                          <Button variant="ghost" size="icon" onClick={() => window.open(`tel:${item.value}`)}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                    <Car className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Véhicule</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: 'Immatriculation', value: odr.immatriculationVehicule, type: 'text' },
                    { label: 'Marque', value: odr.marqueVehicule, type: 'text' },
                    { label: 'Modèle', value: odr.modeleVehicule, type: 'text' },
                    { label: 'Type de service', value: odr.typeService === 'CARROSSERIE' ? 'Carrosserie' : 'Mécanique', type: 'text' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-600 break-words max-w-[250px]">{item.value}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(item.value, item.label)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prestations */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                    <Wrench className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Prestations</h3>
                    <p className="text-sm text-slate-500">{odr.prestations.length} prestation(s)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {odr.prestations.map((prestation, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{prestation.nom}</h4>
                          <p className="text-sm text-slate-600">
                            Quantité: {prestation.quantite} × {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(prestation.prixUnitaire)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(prestation.total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Sous-total HT:</span>
                      <span className="font-medium">{new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(odr.montantHT)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">TVA ({odr.tva}%):</span>
                      <span className="font-medium">{new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(odr.montantTTC - odr.montantHT)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total TTC:</span>
                      <span>{new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(odr.montantTTC)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates and Notes */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                    <Calendar className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Dates et Observations</h3>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { label: 'Date de création', value: format(new Date(odr.date), 'dd/MM/yyyy à HH:mm', { locale: fr }), type: 'text' },
                    ...(odr.dateValidite ? [{ label: 'Date de validité', value: format(new Date(odr.dateValidite), 'dd/MM/yyyy', { locale: fr }), type: 'text' }] : []),
                    { label: 'Dernière modification', value: format(new Date(odr.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr }), type: 'text' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-600">{item.value}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(item.value, item.label)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {odr.observations && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-sm font-medium text-slate-900 mb-2">Observations</p>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{odr.observations}</p>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(odr.observations, 'Observations')}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 bg-slate-100 border-t">
          <p className="text-sm text-slate-500">
            Créé le {format(new Date(odr.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}