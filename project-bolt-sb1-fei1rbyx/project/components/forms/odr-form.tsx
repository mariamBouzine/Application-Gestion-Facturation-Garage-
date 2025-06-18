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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Wrench,
  User,
  Car,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  FileText,
  PaintBucket,
  Euro,
  Calculator,
  CheckCircle,
  AlertCircle,
  Loader2,
  Hash,
  Settings,
  ClipboardList,
  MessageSquare
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ArticleODRFormData {
  designation: string
  prixUnitaireTTC: number
  quantite: number
  prestationId?: string
}

interface ODRFormData {
  clientId: string
  vehiculeId: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  dateValidite: Date | null
  observations: string
  articles: ArticleODRFormData[]
}

interface Client {
  id: string
  nom: string
  prenom: string
  numeroClient: string
}

interface Vehicule {
  id: string
  immatriculation: string
  marque: string
  modele: string
  clientId: string
}

interface Prestation {
  id: string
  nom: string
  prixDeBase: number
  typeService: 'CARROSSERIE' | 'MECANIQUE'
}

interface ODRFormProps {
  onSubmit: (data: ODRFormData) => void
  onCancel: () => void
  clients: Client[]
  vehicules: Vehicule[]
  prestations: Prestation[]
  isLoading?: boolean
}

export function ODRForm({
  onSubmit,
  onCancel,
  clients,
  vehicules,
  prestations,
  isLoading = false
}: ODRFormProps) {
  const [formData, setFormData] = useState<ODRFormData>({
    clientId: '',
    vehiculeId: '',
    typeService: 'CARROSSERIE',
    dateValidite: null,
    observations: '',
    articles: [{ designation: '', prixUnitaireTTC: 0, quantite: 1 }]
  })

  const [errors, setErrors] = useState<any>({})

  const validateForm = (): boolean => {
    const newErrors: any = {}

    if (!formData.clientId) newErrors.clientId = 'Le client est requis'
    if (!formData.vehiculeId) newErrors.vehiculeId = 'Le véhicule est requis'

    formData.articles.forEach((article, index) => {
      if (!article.designation.trim()) {
        newErrors[`article_${index}_designation`] = 'La désignation est requise'
      }
      if (article.prixUnitaireTTC <= 0) {
        newErrors[`article_${index}_prix`] = 'Le prix doit être supérieur à 0'
      }
      if (article.quantite <= 0) {
        newErrors[`article_${index}_quantite`] = 'La quantité doit être supérieure à 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof ODRFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleArticleChange = (index: number, field: keyof ArticleODRFormData, value: any) => {
    const newArticles = [...formData.articles]
    newArticles[index] = { ...newArticles[index], [field]: value }
    setFormData(prev => ({ ...prev, articles: newArticles }))

    // Clear related errors
    if (errors[`article_${index}_${field}`]) {
      setErrors((prev: any) => ({ ...prev, [`article_${index}_${field}`]: undefined }))
    }
  }

  const addArticle = () => {
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { designation: '', prixUnitaireTTC: 0, quantite: 1 }]
    }))
  }

  const removeArticle = (index: number) => {
    if (formData.articles.length > 1) {
      setFormData(prev => ({
        ...prev,
        articles: prev.articles.filter((_, i) => i !== index)
      }))
    }
  }

  const addPrestationToArticle = (index: number, prestationId: string) => {
    const prestation = prestations.find(p => p.id === prestationId)
    if (prestation) {
      handleArticleChange(index, 'designation', prestation.nom)
      handleArticleChange(index, 'prixUnitaireTTC', prestation.prixDeBase)
      handleArticleChange(index, 'prestationId', prestationId)
    }
  }

  const filteredVehicules = vehicules.filter(v => v.clientId === formData.clientId)
  const filteredPrestations = prestations.filter(p => p.typeService === formData.typeService)

  const calculateTotal = () => {
    return formData.articles.reduce((sum, article) =>
      sum + (article.prixUnitaireTTC * article.quantite), 0)
  }

  const montantTotal = calculateTotal()
  const selectedClient = clients.find(c => c.id === formData.clientId)
  const selectedVehicule = vehicules.find(v => v.id === formData.vehiculeId)

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client et Véhicule */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Client et Véhicule</h4>
                <p className="text-sm text-slate-600 font-normal">Sélectionnez le client et le véhicule concerné</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientId" className="font-medium">
                  Client <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => {
                      handleInputChange('clientId', value)
                      handleInputChange('vehiculeId', '') // Reset vehicle when client changes
                    }}
                  >
                    <SelectTrigger className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.clientId ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
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

              <div className="space-y-2">
                <Label htmlFor="vehiculeId" className="font-medium">
                  Véhicule <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                  <Select
                    value={formData.vehiculeId}
                    onValueChange={(value) => handleInputChange('vehiculeId', value)}
                    disabled={!formData.clientId}
                  >
                    <SelectTrigger className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.vehiculeId ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                      } ${!formData.clientId ? 'opacity-50' : ''}`}>
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVehicules.map((vehicule) => (
                        <SelectItem key={vehicule.id} value={vehicule.id}>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-slate-400" />
                            {vehicule.marque} {vehicule.modele}
                            <Badge variant="secondary" className="ml-auto font-mono">
                              {vehicule.immatriculation}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!errors.vehiculeId && formData.vehiculeId && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                  {errors.vehiculeId && (
                    <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {errors.vehiculeId && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vehiculeId}
                  </div>
                )}
                {selectedVehicule && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedVehicule.marque} {selectedVehicule.modele} ({selectedVehicule.immatriculation})
                      </span>
                    </div>
                  </div>
                )}
                {!formData.clientId && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Sélectionnez d'abord un client
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type de Service et Date */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Configuration du Service</h4>
                <p className="text-sm text-slate-600 font-normal">Définissez le type de service et la validité</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="typeService" className="font-medium">
                  Type de Service <span className="text-red-500">*</span>
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
                        </div>
                      </SelectItem>
                      <SelectItem value="MECANIQUE">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          <span>Mécanique</span>
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

              <div className="space-y-2">
                <Label htmlFor="dateValidite" className="font-medium">Date de Validité</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateValidite ? format(formData.dateValidite, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateValidite || undefined}
                      onSelect={(date) => handleInputChange('dateValidite', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-slate-500">Date limite de validité du devis (optionnel)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prestations */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Prestations à Effectuer</h4>
                  <p className="text-sm text-slate-600 font-normal">Définissez les services et interventions</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={addArticle}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.articles.map((article, index) => (
              <div key={index} className="p-6 border border-slate-200 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Hash className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Prestation {index + 1}</h4>
                  </div>
                  {formData.articles.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArticle(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Prestation prédéfinie */}
                <div className="space-y-2">
                  <Label className="font-medium">Prestation Prédéfinie</Label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                    <Select onValueChange={(value) => addPrestationToArticle(index, value)}>
                      <SelectTrigger className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                        <SelectValue placeholder="Choisir une prestation" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPrestations.map((prestation) => (
                          <SelectItem key={prestation.id} value={prestation.id}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                {formData.typeService === 'CARROSSERIE' ? (
                                  <PaintBucket className="h-4 w-4 text-orange-500" />
                                ) : (
                                  <Wrench className="h-4 w-4 text-blue-500" />
                                )}
                                <span>{prestation.nom}</span>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                {prestation.prixDeBase.toFixed(2)}€
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-slate-500">Sélectionner une prestation pour pré-remplir les champs</p>
                  {filteredPrestations.length === 0 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Aucune prestation disponible pour ce type de service
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="font-medium">
                    Description de la Prestation <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      value={article.designation}
                      onChange={(e) => handleArticleChange(index, 'designation', e.target.value)}
                      placeholder="Description détaillée de la prestation à effectuer..."
                      rows={3}
                      className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors[`article_${index}_designation`] ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                        }`}
                    />
                    {!errors[`article_${index}_designation`] && article.designation.trim() && (
                      <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    )}
                    {errors[`article_${index}_designation`] && (
                      <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors[`article_${index}_designation`] && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors[`article_${index}_designation`]}
                    </div>
                  )}
                </div>

                {/* Prix, Quantité, Total */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="font-medium">
                      Prix Unitaire TTC (€) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={article.prixUnitaireTTC}
                        onChange={(e) => handleArticleChange(index, 'prixUnitaireTTC', parseFloat(e.target.value) || 0)}
                        className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors[`article_${index}_prix`] ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                          }`}
                      />
                      {!errors[`article_${index}_prix`] && article.prixUnitaireTTC > 0 && (
                        <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                      )}
                      {errors[`article_${index}_prix`] && (
                        <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                      )}
                    </div>
                    {errors[`article_${index}_prix`] && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {errors[`article_${index}_prix`]}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">
                      Quantité <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="number"
                        min="1"
                        value={article.quantite}
                        onChange={(e) => handleArticleChange(index, 'quantite', parseInt(e.target.value) || 1)}
                        className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors[`article_${index}_quantite`] ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                          }`}
                      />
                      {!errors[`article_${index}_quantite`] && article.quantite > 0 && (
                        <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                      )}
                      {errors[`article_${index}_quantite`] && (
                        <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                      )}
                    </div>
                    {errors[`article_${index}_quantite`] && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {errors[`article_${index}_quantite`]}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Total TTC</Label>
                    <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-lg font-bold text-green-700">
                        <Euro className="h-4 w-4" />
                        {(article.prixUnitaireTTC * article.quantite).toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            {/* Total général */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Calculator className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-lg font-semibold text-slate-900">Montant Total TTC:</span>
                </div>
                <span className="text-2xl font-bold text-indigo-600">{montantTotal.toFixed(2)} €</span>
              </div>
              {montantTotal > 0 && (
                <div className="text-sm text-indigo-600 mt-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Montant HT: {(montantTotal / 1.2).toFixed(2)} € | TVA: {(montantTotal - montantTotal / 1.2).toFixed(2)} €
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observations */}
        {/* Observations */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Observations</h4>
                <p className="text-sm text-slate-600 font-normal">Notes particulières et informations complémentaires</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observations" className="font-medium">Observations et Notes</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Notes particulières, état du véhicule, demandes spécifiques du client, pièces à commander..."
                  rows={4}
                  className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
                {formData.observations.trim() && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-slate-500">Informations supplémentaires pour l'atelier et le client</p>
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
                    <Car className="h-4 w-4" />
                    Véhicule:
                  </span>
                  <span className="font-medium text-slate-900">
                    {selectedVehicule ?
                      `${selectedVehicule.marque} ${selectedVehicule.modele} (${selectedVehicule.immatriculation})`
                      : '-'}
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
                    <CalendarIcon className="h-4 w-4" />
                    Date de validité:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.dateValidite ? format(formData.dateValidite, 'dd/MM/yyyy', { locale: fr }) : 'Non définie'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Nombre de prestations:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.articles.length} prestation{formData.articles.length > 1 ? 's' : ''}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Montant Total TTC:
                  </span>
                  <span className="text-indigo-600">{montantTotal.toFixed(2)} €</span>
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
                  <p className="font-medium text-slate-900">Prêt à créer l'ODR ?</p>
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
                      <FileText className="mr-2 h-4 w-4" />
                      Créer l'ODR
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