'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { 
  Package, 
  Euro, 
  Wrench, 
  PaintBucket,
  FileText,
  Calculator,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  DollarSign,
  Info
} from 'lucide-react'

interface PrestationFormData {
  nom: string
  description: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  prixDeBase: number
}

interface PrestationFormProps {
  onSubmit: (data: PrestationFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function PrestationForm({ onSubmit, onCancel, isLoading = false }: PrestationFormProps) {
  const [formData, setFormData] = useState<PrestationFormData>({
    nom: '',
    description: '',
    typeService: 'CARROSSERIE',
    prixDeBase: 0
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PrestationFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PrestationFormData, string>> = {}

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.description.trim()) newErrors.description = 'La description est requise'
    if (formData.prixDeBase <= 0) newErrors.prixDeBase = 'Le prix doit être supérieur à 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof PrestationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Générales */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Informations de la Prestation</h4>
                <p className="text-sm text-slate-600 font-normal">Définissez le nom et la description de la prestation</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="font-medium">
                Nom de la Prestation <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Réparation pare-chocs avant"
                  className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.nom ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.nom && formData.nom.trim() && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.nom && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.nom && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.nom}
                </div>
              )}
              {formData.nom.trim() && !errors.nom && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Nom de prestation: {formData.nom}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée de la prestation, étapes, matériaux utilisés..."
                  rows={4}
                  className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.description ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.description && formData.description.trim() && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
                {errors.description && (
                  <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                )}
              </div>
              {errors.description && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description}
                </div>
              )}
              <p className="text-xs text-slate-500">Cette description sera visible sur les devis et factures</p>
            </div>
          </CardContent>
        </Card>

        {/* Type de Service */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Type de Service</h4>
                <p className="text-sm text-slate-600 font-normal">Catégorisez cette prestation par domaine d'activité</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typeService" className="font-medium">
                Domaine d'Activité <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                <Select 
                  value={formData.typeService} 
                  onValueChange={(value: 'CARROSSERIE' | 'MECANIQUE') => handleInputChange('typeService', value)}
                >
                  <SelectTrigger className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CARROSSERIE">
                      <div className="flex items-center gap-2">
                        <PaintBucket className="h-4 w-4 text-orange-500" />
                        <span>Carrosserie</span>
                        <Badge variant="secondary" className="ml-2">Esthétique</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="MECANIQUE">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-blue-500" />
                        <span>Mécanique</span>
                        <Badge variant="secondary" className="ml-2">Technique</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
              </div>
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-800">
                  {formData.typeService === 'CARROSSERIE' ? (
                    <PaintBucket className="h-4 w-4" />
                  ) : (
                    <Wrench className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    Service: {formData.typeService === 'CARROSSERIE' ? 'Carrosserie' : 'Mécanique'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Euro className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Tarification</h4>
                <p className="text-sm text-slate-600 font-normal">Définissez le prix de base de cette prestation</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prixDeBase" className="font-medium">
                Prix de Base (€ TTC) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="prixDeBase"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.prixDeBase}
                  onChange={(e) => handleInputChange('prixDeBase', parseFloat(e.target.value) || 0)}
                  placeholder="150.00"
                  className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.prixDeBase ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.prixDeBase && formData.prixDeBase > 0 && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.prixDeBase && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.prixDeBase && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.prixDeBase}
                </div>
              )}
              {formData.prixDeBase > 0 && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <DollarSign className="h-4 w-4" />
                    <span>Prix TTC: <strong>{formData.prixDeBase.toFixed(2)} €</strong></span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Prix HT: {(formData.prixDeBase / 1.2).toFixed(2)} € | TVA: {(formData.prixDeBase - formData.prixDeBase / 1.2).toFixed(2)} €
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <span className="font-medium">Note:</span> Ce prix servira de base pour les devis et peut être ajusté selon le véhicule et la complexité de l'intervention.
                </div>
              </div>
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
                    <Package className="h-4 w-4" />
                    Nom:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.nom || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    {formData.typeService === 'CARROSSERIE' ? (
                      <PaintBucket className="h-4 w-4" />
                    ) : (
                      <Wrench className="h-4 w-4" />
                    )}
                    Type de service:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.typeService === 'CARROSSERIE' ? 'Carrosserie' : 'Mécanique'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description:
                  </span>
                  <span className="font-medium text-slate-900 text-right max-w-[200px] truncate">
                    {formData.description || '-'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Prix de base TTC:
                  </span>
                  <span className="text-indigo-600">{formData.prixDeBase.toFixed(2)} €</span>
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
                  <p className="font-medium text-slate-900">Prêt à créer la prestation ?</p>
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
                      <Package className="mr-2 h-4 w-4" />
                      Créer la Prestation
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