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
  Receipt, 
  User,
  Calendar,
  Euro,
  Copy,
  ExternalLink,
  Clock,
  Hash,
  Building,
  Phone,
  Mail,
  MapPin,
  Edit,
  X,
  CheckCircle,
  AlertTriangle,
  Timer,
  Download,
  CreditCard,
  FileText,
  DollarSign
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface FactureDetails {
  id: string
  numeroFacture: string
  date: string
  dateEcheance: string
  clientNom: string
  clientEmail: string
  clientTelephone: string
  numeroClient: string
  montantTTC: number
  montantHT: number
  tva: number
  statut: 'EN_ATTENTE' | 'PAYEE' | 'IMPAYEE' | 'PARTIELLEMENT_PAYEE' | 'ANNULEE'
  modePaiement: string | null
  dateReglement: string | null
  numeroODR: string
  observations: string
  createdAt: string
  updatedAt: string
}

interface FactureDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facture: FactureDetails | null
  onEdit?: (facture: FactureDetails) => void
}

export function FactureDetailsDialog({
  open,
  onOpenChange,
  facture,
  onEdit
}: FactureDetailsDialogProps) {
  if (!facture) return null

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'PAYEE':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Payée
          </Badge>
        )
      case 'EN_ATTENTE':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Timer className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        )
      case 'IMPAYEE':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Impayée
          </Badge>
        )
      case 'PARTIELLEMENT_PAYEE':
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Partiellement payée
          </Badge>
        )
      case 'ANNULEE':
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            <X className="h-3 w-3 mr-1" />
            Annulée
          </Badge>
        )
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getModePaiementText = (mode: string | null) => {
    if (!mode) return '-'
    switch (mode) {
      case 'ESPECES': return 'Espèces'
      case 'CHEQUE': return 'Chèque'
      case 'VIREMENT': return 'Virement'
      case 'TPE_VIVAWALLET': return 'TPE Vivawallet'
      case 'CREDIT_INTERNE': return 'Crédit Interne'
      case 'MIXTE': return 'Mixte'
      default: return mode
    }
  }

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copié dans le presse-papiers`)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(facture)
      onOpenChange(false)
    }
  }

  const getDaysFromCreation = () => {
    const created = new Date(facture.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const isOverdue = new Date(facture.dateEcheance) < new Date() && facture.statut !== 'PAYEE'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header Section */}
        <div className="relative bg-green-600 p-8 rounded-t-lg">
          <DialogHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-white/10">
                  <AvatarFallback className="bg-white text-green-700 font-bold text-xl">
                    <Receipt className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-white text-3xl font-bold">
                    {facture.numeroFacture}
                  </DialogTitle>
                  <DialogDescription className="text-green-200 flex items-center gap-2">
                    <Hash className="h-4 w-4" /> {facture.numeroClient} - {facture.clientNom}
                  </DialogDescription>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatutBadge(facture.statut)}
                    {facture.numeroODR && (
                      <Badge className="bg-white/20 border border-white text-white">
                        ODR: {facture.numeroODR}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(facture.montantTTC)}
                </div>
                <div className="text-green-200 text-sm">TTC</div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Stats Cards */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{
              icon: <Calendar className="text-blue-600" />, 
              label: 'Date émission', 
              value: format(new Date(facture.date), 'dd MMM yyyy', { locale: fr })
            },{
              icon: <Clock className={isOverdue ? "text-red-600" : "text-orange-600"} />, 
              label: 'Échéance', 
              value: format(new Date(facture.dateEcheance), 'dd MMM yyyy', { locale: fr })
            },{
              icon: <Euro className="text-green-600" />, 
              label: 'Montant HT', 
              value: `${facture.montantHT.toFixed(2)}€`
            },{
              icon: <Receipt className="text-purple-600" />, 
              label: 'TVA', 
              value: `${(facture.montantTTC - facture.montantHT).toFixed(2)}€`
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
                    { label: 'Nom complet', value: facture.clientNom, type: 'text' },
                    { label: 'Numéro client', value: facture.numeroClient, type: 'text' },
                    { label: 'Email', value: facture.clientEmail, type: 'email' },
                    { label: 'Téléphone', value: facture.clientTelephone, type: 'tel' }
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

            {/* Payment Information */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                    <CreditCard className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Informations de Paiement</h3>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { label: 'Mode de paiement', value: getModePaiementText(facture.modePaiement), type: 'text' },
                    ...(facture.dateReglement ? [{ label: 'Date de règlement', value: format(new Date(facture.dateReglement), 'dd/MM/yyyy à HH:mm', { locale: fr }), type: 'text' }] : [])
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

                  {/* Pricing Breakdown */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Montant HT:</span>
                        <span className="font-medium">{new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(facture.montantHT)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">TVA ({facture.tva}%):</span>
                        <span className="font-medium">{new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(facture.montantTTC - facture.montantHT)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total TTC:</span>
                        <span>{new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(facture.montantTTC)}</span>
                      </div>
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
                    <Calendar className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Dates et Observations</h3>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { label: 'Date d\'émission', value: format(new Date(facture.date), 'dd/MM/yyyy à HH:mm', { locale: fr }), type: 'text' },
                    { label: 'Date d\'échéance', value: format(new Date(facture.dateEcheance), 'dd/MM/yyyy', { locale: fr }), type: 'text' },
                    { label: 'Dernière modification', value: format(new Date(facture.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr }), type: 'text' }
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
                  
                  {facture.observations && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-sm font-medium text-slate-900 mb-2">Observations</p>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{facture.observations}</p>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(facture.observations, 'Observations')}>
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
            Créée le {format(new Date(facture.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            {onEdit && (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
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