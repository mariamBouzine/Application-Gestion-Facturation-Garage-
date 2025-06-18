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
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  UserPlus, 
  Building2, 
  Users, 
  Shield, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react'

interface ClientFormData {
  prenom: string
  nom: string
  entreprise: string
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
}

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ClientForm({ onSubmit, onCancel, isLoading = false }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    prenom: '',
    nom: '',
    entreprise: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    codePostal: '',
    typeClient: 'NORMAL'
  })

  const [errors, setErrors] = useState<Partial<ClientFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {}

    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis'
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide'
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise'
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise'
    if (!formData.codePostal.trim()) newErrors.codePostal = 'Le code postal est requis'
    else if (!/^\d{5}$/.test(formData.codePostal)) newErrors.codePostal = 'Code postal invalide (5 chiffres)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Personnelles */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Informations Personnelles</h4>
                <p className="text-sm text-slate-600 font-normal">Identité du client</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="font-medium">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Jean"
                    className={`border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.prenom ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                  {!errors.prenom && formData.prenom && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                  {errors.prenom && (
                    <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {errors.prenom && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.prenom}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom" className="font-medium">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Dupont"
                    className={`border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.nom ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                  {!errors.nom && formData.nom && (
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
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="typeClient" className="font-medium">Type de Client</Label>
              <Select value={formData.typeClient} onValueChange={(value: 'NORMAL' | 'GRAND_COMPTE') => handleInputChange('typeClient', value)}>
                <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Client Normal
                    </div>
                  </SelectItem>
                  <SelectItem value="GRAND_COMPTE">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      Grand Compte
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">Sélectionnez le type de relation client</p>
            </div>
          </CardContent>
        </Card>

        {/* Entreprise */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Entreprise</h4>
                <p className="text-sm text-slate-600 font-normal">Informations professionnelles (optionnel)</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="entreprise" className="font-medium">Nom de l'Entreprise</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="entreprise"
                  value={formData.entreprise}
                  onChange={(e) => handleInputChange('entreprise', e.target.value)}
                  placeholder="Mon Entreprise SARL"
                  className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
              </div>
              <p className="text-xs text-slate-500">Laissez vide si le client est un particulier</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Informations de Contact</h4>
                <p className="text-sm text-slate-600 font-normal">Moyens de communication</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jean.dupont@email.com"
                  className={`pl-10 pr-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.email && formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.email && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="font-medium">
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="06.12.34.56.78"
                  className={`pl-10 pr-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.telephone ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.telephone && formData.telephone && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.telephone && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.telephone && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.telephone}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Adresse</h4>
                <p className="text-sm text-slate-600 font-normal">Localisation du client</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adresse" className="font-medium">
                Adresse <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="123 Rue de la Paix"
                  className={`pl-10 pr-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.adresse ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                />
                {!errors.adresse && formData.adresse && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.adresse && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.adresse && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.adresse}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ville" className="font-medium">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    placeholder="Paris"
                    className={`pr-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.ville ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                  {!errors.ville && formData.ville && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                  {errors.ville && (
                    <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {errors.ville && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.ville}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal" className="font-medium">
                  Code Postal <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="codePostal"
                    value={formData.codePostal}
                    onChange={(e) => handleInputChange('codePostal', e.target.value)}
                    placeholder="75001"
                    className={`pr-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      errors.codePostal ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                  {!errors.codePostal && formData.codePostal && /^\d{5}$/.test(formData.codePostal) && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                  {errors.codePostal && (
                    <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {errors.codePostal && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.codePostal}
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Prêt à créer le client ?</p>
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
                      <UserPlus className="mr-2 h-4 w-4" />
                      Créer le Client
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