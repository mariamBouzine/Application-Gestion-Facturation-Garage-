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
import {
  Car,
  Calendar,
  Gauge,
  Hash,
  User,
  Edit,
  X,
  Copy,
  ExternalLink,
  Clock,
  Wrench,
  Mail,
  Phone,
  MapPin,
  Building
} from 'lucide-react'
import { toast } from 'sonner'

interface Vehicule {
  id: string
  immatriculation: string
  marque: string
  modele: string
  annee: number
  numeroSerie?: string
  kilometrage?: number | null
  clientId: string
  couleur?: string
  dateCreation?: string
  dateModification?: string
}

interface Client {
  id: string
  nom: string
  prenom: string
  numeroClient: string
  email: string
  telephone: string
  adresse?: string
  ville?: string
  codePostal?: string
}

interface VehiculeDetailsDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
 vehicule: Vehicule | null
 onEdit?: (vehicule: Vehicule) => void
 clients: Client[]
}

export function VehiculeDetailsDialog({
 open,
 onOpenChange,
 vehicule,
 onEdit,
 clients
}: VehiculeDetailsDialogProps) {
 if (!vehicule) return null

 const client = clients.find(c => c.id === vehicule.clientId)
 
 const handleCopy = (value: string, label: string) => {
   navigator.clipboard.writeText(value)
   toast.success(`${label} copié dans le presse-papiers`)
 }

 const handleEdit = () => {
   if (onEdit) {
     onEdit(vehicule)
     onOpenChange(false)
   }
 }

 const getVehiculeAge = (annee: number) => {
   const age = new Date().getFullYear() - annee
   if (age <= 3) return { label: 'Récent', color: 'bg-green-100 text-green-800 border-green-200' }
   if (age <= 8) return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
   return { label: 'Ancien', color: 'bg-red-100 text-red-800 border-red-200' }
 }

 const getKilometrageStatus = (km: number | null) => {
   if (!km) return null
   if (km < 50000) return { label: 'Faible', color: 'bg-green-100 text-green-800' }
   if (km < 150000) return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' }
   return { label: 'Élevé', color: 'bg-red-100 text-white-800' }
 }

 // Mock data for maintenance and last revision
 const maintenanceCount = Math.floor(Math.random() * 10) + 1
 const lastRevisionDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
   .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

 return (
   <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto p-0 gap-0">
       {/* Header with gradient background */}
       <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-t-lg">
         <DialogHeader className="relative z-10">
           <div className="flex items-start justify-between">
             <div className="flex items-center gap-6">
               <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                 <Car className="h-12 w-12 text-white" />
               </div>
               <div>
                 <DialogTitle className="text-white text-3xl font-bold">
                   {vehicule.marque} {vehicule.modele}
                 </DialogTitle>
                 <DialogDescription className="text-indigo-200 flex items-center gap-2 text-lg">
                   <Hash className="h-4 w-4" /> {vehicule.immatriculation}
                 </DialogDescription>
                 <div className="mt-3 flex items-center gap-3 flex-wrap">
                   <Badge className={`text-white ${getVehiculeAge(vehicule.annee).color} bg-white/20 border-white/30`}> 
                     {vehicule.annee} - {getVehiculeAge(vehicule.annee).label}
                   </Badge>
                   {vehicule.kilometrage && (
                     <Badge className="bg-white/20 border border-white/30 text-white">
                       {vehicule.kilometrage.toLocaleString()} km
                     </Badge>
                   )}
                   {vehicule.couleur && (
                     <Badge className="bg-white/20 border border-white/30 text-white">
                       {vehicule.couleur}
                     </Badge>
                   )}
                 </div>
               </div>
             </div>
           </div>
         </DialogHeader>
       </div>

       {/* Stats Cards */}
       <div className="p-6 bg-slate-50">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             {
               icon: <Calendar className="text-blue-600" />, 
               label: 'Âge', 
               value: `${new Date().getFullYear() - vehicule.annee} ans`,
               bgColor: 'bg-blue-50'
             },
             {
               icon: <Gauge className="text-green-600" />, 
               label: 'Kilométrage', 
               value: vehicule.kilometrage ? `${vehicule.kilometrage.toLocaleString()} km` : 'Non renseigné',
               bgColor: 'bg-green-50'
             },
             {
               icon: <Wrench className="text-purple-600" />, 
               label: 'Maintenances', 
               value: maintenanceCount.toString(),
               bgColor: 'bg-purple-50'
             },
             {
               icon: <Clock className="text-amber-600" />, 
               label: 'Dernière révision', 
               value: lastRevisionDate,
               bgColor: 'bg-amber-50'
             }
           ].map((item, index) => (
             <Card key={index} className="shadow-sm hover:shadow-md transition-all duration-300 border-0">
               <CardContent className="p-4 text-center">
                 <div className={`mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center ${item.bgColor}`}>
                   {item.icon}
                 </div>
                 <div className="text-lg font-bold text-slate-900 mb-1">{item.value}</div>
                 <p className="text-sm text-slate-600">{item.label}</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>

       {/* Detailed Information */}
       <div className="p-6 space-y-6">
         {/* Vehicle Information */}
         <Card className="border-slate-200 shadow-sm">
           <CardContent className="p-6">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                 <Car className="text-blue-600 h-6 w-6" />
               </div>
               <div>
                 <h3 className="text-xl font-semibold text-slate-900">Informations du Véhicule</h3>
                 <p className="text-slate-600">Détails d'identification et caractéristiques</p>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Immatriculation', value: vehicule.immatriculation, icon: <Hash className="h-4 w-4" /> },
                 { label: 'Marque', value: vehicule.marque, icon: <Car className="h-4 w-4" /> },
                 { label: 'Modèle', value: vehicule.modele, icon: <Car className="h-4 w-4" /> },
                 { label: 'Année', value: vehicule.annee.toString(), icon: <Calendar className="h-4 w-4" /> },
                 ...(vehicule.couleur ? [{ label: 'Couleur', value: vehicule.couleur, icon: <div className="w-4 h-4 bg-slate-400 rounded-full" /> }] : []),
                 ...(vehicule.numeroSerie ? [{ label: 'Numéro de série (VIN)', value: vehicule.numeroSerie, icon: <Hash className="h-4 w-4" /> }] : []),
                 ...(vehicule.kilometrage ? [{ label: 'Kilométrage', value: `${vehicule.kilometrage.toLocaleString()} km`, icon: <Gauge className="h-4 w-4" /> }] : [])
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="text-slate-500">{item.icon}</div>
                     <div>
                       <p className="font-medium text-slate-900">{item.label}</p>
                       <p className="text-slate-600 break-words">{item.value}</p>
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

         {/* Client Information */}
         {client && (
           <Card className="border-slate-200 shadow-sm">
             <CardContent className="p-6">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                   <User className="text-green-600 h-6 w-6" />
                 </div>
                 <div>
                   <h3 className="text-xl font-semibold text-slate-900">Propriétaire</h3>
                   <p className="text-slate-600">Informations du client</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 {[
                   { 
                     label: 'Nom complet', 
                     value: `${client.prenom} ${client.nom}`, 
                     icon: <User className="h-4 w-4" />,
                     type: 'text'
                   },
                   { 
                     label: 'Email', 
                     value: client.email, 
                     icon: <Mail className="h-4 w-4" />,
                     type: 'email'
                   },
                   { 
                     label: 'Téléphone', 
                     value: client.telephone, 
                     icon: <Phone className="h-4 w-4" />,
                     type: 'tel'
                   },
                   { 
                     label: 'Numéro client', 
                     value: client.numeroClient, 
                     icon: <Hash className="h-4 w-4" />,
                     type: 'text'
                   },
                   ...(client.adresse ? [{
                     label: 'Adresse',
                     value: `${client.adresse}${client.ville ? `, ${client.ville}` : ''}${client.codePostal ? ` ${client.codePostal}` : ''}`,
                     icon: <MapPin className="h-4 w-4" />,
                     type: 'text'
                   }] : [])
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                     <div className="flex items-center gap-3 flex-1">
                       <div className="text-slate-500">{item.icon}</div>
                       <div className="min-w-0 flex-1">
                         <p className="font-medium text-slate-900">{item.label}</p>
                         <p className="text-slate-600 break-words">{item.value}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-1">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleCopy(item.value, item.label)}
                         className="hover:bg-slate-200 transition-colors"
                       >
                         <Copy className="h-4 w-4" />
                       </Button>
                       {item.type === 'email' && (
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => window.open(`mailto:${item.value}`)}
                           className="hover:bg-slate-200 transition-colors"
                         >
                           <ExternalLink className="h-4 w-4" />
                         </Button>
                       )}
                       {item.type === 'tel' && (
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => window.open(`tel:${item.value}`)}
                           className="hover:bg-slate-200 transition-colors"
                         >
                           <ExternalLink className="h-4 w-4" />
                         </Button>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         )}
       </div>

       {/* Footer */}
       <div className="flex items-center justify-between p-6 bg-slate-100 border-t border-slate-200">
         <div className="text-sm text-slate-500">
           <p>Créé le : {vehicule.dateCreation || new Date().toLocaleDateString('fr-FR')}</p>
           {vehicule.dateModification && (
             <p>Modifié le : {vehicule.dateModification}</p>
           )}
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