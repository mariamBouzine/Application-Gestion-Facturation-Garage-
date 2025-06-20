'use client'

import { useState, useEffect } from 'react'
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
import { 
  Car, 
  Calendar, 
  Gauge, 
  Hash,
  User,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calculator,
  RefreshCw,
  Info
} from 'lucide-react'

interface VehiculeFormData {
  immatriculation: string
  marque: string
  modele: string
  annee: number
  numeroSerie: string
  kilometrage: number | null
  clientId: string
  couleur?: string
}

interface Client {
  id: string
  nom: string
  prenom: string
  numeroClient: string
}

interface VehiculeFormProps {
  onSubmit: (data: VehiculeFormData) => void
  onCancel: () => void
  clients: Client[]
  isLoading?: boolean
  initialData?: VehiculeFormData
  mode?: 'create' | 'edit'
}

export function VehiculeForm({ 
  onSubmit, 
  onCancel, 
  clients, 
  isLoading = false, 
  initialData,
  mode = 'create'
}: VehiculeFormProps) {
  const [formData, setFormData] = useState<VehiculeFormData>(
    initialData || {
      immatriculation: '',
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      numeroSerie: '',
      kilometrage: null,
      clientId: '',
      couleur: ''
    }
  )

  const [errors, setErrors] = useState<Partial<Record<keyof VehiculeFormData, string>>>({})
  const [isRegularImmat, setIsRegularImmat] = useState(true)
  const [rawImmatriculation, setRawImmatriculation] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setRawImmatriculation(initialData.immatriculation)
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VehiculeFormData, string>> = {}

    if (!formData.immatriculation.trim()) {
      newErrors.immatriculation = 'L\'immatriculation est requise'
    } else if (isRegularImmat && !/^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(formData.immatriculation)) {
      newErrors.immatriculation = 'Format invalide (ex: AB-123-CD)'
    }

    if (!formData.marque.trim()) newErrors.marque = 'La marque est requise'
    if (!formData.modele.trim()) newErrors.modele = 'Le modèle est requis'
    if (!formData.annee || formData.annee < 1900 || formData.annee > new Date().getFullYear() + 1) {
      newErrors.annee = 'Année invalide'
    }
    if (!formData.clientId) newErrors.clientId = 'Le client est requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof VehiculeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const formatImmatriculation = (value: string) => {
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase()
    
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}`
  }

  const handleImmatriculationChange = (value: string) => {
    setRawImmatriculation(value)
    
    if (isRegularImmat) {
      const formatted = formatImmatriculation(value)
      handleInputChange('immatriculation', formatted)
    } else {
      handleInputChange('immatriculation', value.toUpperCase())
    }
  }

  const toggleImmatriculationMode = () => {
    setIsRegularImmat(!isRegularImmat)
    setRawImmatriculation('')
    handleInputChange('immatriculation', '')
    if (errors.immatriculation) {
      setErrors(prev => ({ ...prev, immatriculation: undefined }))
    }
  }

  const selectedClient = clients.find(c => c.id === formData.clientId)
  const isImmatriculationValid = isRegularImmat 
    ? /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(formData.immatriculation)
    : formData.immatriculation.trim().length > 0

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Véhicule */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Informations du Véhicule</h4>
                <p className="text-sm text-slate-600 font-normal">Saisissez les détails d'identification du véhicule</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="immatriculation" className="font-medium">
                  Immatriculation <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleImmatriculationMode}
                  className="text-xs h-7"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {isRegularImmat ? 'Format libre' : 'Format standard'}
                </Button>
              </div>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="immatriculation"
                  value={formData.immatriculation}
                  onChange={(e) => handleImmatriculationChange(e.target.value)}
                  placeholder={isRegularImmat ? "AB-123-CD" : "Immatriculation libre"}
                  maxLength={isRegularImmat ? 9 : 20}
                  className={`pl-10 font-mono border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.immatriculation ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.immatriculation && isImmatriculationValid && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.immatriculation && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.immatriculation && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.immatriculation}
                </div>
              )}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  {isRegularImmat ? (
                    <>
                      <span className="font-medium">Format standard:</span> Saisissez les lettres et chiffres (ex: ab123cd → AB-123-CD)
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Format libre:</span> Pour les immatriculations anciennes ou étrangères
                    </>
                  )}
                </div>
              </div>
              {isImmatriculationValid && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Immatriculation: {formData.immatriculation}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marque" className="font-medium">
                  Marque <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="marque"
                    value={formData.marque}
                    onChange={(e) => handleInputChange('marque', e.target.value)}
                    placeholder="Peugeot"
                    className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.marque ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                  {!errors.marque && formData.marque.trim() && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                  {errors.marque && (
                    <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {errors.marque && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.marque}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="modele" className="font-medium">
                  Modèle <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="modele"
                    value={formData.modele}
                    onChange={(e) => handleInputChange('modele', e.target.value)}
                    placeholder="308"
                    className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.modele ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                  {!errors.modele && formData.modele.trim() && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                  {errors.modele && (
                    <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {errors.modele && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.modele}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="annee" className="font-medium">
                  Année <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="annee"
                    type="number"
                    value={formData.annee}
                    onChange={(e) => handleInputChange('annee', parseInt(e.target.value))}
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.annee ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                  {!errors.annee && formData.annee >= 1900 && formData.annee <= new Date().getFullYear() + 1 && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                  {errors.annee && (
                    <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {errors.annee && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.annee}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="couleur" className="font-medium">Couleur</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 bg-slate-400 rounded-full" />
                  <Input
                    id="couleur"
                    value={formData.couleur || ''}
                    onChange={(e) => handleInputChange('couleur', e.target.value)}
                    placeholder="Blanc"
                    className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations Techniques */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Hash className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Informations Techniques</h4>
                <p className="text-sm text-slate-600 font-normal">Détails techniques optionnels du véhicule</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numeroSerie" className="font-medium">Numéro de Série (VIN)</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="numeroSerie"
                  value={formData.numeroSerie}
                  onChange={(e) => handleInputChange('numeroSerie', e.target.value.toUpperCase())}
                  placeholder="VF3XXXXXXXXXXXXX"
                  maxLength={17}
                  className="pl-10 font-mono border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
                {formData.numeroSerie.trim() && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
              </div>
              <p className="text-xs text-slate-500">Numéro d'identification unique du véhicule (17 caractères)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kilometrage" className="font-medium">Kilométrage</Label>
              <div className="relative">
                <Gauge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="kilometrage"
                  type="number"
                  value={formData.kilometrage || ''}
                  onChange={(e) => handleInputChange('kilometrage', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="50000"
                  min={0}
                  className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
                {formData.kilometrage && formData.kilometrage > 0 && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
              </div>
              <p className="text-xs text-slate-500">Kilométrage actuel du véhicule</p>
              {formData.kilometrage && formData.kilometrage > 0 && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <Gauge className="h-4 w-4" />
                    <span className="font-medium">{formData.kilometrage.toLocaleString()} km</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Propriétaire */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Propriétaire</h4>
                <p className="text-sm text-slate-600 font-normal">Associez le véhicule à un client</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
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

        {/* Récapitulatif */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calculator className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Récapitulatif</h4>
                <p className="text-sm text-slate-600 font-normal">Vérifiez les informations avant {mode === 'edit' ? 'modification' : 'création'}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Immatriculation:
                  </span>
                  <span className="font-medium text-slate-900 font-mono">
                    {formData.immatriculation || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Véhicule:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.marque && formData.modele ? 
                      `${formData.marque} ${formData.modele} (${formData.annee})` 
                      : '-'}
                  </span>
                </div>
                {formData.couleur && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-400 rounded-full" />
                      Couleur:
                    </span>
                    <span className="font-medium text-slate-900">
                      {formData.couleur}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Propriétaire:
                  </span>
                  <span className="font-medium text-slate-900">
                    {selectedClient ? 
                      `${selectedClient.prenom} ${selectedClient.nom}` 
                      : '-'}
                  </span>
                </div>
                {formData.numeroSerie && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      VIN:
                    </span>
                    <span className="font-medium text-slate-900 font-mono">
                      {formData.numeroSerie}
                    </span>
                  </div>
                )}
                {formData.kilometrage && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      Kilométrage:
                    </span>
                    <span className="font-medium text-slate-900">
                      {formData.kilometrage.toLocaleString()} km
                    </span>
                  </div>
                )}
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
                  <p className="font-medium text-slate-900">
                    Prêt à {mode === 'edit' ? 'modifier' : 'enregistrer'} le véhicule ?
                  </p>
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
                      {mode === 'edit' ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <Car className="mr-2 h-4 w-4" />
                      {mode === 'edit' ? 'Modifier le Véhicule' : 'Créer le Véhicule'}
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