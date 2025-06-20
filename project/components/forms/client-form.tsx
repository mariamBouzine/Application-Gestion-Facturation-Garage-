'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Contact, Briefcase } from 'lucide-react'
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Users,
  Loader2,
  CheckCircle,
  Star,
  Edit
} from 'lucide-react'

interface ClientFormData {
  nomPrenom: string
  entreprise: string
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
  contactPersonnes?: ContactPerson[]
}

interface ContactPerson {
  id: string
  nom: string
  telephone: string
  email: string
  fonction: string
}

// Add the Client interface to match what's being passed from the parent
interface Client {
  id: string
  prenom: string
  nom: string
  entreprise?: string
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
  numeroClient: string
  createdAt: string
}

interface ClientFormProps {
  mode?: 'create' | 'edit'  // Make mode optional with default
  initialData?: Client | null
  onSubmit: (data: ClientFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ClientForm({
  mode = 'create',
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    nomPrenom: '',
    entreprise: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    codePostal: '',
    typeClient: 'NORMAL'
  })

  const [contactPersonnes, setContactPersonnes] = useState<ContactPerson[]>([])

  // Populate form data when in edit mode or when initialData changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('Populating form with data:', initialData) // Debug log
      setFormData({
        nomPrenom: `${initialData.prenom || ''} ${initialData.nom || ''}`.trim(),
        entreprise: initialData.entreprise || '',
        telephone: initialData.telephone || '',
        email: initialData.email || '',
        adresse: initialData.adresse || '',
        ville: initialData.ville || '',
        codePostal: initialData.codePostal || '',
        typeClient: initialData.typeClient || 'NORMAL'
      })
      setContactPersonnes(initialData.contactPersonnes || [])
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        nomPrenom: '',
        entreprise: '',
        telephone: '',
        email: '',
        adresse: '',
        ville: '',
        codePostal: '',
        typeClient: 'NORMAL'
      })
      setContactPersonnes([])
    }
  }, [mode, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Transform the nomPrenom data for the backend
    const [prenom = '', ...nomParts] = (formData.nomPrenom || '').trim().split(' ')
    const nom = nomParts.join(' ')

    const submitData = {
      ...formData,
      prenom,
      nom,
      contactPersonnes: formData.typeClient === 'GRAND_COMPTE' ? contactPersonnes : []

    }

    // Remove nomPrenom since it's not part of the backend structure
    const { nomPrenom, ...dataToSubmit } = submitData

    console.log('Submitting data:', dataToSubmit) // Debug log
    onSubmit(dataToSubmit as any)
  }

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isEditMode = mode === 'edit'

  // Contact person management functions
  const addContactPerson = () => {
    const newContact: ContactPerson = {
      id: Date.now().toString(),
      nom: '',
      telephone: '',
      email: '',
      fonction: ''
    }
    setContactPersonnes(prev => [...prev, newContact])
  }

  const removeContactPerson = (contactId: string) => {
    setContactPersonnes(prev => prev.filter(contact => contact.id !== contactId))
  }

  const updateContactPerson = (contactId: string, field: keyof ContactPerson, value: string) => {
    setContactPersonnes(prev =>
      prev.map(contact =>
        contact.id === contactId ? { ...contact, [field]: value } : contact
      )
    )
  }

  // Handle type client change with contact cleanup
  const handleTypeClientChange = (value: 'NORMAL' | 'GRAND_COMPTE') => {
    handleInputChange('typeClient', value)
    if (value === 'NORMAL') {
      setContactPersonnes([])
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
                <p className="text-sm text-slate-600 font-normal">
                  {isEditMode ? 'Modifier les informations du client' : 'Identité du client'}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomPrenom" className="font-medium">Nom et Prénom</Label>
                <Input
                  id="nomPrenom"
                  value={formData.nomPrenom}
                  onChange={(e) => handleInputChange('nomPrenom', e.target.value)}
                  placeholder="Jean Dupont"
                  className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
              </div>
              {/* Nom de l'Entreprise */}
              <div className="space-y-2">
                <Label htmlFor="entreprise" className="font-medium">Nom de l'Entreprise</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="entreprise"
                    value={formData.entreprise}
                    onChange={(e) => handleInputChange('entreprise', e.target.value)}
                    placeholder="Mon Entreprise "
                    className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="telephone" className="font-medium">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="06.12.34.56.78"
                    className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Type de Client - Radio Button */}
            <div className="space-y-3">
              <Label className="font-medium">Type de Client</Label>
              <RadioGroup
                value={formData.typeClient}
                onValueChange={handleTypeClientChange}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NORMAL" id="normal" />
                  <Label htmlFor="normal" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4 text-blue-600" />
                    Client Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="GRAND_COMPTE" id="grand-compte" />
                  <Label htmlFor="grand-compte" className="flex items-center gap-2 cursor-pointer">
                    <Star className="h-4 w-4 text-yellow-600" />
                    Grand Compte
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Contact Persons Section - Show only for GRAND_COMPTE */}
            {formData.typeClient === 'GRAND_COMPTE' && (
              <div className="space-y-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <h6 className="font-medium text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Personnes de Contact
                  </h6>
                  <Button
                    type="button"
                    onClick={addContactPerson}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter Contact
                  </Button>
                </div>

                {contactPersonnes.map((contact, index) => (
                  <div key={contact.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Contact className="h-4 w-4 text-blue-600" />
                        <h6 className="font-medium text-slate-900">Contact {index + 1}</h6>
                      </div>
                      {contactPersonnes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContactPerson(contact.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input
                          value={contact.nom}
                          onChange={(e) => updateContactPerson(contact.id, 'nom', e.target.value)}
                          placeholder="Ex: Marie Martin"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            value={contact.telephone}
                            onChange={(e) => updateContactPerson(contact.id, 'telephone', e.target.value)}
                            className="pl-10"
                            placeholder="Ex: 01 23 45 67 89"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            type="email"
                            value={contact.email}
                            onChange={(e) => updateContactPerson(contact.id, 'email', e.target.value)}
                            className="pl-10"
                            placeholder="Ex: marie.martin@entreprise.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Fonction</Label>
                        <Input
                          value={contact.fonction}
                          onChange={(e) => updateContactPerson(contact.id, 'fonction', e.target.value)}
                          placeholder="Ex: Responsable Flotte"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {contactPersonnes.length === 0 && (
                  <div className="text-center py-6 text-slate-500 border border-dashed border-slate-300 rounded-lg">
                    <Contact className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm">Aucune personne de contact ajoutée</p>
                    <p className="text-xs text-slate-400">Cliquez sur "Ajouter Contact" pour commencer</p>
                  </div>
                )}
              </div>
            )}
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
              <Label htmlFor="adresse" className="font-medium">Adresse</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="123 Rue de la Paix"
                  className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ville" className="font-medium">Ville</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                  placeholder="Paris"
                  className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal" className="font-medium">Code Postal</Label>
                <Input
                  id="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => handleInputChange('codePostal', e.target.value)}
                  placeholder="75001"
                  className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
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
                  <p className="font-medium text-slate-900">
                    {isEditMode ? 'Prêt à modifier le client ?' : 'Prêt à créer le client ?'}
                  </p>
                  <p className="text-sm text-slate-600">
                    Vérifiez que toutes les informations sont correctes
                  </p>
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
                      {isEditMode ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <Edit className="mr-2 h-4 w-4" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      {isEditMode ? 'Modifier le Client' : 'Créer le Client'}
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