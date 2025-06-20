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
  User, 
  Crown,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Car,
  Edit,
  X,
  Copy,
  ExternalLink,
  Clock,
  Hash,
  Star,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Client {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  entreprise?: string
  adresse: string
  ville: string
  codePostal: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
  numeroClient: string
  createdAt: string
}

interface ClientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
  onEdit?: (client: Client) => void
}

export function ClientDetailsDialog({
  open,
  onOpenChange,
  client,
  onEdit
}: ClientDetailsDialogProps) {
  if (!client) return null

  const getClientInitials = (client: Client) => {
    return `${client.prenom.charAt(0)}${client.nom.charAt(0)}`.toUpperCase()
  }

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copié dans le presse-papiers`)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(client)
      onOpenChange(false)
    }
  }

  const vehiculesCount = Math.floor(Math.random() * 5) + 1
  const lastActivity = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  const totalOrders = Math.floor(Math.random() * 20) + 1
  const totalSpent = (Math.random() * 10000 + 1000).toFixed(2)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="relative bg-blue-600 p-8 rounded-t-lg">
          <DialogHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-white/10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.prenom}${client.nom}`} />
                  <AvatarFallback className="bg-white text-indigo-700 font-bold text-xl">
                    {getClientInitials(client)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-white text-3xl font-bold">
                    {client.prenom} {client.nom}
                  </DialogTitle>
                  <DialogDescription className="text-indigo-200 flex items-center gap-2">
                    <Hash className="h-4 w-4" /> {client.numeroClient}
                  </DialogDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={`text-white bg-${client.typeClient === 'GRAND_COMPTE' ? 'amber-500' : 'slate-300'} text-sm font-medium`}> 
                      {client.typeClient === 'GRAND_COMPTE' ? 'Grand Compte' : 'Client Standard'}
                    </Badge>
                    {client.entreprise && (
                      <Badge className="bg-white/20 border border-white text-white">{client.entreprise}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{
              icon: <Car className="text-emerald-600" />, label: 'Véhicules', value: vehiculesCount
            },{
              icon: <Hash className="text-blue-600" />, label: 'Commandes', value: totalOrders
            },{
              icon: <Star className="text-amber-600" />, label: "Chiffre d'affaires", value: `${totalSpent}€`
            },{
              icon: <Clock className="text-purple-600" />, label: 'Dernière activité', value: lastActivity.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
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
            {[{
              title: 'Contact',
              icon: <Mail className="text-blue-600" />,
              items: [
                { label: 'Email', value: client.email, type: 'email' },
                { label: 'Téléphone', value: client.telephone, type: 'tel' }
              ]
            }, {
              title: 'Adresse',
              icon: <MapPin className="text-orange-600" />,
              items: [
                { label: 'Adresse complète', value: `${client.adresse}, ${client.codePostal} ${client.ville}`, type: 'address' }
              ]
            }, client.entreprise && {
              title: 'Entreprise',
              icon: <Building className="text-purple-600" />,
              items: [
                { label: "Nom de l'entreprise", value: client.entreprise, type: 'text' }
              ]
            }, {
              title: 'Compte',
              icon: <User className="text-slate-600" />,
              items: [
                { label: 'Numéro client', value: client.numeroClient, type: 'text' },
                { label: "Date d'inscription", value: new Date(client.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }), type: 'text' }
              ]
            }].filter(Boolean).map((section, i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols">
                    {section.items.map((item, idx) => (
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
                          {item.type === 'address' && (
                            <Button variant="ghost" size="icon" onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(item.value)}`)}>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-slate-100 border-t">
          <p className="text-sm text-slate-500">Dernière modification : {new Date().toLocaleDateString('fr-FR')}</p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" /> Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}