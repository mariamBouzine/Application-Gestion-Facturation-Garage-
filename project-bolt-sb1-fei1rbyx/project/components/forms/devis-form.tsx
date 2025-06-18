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
  FileText,
  User,
  Car,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Euro,
  Wrench,
  PaintBucket,
  FileEdit,
  Users,
  Settings,
  Calculator,
  CreditCard,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Loader2,
  DollarSign,
  Building
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ArticleFormData {
  designation: string
  prixUnitaireTTC: number
  quantite: number
  prestationId?: string
}

interface DevisFormData {
  clientId: string
  vehiculeId: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  dateValidite: Date
  conditionsPaiement: string
  pourcentageAcompte: number
  moyensPaiementAcceptes: string[]
  compteBancaire: string
  articles: ArticleFormData[]
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

interface DevisFormProps {
  onSubmit: (data: DevisFormData) => void
  onCancel: () => void
  clients: Client[]
  vehicules: Vehicule[]
  prestations: Prestation[]
  isLoading?: boolean
}

export function DevisForm({ onSubmit, onCancel, clients, vehicules, prestations, isLoading = false }: DevisFormProps) {
  const [formData, setFormData] = useState<DevisFormData>({
    clientId: '',
    vehiculeId: '',
    typeService: 'CARROSSERIE',
    dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    conditionsPaiement: 'Paiement à 30 jours',
    pourcentageAcompte: 0,
    moyensPaiementAcceptes: ['VIREMENT', 'CHEQUE'],
    compteBancaire: '',
    articles: [{ designation: '', prixUnitaireTTC: 0, quantite: 1 }]
  })

  const [errors, setErrors] = useState<any>({})

  const validateForm = (): boolean => {
    const newErrors: any = {}

    if (!formData.clientId) newErrors.clientId = 'Le client est requis'
    if (!formData.vehiculeId) newErrors.vehiculeId = 'Le véhicule est requis'
    if (!formData.dateValidite) newErrors.dateValidite = 'La date de validité est requise'

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

  const handleInputChange = (field: keyof DevisFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleArticleChange = (index: number, field: keyof ArticleFormData, value: any) => {
    const newArticles = [...formData.articles]
    newArticles[index] = { ...newArticles[index], [field]: value }
    setFormData(prev => ({ ...prev, articles: newArticles }))
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
    const totalHT = formData.articles.reduce((sum, article) =>
      sum + (article.prixUnitaireTTC * article.quantite), 0)
    const tva = totalHT * 0.20
    const totalTTC = totalHT + tva
    return { totalHT, tva, totalTTC }
  }

  const { totalHT, tva, totalTTC } = calculateTotal()

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client et Véhicule */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Client et Véhicule</h4>
                <p className="text-sm text-slate-600 font-normal">Sélectionnez le client et le véhicule concerné</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientId" className="font-medium">
                  Client <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                  <Select value={formData.clientId} onValueChange={(value) => {
                    handleInputChange('clientId', value)
                    handleInputChange('vehiculeId', '') // Reset vehicle when client changes
                  }}>
                    <SelectTrigger className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.clientId ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                      }`}>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            {client.prenom} {client.nom} ({client.numeroClient})
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
                            {vehicule.marque} {vehicule.modele} ({vehicule.immatriculation})
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
                {!formData.clientId && (
                  <p className="text-xs text-slate-500">Sélectionnez d'abord un client</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="typeService" className="font-medium">Type de Service</Label>
              <Select
                value={formData.typeService}
                onValueChange={(value: 'CARROSSERIE' | 'MECANIQUE') => handleInputChange('typeService', value)}
              >
                <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARROSSERIE">
                    <div className="flex items-center gap-2">
                      <PaintBucket className="h-4 w-4 text-purple-600" />
                      <span>Carrosserie</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MECANIQUE">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-orange-600" />
                      <span>Mécanique</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">Sélectionnez le type d'intervention</p>
            </div>
          </CardContent>
        </Card>

        {/* Articles */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Articles du Devis</h4>
                  <p className="text-sm text-slate-600 font-normal">Détails des prestations et produits</p>
                </div>
              </div>
              <Button
                type="button"
                onClick={addArticle}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.articles.map((article, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <h4 className="font-medium text-slate-900">Article {index + 1}</h4>
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

                <div className="space-y-2">
                  <Label className="font-medium">Prestation Prédéfinie (Optionnel)</Label>
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
                              <span>{prestation.nom}</span>
                              <Badge variant="secondary" className="ml-2">
                                {prestation.prixDeBase}€
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-slate-500">Sélectionnez une prestation pour pré-remplir les champs</p>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Désignation <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={article.designation}
                    onChange={(e) => handleArticleChange(index, 'designation', e.target.value)}
                    placeholder="Description détaillée de l'article ou prestation..."
                    rows={2}
                    className={`border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors[`article_${index}_designation`] ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                      }`}
                  />
                  {errors[`article_${index}_designation`] && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors[`article_${index}_designation`]}
                    </div>
                  )}
                </div>

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
                        placeholder="0.00"
                      />
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
                    <Input
                      type="number"
                      min="1"
                      value={article.quantite}
                      onChange={(e) => handleArticleChange(index, 'quantite', parseInt(e.target.value) || 1)}
                      className={`border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors[`article_${index}_quantite`] ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                        }`}
                      placeholder="1"
                    />
                    {errors[`article_${index}_quantite`] && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {errors[`article_${index}_quantite`]}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Total TTC</Label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md font-medium text-blue-900 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {(article.prixUnitaireTTC * article.quantite).toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            {/* Totaux */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-slate-900">Récapitulatif des Totaux</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total HT:</span>
                  <span className="font-medium text-slate-900">{totalHT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">TVA (20%):</span>
                  <span className="font-medium text-slate-900">{tva.toFixed(2)} €</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900">Total TTC:</span>
                  <span className="text-blue-600">{totalTTC.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Conditions du Devis</h4>
                <p className="text-sm text-slate-600 font-normal">Modalités de paiement et validité</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dateValidite" className="font-medium">
                Date de Validité <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.dateValidite ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                      }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateValidite ? format(formData.dateValidite, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateValidite}
                    onSelect={(date) => date && handleInputChange('dateValidite', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateValidite && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.dateValidite}
                </div>
              )}
              <p className="text-xs text-slate-500">Date limite de validité de ce devis</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="conditionsPaiement" className="font-medium">Conditions de Paiement</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="conditionsPaiement"
                    value={formData.conditionsPaiement}
                    onChange={(e) => handleInputChange('conditionsPaiement', e.target.value)}
                    placeholder="Paiement à 30 jours"
                    className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pourcentageAcompte" className="font-medium">Pourcentage d'Acompte (%)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="pourcentageAcompte"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.pourcentageAcompte}
                    onChange={(e) => handleInputChange('pourcentageAcompte', parseInt(e.target.value) || 0)}
                    className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compteBancaire" className="font-medium">Compte Bancaire (Optionnel)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="compteBancaire"
                  value={formData.compteBancaire}
                  onChange={(e) => handleInputChange('compteBancaire', e.target.value)}
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                  className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
              </div>
              <p className="text-xs text-slate-500">IBAN pour les virements bancaires</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Prêt à créer le devis ?</p>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Créer le Devis
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