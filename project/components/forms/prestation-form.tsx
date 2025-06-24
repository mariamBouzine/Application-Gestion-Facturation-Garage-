'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  Wrench,
  PaintBucket,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Plus,
  Trash2,
  ShoppingCart
} from 'lucide-react'

interface Article {
  id: string
  nom: string
  quantite: number
  prix: number
}

interface PrestationFormData {
  intitule: string
  description: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  articles: Article[]
}

interface PrestationFormProps {
  onSubmit: (data: PrestationFormData) => void
  onCancel: () => void
  isLoading?: boolean
  initialData?: any // Add this prop for editing
}

export function PrestationForm({ onSubmit, onCancel, isLoading = false, initialData }: PrestationFormProps) {
  const [formData, setFormData] = useState<PrestationFormData>({
    intitule: initialData?.nom || '',
    description: initialData?.description || '',
    typeService: initialData?.typeService || 'CARROSSERIE',
    articles: []
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PrestationFormData, string>>>({})

  // Update form data when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        intitule: initialData.nom || '',
        description: initialData.description || '',
        typeService: initialData.typeService || 'CARROSSERIE',
        articles: []
      })
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PrestationFormData, string>> = {}

    if (!formData.intitule.trim()) newErrors.intitule = 'L\'intitulé est requis'
    if (!formData.description.trim()) newErrors.description = 'La description est requise'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof PrestationFormData, value: string | Article[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addArticle = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      nom: '',
      quantite: 1,
      prix: 0
    }
    handleInputChange('articles', [...formData.articles, newArticle])
  }

  const removeArticle = (id: string) => {
    handleInputChange('articles', formData.articles.filter(article => article.id !== id))
  }

  const updateArticle = (id: string, field: keyof Article, value: string | number) => {
    const updatedArticles = formData.articles.map(article =>
      article.id === id ? { ...article, [field]: value } : article
    )
    handleInputChange('articles', updatedArticles)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Single Card containing all form elements */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="space-y-6">
            {/* Type de Service */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-purple-600" />
                <Label className="font-medium text-slate-900">
                  Type de Service <span className="text-red-500">*</span>
                </Label>
              </div>
              <RadioGroup
                value={formData.typeService}
                onValueChange={(value: 'CARROSSERIE' | 'MECANIQUE') => handleInputChange('typeService', value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full">
                  <RadioGroupItem value="CARROSSERIE" id="carrosserie" />
                  <Label htmlFor="carrosserie" className="flex items-center gap-3 cursor-pointer flex-1">
                    <PaintBucket className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Carrosserie</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full">
                  <RadioGroupItem value="MECANIQUE" id="mecanique" />
                  <Label htmlFor="mecanique" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Mécanique</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Intitulé */}
            <div className="space-y-2">
              <Label htmlFor="intitule" className="font-medium">
                Intitulé <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="intitule"
                  value={formData.intitule}
                  onChange={(e) => handleInputChange('intitule', e.target.value)}
                  placeholder="Entrer un intitulé"
                  className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.intitule ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                />
                {!errors.intitule && formData.intitule.trim() && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.intitule && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.intitule && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.intitule}
                </div>
              )}
            </div>

            {/* Description */}
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
                  className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.description ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
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

            {/* Articles Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-slate-600">Ajoutez les lignes nécessaires pour cette prestation</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addArticle}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un ligne
                </Button>
              </div>

              {formData.articles.length === 0 ? (
                <div className="text-center py-8 text-slate-500 border border-dashed border-slate-300 rounded-lg">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Aucun ligne ajouté</p>
                  <p className="text-sm">Cliquez sur "Ajouter un ligne" pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.articles.map((article, index) => (
                    <div key={article.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-slate-900">Ligne {index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArticle(article.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Input
                            value={article.nom}
                            onChange={(e) => updateArticle(article.id, 'nom', e.target.value)}
                            placeholder="Entrer le contenu"
                            className="border-slate-200 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-6 border-t border-slate-200">
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
                      {initialData ? 'Mise à jour...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      {initialData ? 'Mettre à jour' : 'Créer la Prestation'}
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