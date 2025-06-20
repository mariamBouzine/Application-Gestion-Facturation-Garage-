'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  MessageSquare,
  Search,
  Phone,
  Mail,
  Building,
  UserPlus,
  Star
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
  id?: string
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
  entreprise?: string
  telephone?: string
  email?: string
  typeClient?: 'VTC' | 'TAXI' | 'PARTICULIER' | 'TRANSPORTEUR' | 'AUTRE'
  autreType?: string
  grandCompte?: boolean
  contactPersonne?: {
    nom: string
    telephone: string
    email: string
    poste: string
  }
}

interface Vehicule {
  id: string
  immatriculation: string
  immatriculationAlternative?: string
  marque: string
  modele: string
  clientId: string
  kilometrageActuel?: number
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
  initialData?: any
  isEdit?: boolean
  onAddClient?: (client: Omit<Client, 'id'>) => Promise<string>
  onAddVehicle?: (vehicle: Omit<Vehicule, 'id'>) => Promise<string>
}

// Custom hook for client search
function useClientSearch(clients: Client[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Client[]>([])
  const [showResults, setShowResults] = useState(false)

  const searchClients = useCallback((term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const normalizedTerm = term.toLowerCase().trim()
    const results = clients.filter(client => {
      const fullName = `${client.prenom} ${client.nom}`.toLowerCase()
      const reverseName = `${client.nom} ${client.prenom}`.toLowerCase()
      const lastName = client.nom.toLowerCase()
      const firstName = client.prenom.toLowerCase()

      return (
        fullName.includes(normalizedTerm) ||
        reverseName.includes(normalizedTerm) ||
        lastName.startsWith(normalizedTerm) ||
        firstName.startsWith(normalizedTerm) ||
        client.numeroClient.toLowerCase().includes(normalizedTerm)
      )
    })

    setSearchResults(results)
    setShowResults(true)
  }, [clients])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchClients(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, searchClients])

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    showResults,
    setShowResults,
    hasSearched: searchTerm.trim().length > 0
  }
}

// License plate validation
const validateLicensePlate = (plate: string): boolean => {
  const format1 = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/
  const format2 = /^\d{3}-[A-Z]{2}-\d{2}$/
  const format3 = /^[A-Z]{3}-\d{3}-[A-Z]$/
  return format1.test(plate) || format2.test(plate) || format3.test(plate)
}

export function ODRForm({
  onSubmit,
  onCancel,
  clients,
  vehicules,
  prestations,
  isLoading = false,
  initialData,
  isEdit = false,
  onAddClient,
  onAddVehicle
}: ODRFormProps) {
  // Client search hook
  const { searchTerm, setSearchTerm, searchResults, showResults, setShowResults, hasSearched } = useClientSearch(clients)

  // Show client creation form
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false)

  // New client form state
  const [newClientData, setNewClientData] = useState({
    nom: '',
    prenom: '',
    entreprise: '',
    telephone: '',
    email: '',
    typeClient: 'PARTICULIER' as const,
    autreType: '',
    grandCompte: false,
    contactPersonne: {
      nom: '',
      telephone: '',
      email: '',
      poste: ''
    }
  })

  // New vehicle form state
  const [newVehicleData, setNewVehicleData] = useState({
    immatriculation: '',
    immatriculationAlternative: '',
    marque: '',
    modele: '',
    kilometrageActuel: 0
  })

  // Initialize form data with proper defaults
  const getInitialFormData = useCallback((): ODRFormData => {
    if (initialData && isEdit) {
      return {
        id: initialData.id,
        clientId: initialData.clientId || '',
        vehiculeId: initialData.vehiculeId || '',
        typeService: initialData.typeService || 'CARROSSERIE',
        dateValidite: initialData.dateValidite ? new Date(initialData.dateValidite) : null,
        observations: initialData.observations || '',
        articles: initialData.articles && initialData.articles.length > 0
          ? initialData.articles
          : [{ designation: '', prixUnitaireTTC: 0, quantite: 1 }]
      }
    }
    return {
      clientId: '',
      vehiculeId: '',
      typeService: 'CARROSSERIE',
      dateValidite: null,
      observations: '',
      articles: [{ designation: '', prixUnitaireTTC: 0, quantite: 1 }]
    }
  }, [initialData, isEdit])

  const [formData, setFormData] = useState<ODRFormData>(getInitialFormData)
  const [errors, setErrors] = useState<any>({})

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData(getInitialFormData())
      setErrors({})
    }
  }, [initialData, isEdit, getInitialFormData])

  // Improved validation function
  const validateForm = useCallback((): boolean => {
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
  }, [formData])

  // Validate new client
  const validateNewClient = useCallback(() => {
    const newErrors: any = {}

    if (!newClientData.nom.trim()) newErrors.clientNom = 'Le nom est requis'
    if (!newClientData.prenom.trim()) newErrors.clientPrenom = 'Le prénom est requis'
    if (!newClientData.telephone.trim()) newErrors.clientTelephone = 'Le téléphone est requis'
    if (newClientData.email && !/\S+@\S+\.\S+/.test(newClientData.email)) {
      newErrors.clientEmail = 'Email invalide'
    }
    if (newClientData.typeClient === 'AUTRE' && !newClientData.autreType.trim()) {
      newErrors.clientAutreType = 'Précisez le type de client'
    }

    setErrors(prev => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }, [newClientData])

  // Validate new vehicle
  const validateNewVehicle = useCallback(() => {
    const newErrors: any = {}

    if (!newVehicleData.immatriculation.trim()) {
      newErrors.vehicleImmatriculation = 'L\'immatriculation est requise'
    } else if (!validateLicensePlate(newVehicleData.immatriculation.toUpperCase())) {
      newErrors.vehicleImmatriculation = 'Format invalide (ex: AA-123-BB)'
    }
    if (!newVehicleData.marque.trim()) newErrors.vehicleMarque = 'La marque est requise'
    if (!newVehicleData.modele.trim()) newErrors.vehicleModele = 'Le modèle est requis'

    setErrors(prev => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }, [newVehicleData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData)
    } else {
      setErrors(validationErrors)
    }
  }

  const handleInputChange = useCallback((field: keyof ODRFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }

      // Reset vehicle when client changes
      if (field === 'clientId') {
        newData.vehiculeId = ''
        setShowResults(false)
        setSearchTerm('')
      }

      return newData
    })
  }, [setSearchTerm, setShowResults])

  const handleArticleChange = useCallback((index: number, field: keyof ArticleODRFormData, value: any) => {
    setFormData(prev => {
      const newArticles = [...prev.articles]
      newArticles[index] = { ...newArticles[index], [field]: value }
      return { ...prev, articles: newArticles }
    })
  }, [])

  const addArticle = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { designation: '', prixUnitaireTTC: 0, quantite: 1 }]
    }))
  }, [])

  const removeArticle = useCallback((index: number) => {
    if (formData.articles.length > 1) {
      setFormData(prev => ({
        ...prev,
        articles: prev.articles.filter((_, i) => i !== index)
      }))
    }
  }, [formData.articles.length])

  const addPrestationToArticle = useCallback((index: number, prestationId: string) => {
    const prestation = prestations.find(p => p.id === prestationId)
    if (prestation) {
      setFormData(prev => {
        const newArticles = [...prev.articles]
        newArticles[index] = {
          ...newArticles[index],
          designation: prestation.nom,
          prixUnitaireTTC: prestation.prixDeBase,
          prestationId: prestationId
        }
        return { ...prev, articles: newArticles }
      })
    }
  }, [prestations])

  // Handle client selection from search
  const handleClientSelect = (client: Client) => {
    handleInputChange('clientId', client.id)
    setShowResults(false)
  }

  // Handle new client creation
  const handleCreateNewClient = async () => {
    if (!validateNewClient() || !onAddClient) return

    try {
      const clientId = await onAddClient(newClientData)
      handleInputChange('clientId', clientId)
      setShowNewClientForm(false)
      setNewClientData({
        nom: '',
        prenom: '',
        entreprise: '',
        telephone: '',
        email: '',
        typeClient: 'PARTICULIER',
        autreType: '',
        grandCompte: false,
        contactPersonne: { nom: '', telephone: '', email: '', poste: '' }
      })
    } catch (error) {
      console.error('Erreur lors de la création du client:', error)
    }
  }

  // Handle new vehicle creation
  const handleCreateNewVehicle = async () => {
    if (!validateNewVehicle() || !onAddVehicle || !formData.clientId) return

    try {
      const vehicleId = await onAddVehicle({
        ...newVehicleData,
        clientId: formData.clientId
      })
      handleInputChange('vehiculeId', vehicleId)
      setShowNewVehicleForm(false)
      setNewVehicleData({
        immatriculation: '',
        immatriculationAlternative: '',
        marque: '',
        modele: '',
        kilometrageActuel: 0
      })
    } catch (error) {
      console.error('Erreur lors de la création du véhicule:', error)
    }
  }

  // Memoized filtered data
  const filteredVehicules = vehicules.filter(v => v.clientId === formData.clientId)
  const filteredPrestations = prestations.filter(p => p.typeService === formData.typeService)

  // Memoized calculations
  const montantTotal = useMemo(() => {
    return formData.articles.reduce((sum, article) =>
      sum + (article.prixUnitaireTTC * article.quantite), 0)
  }, [formData.articles])

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
                <p className="text-sm text-slate-600 font-normal">Recherchez ou sélectionnez le client et le véhicule</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Client Search */}
              <div className="space-y-2">
                <Label htmlFor="clientSearch" className="font-medium">
                  Rechercher un Client <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                  <Input
                    id="clientSearch"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nom, prénom ou numéro client..."
                    className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.clientId && !selectedClient ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                    onFocus={() => hasSearched && setShowResults(true)}
                  />
                  {selectedClient && (
                    <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                </div>

                {/* Search Results */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <p className="text-xs text-slate-600 mb-2">
                        {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                      </p>
                      {searchResults.map((client) => (
                        <div
                          key={client.id}
                          className="p-3 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-slate-400" />
                              <div>
                                <p className="font-medium text-slate-900">
                                  {client.prenom} {client.nom}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {client.numeroClient}
                                  {client.entreprise && ` • ${client.entreprise}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {client.typeClient && (
                                <Badge variant="secondary" className="text-xs">
                                  {client.typeClient}
                                </Badge>
                              )}
                              {client.grandCompte && (
                                <Badge variant="outline" className="border-yellow-300 text-yellow-700 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  GC
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results found */}
                {showResults && searchResults.length === 0 && hasSearched && (
                  <div className="absolute z-50  bg-white border border-slate-200 rounded-lg shadow-lg p-4">
                    <div className="text-center">
                      <p className="text-slate-600 mb-3">Aucun client trouvé</p>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowNewClientForm(true)
                          setShowResults(false)
                        }}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Créer un nouveau client
                      </Button>
                    </div>
                  </div>
                )}

                {errors.clientId && !selectedClient && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.clientId}
                  </div>
                )}

                {/* Selected Client Display */}
                {selectedClient && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">
                          {selectedClient.prenom} {selectedClient.nom} ({selectedClient.numeroClient})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('clientId', '')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                )}

                {/* Create New Client Button */}
                {!selectedClient && !showResults && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewClientForm(true)}
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer un nouveau client
                  </Button>
                )}
              </div>

              {/* Vehicle Selection */}
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
                    <SelectTrigger className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${errors.vehiculeId ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''} ${!formData.clientId ? 'opacity-50' : ''}`}>
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVehicules.map((vehicule) => (
                        <SelectItem key={vehicule.id} value={vehicule.id}>
                          <div className="flex items-center gap-2">
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

                {/* Add New Vehicle Button */}
                {formData.clientId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewVehicleForm(true)}
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un nouveau véhicule
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Client Form Modal/Expandable */}
        {showNewClientForm && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserPlus className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">Nouveau Client</h4>
                    <p className="text-sm text-green-700 font-normal">Renseignez les informations du client</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewClientForm(false)}
                  className="text-green-600 hover:text-green-700"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Client Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newClientNom">Nom <span className="text-red-500">*</span></Label>
                  <Input
                    id="newClientNom"
                    value={newClientData.nom}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, nom: e.target.value }))}
                    className={errors.clientNom ? 'border-red-300' : ''}
                  />
                  {errors.clientNom && <p className="text-sm text-red-600">{errors.clientNom}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newClientPrenom">Prénom <span className="text-red-500">*</span></Label>
                  <Input
                    id="newClientPrenom"
                    value={newClientData.prenom}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, prenom: e.target.value }))}
                    className={errors.clientPrenom ? 'border-red-300' : ''}
                  />
                  {errors.clientPrenom && <p className="text-sm text-red-600">{errors.clientPrenom}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newClientEntreprise">Entreprise</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="newClientEntreprise"
                      value={newClientData.entreprise}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, entreprise: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newClientTelephone">Téléphone <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="newClientTelephone"
                      value={newClientData.telephone}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, telephone: e.target.value }))}
                      className={`pl-10 ${errors.clientTelephone ? 'border-red-300' : ''}`}
                    />
                  </div>
                  {errors.clientTelephone && <p className="text-sm text-red-600">{errors.clientTelephone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="newClientEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="newClientEmail"
                      type="email"
                      value={newClientData.email}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                      className={`pl-10 ${errors.clientEmail ? 'border-red-300' : ''}`}
                    />
                  </div>
                  {errors.clientEmail && <p className="text-sm text-red-600">{errors.clientEmail}</p>}
                </div>
              </div>

              {/* Client Type */}
              <div className="space-y-3">
                <Label className="font-medium">Type de Client</Label>
                <RadioGroup
                  value={newClientData.typeClient}
                  onValueChange={(value: any) => setNewClientData(prev => ({ ...prev, typeClient: value }))}
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                >
                  {[
                    { value: 'VTC', label: 'VTC' },
                    { value: 'TAXI', label: 'Taxi' },
                    { value: 'PARTICULIER', label: 'Particulier' },
                    { value: 'TRANSPORTEUR', label: 'Transporteur' },
                    { value: 'AUTRE', label: 'Autre' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`client-${option.value}`} />
                      <Label htmlFor={`client-${option.value}`} className="text-sm">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {newClientData.typeClient === 'AUTRE' && (
                  <div className="space-y-2">
                    <Label htmlFor="newClientAutreType">Précisez le type</Label>
                    <Input
                      id="newClientAutreType"
                      value={newClientData.autreType}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, autreType: e.target.value }))}
                      className={errors.clientAutreType ? 'border-red-300' : ''}
                    />
                    {errors.clientAutreType && <p className="text-sm text-red-600">{errors.clientAutreType}</p>}
                  </div>
                )}
              </div>

              {/* Grand Compte */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newClientGrandCompte"
                    checked={newClientData.grandCompte}
                    onCheckedChange={(checked) =>
                      setNewClientData(prev => ({ ...prev, grandCompte: checked as boolean }))
                    }
                  />
                  <Label htmlFor="newClientGrandCompte" className="font-medium">
                    Grand Compte
                  </Label>
                </div>

                {newClientData.grandCompte && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                    <Label className="font-medium text-yellow-800">Contact Principal</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contactNom" className="text-sm">Nom du Contact</Label>
                        <Input
                          id="contactNom"
                          value={newClientData.contactPersonne.nom}
                          onChange={(e) => setNewClientData(prev => ({
                            ...prev,
                            contactPersonne: { ...prev.contactPersonne, nom: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPoste" className="text-sm">Poste</Label>
                        <Input
                          id="contactPoste"
                          value={newClientData.contactPersonne.poste}
                          onChange={(e) => setNewClientData(prev => ({
                            ...prev,
                            contactPersonne: { ...prev.contactPersonne, poste: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactTelephone" className="text-sm">Téléphone</Label>
                        <Input
                          id="contactTelephone"
                          value={newClientData.contactPersonne.telephone}
                          onChange={(e) => setNewClientData(prev => ({
                            ...prev,
                            contactPersonne: { ...prev.contactPersonne, telephone: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-sm">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={newClientData.contactPersonne.email}
                          onChange={(e) => setNewClientData(prev => ({
                            ...prev,
                            contactPersonne: { ...prev.contactPersonne, email: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewClientForm(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateNewClient}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Créer le Client
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Vehicle Form Modal/Expandable */}
        {showNewVehicleForm && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Car className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">Nouveau Véhicule</h4>
                    <p className="text-sm text-green-700 font-normal">Ajoutez un véhicule pour ce client</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewVehicleForm(false)}
                  className="text-green-600 hover:text-green-700"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newVehicleImmatriculation">
                    Immatriculation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="newVehicleImmatriculation"
                    value={newVehicleData.immatriculation}
                    onChange={(e) => setNewVehicleData(prev => ({
                      ...prev,
                      immatriculation: e.target.value.toUpperCase()
                    }))}
                    placeholder="AA-123-BB"
                    className={`font-mono ${errors.vehicleImmatriculation ? 'border-red-300' : ''}`}
                  />
                  {errors.vehicleImmatriculation && (
                    <p className="text-sm text-red-600">{errors.vehicleImmatriculation}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newVehicleImmatriculationAlt">Immatriculation Alternative</Label>
                  <Input
                    id="newVehicleImmatriculationAlt"
                    value={newVehicleData.immatriculationAlternative}
                    onChange={(e) => setNewVehicleData(prev => ({
                      ...prev,
                      immatriculationAlternative: e.target.value.toUpperCase()
                    }))}
                    placeholder="AA-123-BB"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newVehicleMarque">
                    Marque <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="newVehicleMarque"
                    value={newVehicleData.marque}
                    onChange={(e) => setNewVehicleData(prev => ({
                      ...prev,
                      marque: e.target.value
                    }))}
                    className={errors.vehicleMarque ? 'border-red-300' : ''}
                  />
                  {errors.vehicleMarque && (
                    <p className="text-sm text-red-600">{errors.vehicleMarque}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newVehicleModele">
                    Modèle <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="newVehicleModele"
                    value={newVehicleData.modele}
                    onChange={(e) => setNewVehicleData(prev => ({
                      ...prev,
                      modele: e.target.value
                    }))}
                    className={errors.vehicleModele ? 'border-red-300' : ''}
                  />
                  {errors.vehicleModele && (
                    <p className="text-sm text-red-600">{errors.vehicleModele}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="newVehicleKilometrage">Kilométrage Actuel</Label>
                  <Input
                    id="newVehicleKilometrage"
                    type="number"
                    value={newVehicleData.kilometrageActuel}
                    onChange={(e) => setNewVehicleData(prev => ({
                      ...prev,
                      kilometrageActuel: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewVehicleForm(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateNewVehicle}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter le Véhicule
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Type de Service et Date - RESTE IDENTIQUE */}
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
            </div>
          </CardContent>
        </Card>

        {/* Prestations - RESTE IDENTIQUE */}
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
                      name={`article_${index}_designation`}
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
                        name={`article_${index}_prix`}
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
                        name={`article_${index}_quantite`}
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

        {/* Observations - RESTE IDENTIQUE */}
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

        {/* Récapitulatif - RESTE IDENTIQUE */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calculator className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Récapitulatif</h4>
                <p className="text-sm text-slate-600 font-normal">Vérifiez les informations avant {isEdit ? 'modification' : 'création'}</p>
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

        {/* Actions - RESTE IDENTIQUE */}
        <Card className="border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {isEdit ? 'Prêt à modifier l\'ODR ?' : 'Prêt à créer l\'ODR ?'}
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
                  disabled={isLoading || Object.keys(errors).length > 0}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      {isEdit ? 'Modifier l\'ODR' : 'Créer l\'ODR'}
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