'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Receipt, 
  User, 
  Calendar as CalendarIcon, 
  Euro, 
  FileText,
  Users,
  Clock,
  Calculator,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
  DollarSign,
  CreditCard
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface FactureFormData {
  clientId: string
  montantTTC: number
  dateEcheance: Date
  numeroODR: string
}

interface Client {
  id: string
  nom: string
  prenom: string
  numeroClient: string
}

interface ODR {
  id: string
  numeroODR: string
  clientNom: string
  montantTotal: number
}

interface FactureFormProps {
  onSubmit: (data: FactureFormData) => void
  onCancel: () => void
  clients: Client[]
  odrs: ODR[]
  isLoading?: boolean
}

export function FactureForm({ onSubmit, onCancel, clients, odrs, isLoading = false }: FactureFormProps) {
  const [formData, setFormData] = useState<FactureFormData>({
    clientId: '',
    montantTTC: 0,
    dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    numeroODR: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FactureFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FactureFormData, string>> = {}

    if (!formData.clientId) newErrors.clientId = 'Le client est requis'
    if (formData.montantTTC <= 0) newErrors.montantTTC = 'Le montant doit être supérieur à 0'
    if (!formData.dateEcheance) newErrors.dateEcheance = 'La date d\'échéance est requise'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof FactureFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleODRSelect = (odrId: string) => {
    const selectedODR = odrs.find(odr => odr.id === odrId)
    if (selectedODR) {
      handleInputChange('numeroODR', selectedODR.numeroODR)
      handleInputChange('montantTTC', selectedODR.montantTotal)
      // Find client by name (this is a simplified approach)
      const client = clients.find(c => `${c.prenom} ${c.nom}` === selectedODR.clientNom)
      if (client) {
        handleInputChange('clientId', client.id)
      }
    }
  }

  const filteredODRs = odrs.filter(odr => 
    !formData.clientId || odr.clientNom === clients.find(c => c.id === formData.clientId)?.prenom + ' ' + clients.find(c => c.id === formData.clientId)?.nom
  )

  const selectedClient = clients.find(c => c.id === formData.clientId)

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Client */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Informations Client</h4>
                <p className="text-sm text-slate-600 font-normal">Sélectionnez le client à facturer</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId" className="font-medium">
                Client <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                  <SelectTrigger className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.clientId ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          {client.prenom} {client.nom}
                          <Badge variant="secondary" className="ml-auto">
                            {client.numeroClient}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!errors.clientId && formData.clientId && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.clientId && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.clientId && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.clientId}
                </div>
              )}
              {selectedClient && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">
                      {selectedClient.prenom} {selectedClient.nom} ({selectedClient.numeroClient})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ODR Origine */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">ODR d'Origine</h4>
                <p className="text-sm text-slate-600 font-normal">Lier cette facture à un ODR terminé (optionnel)</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-medium">Sélectionner un ODR</Label>
              <div className="relative">
                <Receipt className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                <Select onValueChange={handleODRSelect}>
                  <SelectTrigger className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                    <SelectValue placeholder="Choisir un ODR terminé" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredODRs.map((odr) => (
                      <SelectItem key={odr.id} value={odr.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-slate-400" />
                            <span>{odr.numeroODR} - {odr.clientNom}</span>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {odr.montantTotal.toFixed(2)}€
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {filteredODRs.length === 0 && formData.clientId && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Aucun ODR disponible pour ce client
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroODR" className="font-medium">Numéro ODR</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="numeroODR"
                  value={formData.numeroODR}
                  onChange={(e) => handleInputChange('numeroODR', e.target.value)}
                  placeholder="ODR-2024-001"
                  className="pl-10 font-mono border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
              </div>
              <p className="text-xs text-slate-500">Référence de l'ordre de réparation (optionnel)</p>
            </div>
          </CardContent>
        </Card>

        {/* Montant et Échéance */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Montant et Échéance</h4>
                <p className="text-sm text-slate-600 font-normal">Définissez le montant et la date limite de paiement</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="montantTTC" className="font-medium">
                Montant TTC (€) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="montantTTC"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.montantTTC}
                  onChange={(e) => handleInputChange('montantTTC', parseFloat(e.target.value) || 0)}
                  placeholder="1250.00"
                  className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.montantTTC ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.montantTTC && formData.montantTTC > 0 && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.montantTTC && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.montantTTC && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.montantTTC}
                </div>
              )}
              {formData.montantTTC > 0 && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <DollarSign className="h-4 w-4" />
                    <span>Montant TTC: <strong>{formData.montantTTC.toFixed(2)} €</strong></span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Montant HT: {(formData.montantTTC / 1.2).toFixed(2)} € | TVA: {(formData.montantTTC - formData.montantTTC / 1.2).toFixed(2)} €
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateEcheance" className="font-medium">
                Date d'Échéance <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.dateEcheance ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateEcheance ? format(formData.dateEcheance, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateEcheance}
                    onSelect={(date) => date && handleInputChange('dateEcheance', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateEcheance && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.dateEcheance}
                </div>
              )}
              <p className="text-xs text-slate-500">Date limite pour le paiement de cette facture</p>
            </div>
          </CardContent>
        </Card>

        {/* Récapitulatif */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calculator className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Récapitulatif</h4>
                <p className="text-sm text-slate-600 font-normal">Vérifiez les informations avant création</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client:
                  </span>
                  <span className="font-medium text-slate-900">
                    {selectedClient ? 
                      `${selectedClient.prenom} ${selectedClient.nom}` 
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    ODR d'origine:
                  </span>
                  <span className="font-medium text-slate-900 font-mono">
                    {formData.numeroODR || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Date d'échéance:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.dateEcheance ? format(formData.dateEcheance, 'dd/MM/yyyy', { locale: fr }) : '-'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Montant TTC:
                  </span>
                  <span className="text-indigo-600">{formData.montantTTC.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Prêt à créer la facture ?</p>
                  <p className="text-sm text-slate-600">Vérifiez que toutes les informations sont correctes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  disabled={isLoading}
                  className="hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Receipt className="mr-2 h-4 w-4" />
                      Créer la Facture
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}