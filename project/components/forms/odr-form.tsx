import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  User,
  Plus,
  Car,
  Settings,
  FileText,
  Loader2,
  CheckCircle,
  MessageSquare,
  Calculator,
  Euro,
  ClipboardList,
  PaintBucket,
  Wrench,
  Gauge,
  Trash2,
  AlertCircle,
  Phone,
  Mail,
  Building,
  UserCheck,
  UserPlus,
  Contact,
  Hash,
  Briefcase
} from 'lucide-react'

// [Keep all your existing interfaces unchanged]
interface Client {
  id: string
  nom: string
  prenom: string
  telephone: string
  email: string
  adresse: string
  typeClient: 'PARTICULIER' | 'PROFESSIONNEL'
  entreprise?: string
  siret?: string
  contactPersonne?: {
    nom: string
    prenom: string
    telephone: string
    email: string
    poste: string
  }
}

interface Vehicule {
  id: string
  clientId: string
  marque: string
  modele: string
  immatriculation: string
  immatriculationAlternative?: string
  kilometrageActuel: number
}

interface VehicleService {
  vehicleId: string
  typeService: 'CARROSSERIE' | 'MECANIQUE' | 'CARROSSERIE_ET_MECANIQUE'
  oldKilometrage: number
  newKilometrage: number
}

interface ServiceConfig {
  title: string
  details: string
  price: number
}

interface ContactPerson {
  id: string
  nom: string
  telephone: string
  email: string
  fonction: string
}

interface NewClientData {
  nomComplet: string
  telephone: string
  email: string
  nomEntreprise: string
  clientCategory: 'CLIENT_NORMAL' | 'GRAND_COMPTE'
  contactPersonnes: ContactPerson[]
}

interface NewVehicleData {
  marque: string
  modele: string
  immatriculation: string
  immatriculationAlternative: string
  kilometrageActuel: number
  formatImmatriculation: 'STANDARD' | 'LIBRE'
}

interface Article {
  designation: string
  prixUnitaireTTC: number
  quantite: number
}

interface FormData {
  typeService: 'CARROSSERIE' | 'MECANIQUE' | 'MIXTE'
  observations: string
  articles: Article[]
}

interface Prestation {
  id: string
  nom: string
  prixDeBase: number
  typeService: 'CARROSSERIE' | 'MECANIQUE'
}

interface CreateODRFormProps {
  clients: Client[]
  vehicules: Vehicule[]
  prestations?: Prestation[]
  onSubmit: (data: any) => void
  onCancel: () => void
  onCreateVehicle?: (vehicleData: NewVehicleData, clientId: string) => Promise<Vehicule> // Add this
  initialData?: any
  isEdit?: boolean
  isLoading?: boolean
}

export function ODRForm({
  clients,
  vehicules,
  prestations = [],
  onSubmit,
  onCancel,
  onCreateVehicle,
  initialData,
  isEdit = false,
  isLoading = false
}: CreateODRFormProps) {
  // États
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleService[]>([])
  const [serviceConfigs, setServiceConfigs] = useState<ServiceConfig[]>([
    { title: '', details: '', price: 0 }
  ])
  const [formData, setFormData] = useState<FormData>({
    typeService: 'CARROSSERIE',
    observations: '',
    articles: [{ designation: '', prixUnitaireTTC: 0, quantite: 1 }]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false)
  const [newClientData, setNewClientData] = useState<NewClientData>({
    nomComplet: '',
    telephone: '',
    email: '',
    nomEntreprise: '',
    clientCategory: 'CLIENT_NORMAL',
    contactPersonnes: []
  })
  const [newVehicleData, setNewVehicleData] = useState<NewVehicleData>({
    marque: '',
    modele: '',
    immatriculation: '',
    immatriculationAlternative: '',
    kilometrageActuel: 0,
    formatImmatriculation: 'STANDARD'
  })
  const [localVehicules, setLocalVehicules] = useState<Vehicule[]>(vehicules)

  // Filtrage des clients
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return []
    return clients.filter(client => {
      const fullName = `${client.prenom} ${client.nom}`.toLowerCase()
      const reverseName = `${client.nom} ${client.prenom}`.toLowerCase()
      const query = searchQuery.toLowerCase()
      return fullName.includes(query) || reverseName.includes(query)
    })
  }, [clients, searchQuery])

  // Véhicules filtrés
  const filteredVehicules = useMemo(() => {
    if (!selectedClient) return []
    return localVehicules.filter(v => v.clientId === selectedClient.id)
  }, [localVehicules, selectedClient])

  // Prestations filtrées selon le type de service
  const filteredPrestations = useMemo(() => {
    if (formData.typeService === 'MIXTE') return prestations
    return prestations.filter(p => p.typeService === formData.typeService)
  }, [prestations, formData.typeService])

  // Calcul du montant total
  const montantTotal = useMemo(() => {
    return formData.articles.reduce((total, article) =>
      total + (article.prixUnitaireTTC * article.quantite), 0)
  }, [formData.articles])

  // Gestion des contacts pour Grand Compte
  const addContactPerson = () => {
    const newContact = {
      id: Date.now().toString(),
      nom: '',
      telephone: '',
      email: '',
      fonction: ''
    }
    setNewClientData(prev => ({
      ...prev,
      contactPersonnes: [...prev.contactPersonnes, newContact]
    }))
  }

  const removeContactPerson = (contactId: string) => {
    setNewClientData(prev => ({
      ...prev,
      contactPersonnes: prev.contactPersonnes.filter(contact => contact.id !== contactId)
    }))
  }

  const updateContactPerson = (contactId: string, field: string, value: string) => {
    setNewClientData(prev => ({
      ...prev,
      contactPersonnes: prev.contactPersonnes.map(contact =>
        contact.id === contactId ? { ...contact, [field]: value } : contact
      )
    }))
  }

  // Validation de l'immatriculation
  const validateImmatriculation = (immat: string, format: 'STANDARD' | 'LIBRE') => {
    if (format === 'STANDARD') {
      const standardRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/
      return standardRegex.test(immat)
    }
    return immat.length > 0 // Format libre accepte tout
  }

  // Formatage automatique de l'immatriculation standard
  const formatImmatriculation = (value: string) => {
    // Supprimer tous les caractères non alphanumériques
    const cleaned = value.replace(/[^A-Z0-9]/g, '')

    // Appliquer le format XX-XXX-XX
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
    } else {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}`
    }
  }

  const handleImmatriculationChange = (value: string, field: 'immatriculation' | 'immatriculationAlternative') => {
    const upperValue = value.toUpperCase()

    if (newVehicleData.formatImmatriculation === 'STANDARD') {
      const formatted = formatImmatriculation(upperValue)
      setNewVehicleData(prev => ({
        ...prev,
        [field]: formatted
      }))
    } else {
      setNewVehicleData(prev => ({
        ...prev,
        [field]: upperValue
      }))
    }
  }

  // Gestion des articles
  const addArticle = () => {
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { designation: '', prixUnitaireTTC: 0, quantite: 1 }]
    }))
  }

  const removeArticle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.filter((_, i) => i !== index)
    }))
  }

  const handleArticleChange = (index: number, field: keyof Article, value: any) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.map((article, i) =>
        i === index ? { ...article, [field]: value } : article
      )
    }))
  }

  const addPrestationToArticle = (index: number, prestationId: string) => {
    const prestation = prestations.find(p => p.id === prestationId)
    if (prestation) {
      handleArticleChange(index, 'designation', prestation.nom)
      handleArticleChange(index, 'prixUnitaireTTC', prestation.prixDeBase)
    }
  }

  // Gestion des véhicules sélectionnés
  const handleVehicleServiceChange = (vehicleId: string, field: keyof VehicleService, value: any) => {
    setSelectedVehicles(prev => {
      const existing = prev.find(v => v.vehicleId === vehicleId)
      if (existing) {
        return prev.map(v =>
          v.vehicleId === vehicleId ? { ...v, [field]: value } : v
        )
      } else {
        return [...prev, {
          vehicleId,
          typeService: 'CARROSSERIE',
          oldKilometrage: 0,
          newKilometrage: 0,
          [field]: value
        }]
      }
    })
  }

  // Création d'un nouveau client
  const handleCreateNewClient = async () => {
    const clientErrors: Record<string, string> = {}

    // Fix field names to match state
    if (!newClientData.nomComplet.trim()) clientErrors.clientNomComplet = 'Le nom complet est requis'
    if (!newClientData.telephone.trim()) clientErrors.clientTelephone = 'Le téléphone est requis'
    if (!newClientData.email.trim()) clientErrors.clientEmail = 'L\'email est requis'

    // Validation des contacts pour Grand Compte
    if (newClientData.clientCategory === 'GRAND_COMPTE') {
      newClientData.contactPersonnes.forEach((contact, index) => {
        if (!contact.nom.trim()) clientErrors[`contact_${index}_nom`] = 'Le nom est requis'
        if (!contact.telephone.trim()) clientErrors[`contact_${index}_telephone`] = 'Le téléphone est requis'
        if (!contact.email.trim()) clientErrors[`contact_${index}_email`] = 'L\'email est requis'
        if (!contact.fonction.trim()) clientErrors[`contact_${index}_fonction`] = 'La fonction est requise'
      })
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    try {
      console.log('Création du client:', newClientData)

      // Create new client with proper field mapping
      const [prenom, ...nomParts] = newClientData.nomComplet.trim().split(' ')
      const nom = nomParts.join(' ') || prenom // If only one word, use it as nom

      const newClient: Client = {
        id: Date.now().toString(),
        nom: nom,
        prenom: prenom,
        telephone: newClientData.telephone,
        email: newClientData.email,
        adresse: '', // Add default value
        typeClient: newClientData.clientCategory === 'CLIENT_NORMAL' ? 'PARTICULIER' : 'PROFESSIONNEL',
        entreprise: newClientData.nomEntreprise || undefined
      }

      setSelectedClient(newClient)
      setShowNewClientForm(false)
      setShowNewVehicleForm(true)

      // Reset form
      setNewClientData({
        nomComplet: '',
        telephone: '',
        email: '',
        nomEntreprise: '',
        clientCategory: 'CLIENT_NORMAL',
        contactPersonnes: []
      })
      setErrors({})
    } catch (error) {
      console.error('Erreur lors de la création du client:', error)
    }
  }

  // Création d'un nouveau véhicule
  const handleCreateNewVehicle = async () => {
    const vehicleErrors: Record<string, string> = {}

    if (!newVehicleData.marque.trim()) vehicleErrors.vehicleMarque = 'La marque est requise'
    if (!newVehicleData.modele.trim()) vehicleErrors.vehicleModele = 'Le modèle est requis'
    if (!newVehicleData.immatriculation.trim()) {
      vehicleErrors.vehicleImmatriculation = 'L\'immatriculation est requise'
    } else if (newVehicleData.formatImmatriculation === 'STANDARD' &&
      !validateImmatriculation(newVehicleData.immatriculation, 'STANDARD')) {
      vehicleErrors.vehicleImmatriculation = 'Format invalide (ex: AB-123-CD)'
    }

    if (Object.keys(vehicleErrors).length > 0) {
      setErrors(vehicleErrors)
      return
    }

    try {
      const newVehicle: Vehicule = {
        id: Date.now().toString(),
        clientId: selectedClient!.id,
        marque: newVehicleData.marque,
        modele: newVehicleData.modele,
        immatriculation: newVehicleData.immatriculation,
        immatriculationAlternative: newVehicleData.immatriculationAlternative || undefined,
        kilometrageActuel: newVehicleData.kilometrageActuel
      }

      // ✅ Add to local vehicles list
      setLocalVehicules(prev => [...prev, newVehicle])

      console.log('Véhicule ajouté:', newVehicle)
      setShowNewVehicleForm(false)
      setErrors({})
    } catch (error) {
      console.error('Erreur lors de la création du véhicule:', error)
    }

  }

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors: Record<string, string> = {}

    if (!selectedClient) formErrors.client = 'Veuillez sélectionner un client'
    if (selectedVehicles.length === 0) formErrors.vehicles = 'Veuillez sélectionner au moins un véhicule'

    // Validation des articles
    formData.articles.forEach((article, index) => {
      if (!article.designation.trim()) formErrors[`article_${index}_designation`] = 'La description est requise'
      if (article.prixUnitaireTTC <= 0) formErrors[`article_${index}_prix`] = 'Le prix doit être supérieur à 0'
      if (article.quantite <= 0) formErrors[`article_${index}_quantite`] = 'La quantité doit être supérieure à 0'
    })

    // Validation des kilométrages
    selectedVehicles.forEach((vehicle, index) => {
      if (vehicle.newKilometrage <= vehicle.oldKilometrage) {
        formErrors[`vehicle_${index}_kilometrage`] = 'Le nouveau kilométrage doit être supérieur à l\'ancien'
      }
    })

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    const submissionData = {
      client: selectedClient,
      vehicles: selectedVehicles,
      articles: formData.articles,
      typeService: formData.typeService,
      observations: formData.observations,
      montantTotal
    }

    onSubmit(submissionData)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection and Vehicle Selection - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Selection */}
          <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Sélection du Client</h4>
                  <p className="text-sm text-slate-600 font-normal">Recherchez ou créez un nouveau client</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedClient ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clientSearch" className="font-medium">Rechercher un client</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="clientSearch"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Nom, prénom ou nom + prénom..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Résultats de recherche */}
                  {searchQuery && (
                    <div className="space-y-2">
                      {filteredClients.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
                          {filteredClients.map((client) => (
                            <div
                              key={client.id}
                              className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                              onClick={() => {
                                setSelectedClient(client)
                                setSearchQuery('')
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-medium text-slate-900 truncate">
                                    {client.prenom} {client.nom}
                                  </h5>
                                </div>
                                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex-shrink-0 ml-2">
                                  {client.typeClient === 'PARTICULIER' ? 'Part.' : 'Pro.'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-500">
                          <User className="h-8 w-8 mx-auto mb-3 text-slate-400" />
                          <p className="mb-3 text-sm">Aucun client trouvé pour "{searchQuery}"</p>
                          <Button
                            type="button"
                            onClick={() => setShowNewClientForm(true)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Créer un nouveau client
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {!searchQuery && (
                    <div className="text-center py-6">
                      <Button
                        type="button"
                        onClick={() => setShowNewClientForm(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Créer un nouveau client
                      </Button>
                    </div>
                  )}

                  {errors.client && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.client}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-medium text-blue-900 truncate">
                          {selectedClient.prenom} {selectedClient.nom}
                        </h5>
                        <div className="flex flex-col gap-1 text-xs text-blue-700 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{selectedClient.telephone}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{selectedClient.email}</span>
                          </span>
                          {selectedClient.entreprise && (
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{selectedClient.entreprise}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {selectedClient.typeClient === 'PARTICULIER' ? 'Particulier' : 'Professionnel'}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(null)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Changer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Selection with Service Types */}
          <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Car className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Véhicules et Services</h4>
                  <p className="text-sm text-slate-600 font-normal">Sélectionnez les véhicules et types de service</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedClient ? (
                <>
                  {filteredVehicules.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredVehicules.map((vehicule, index) => {
                        const vehicleService = selectedVehicles.find(v => v.vehicleId === vehicule.id)
                        return (
                          <div key={vehicule.id} className="p-3 border border-slate-200 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50">
                            <div className="space-y-3">
                              {/* Vehicle Info */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                                    <Car className="h-3 w-3 text-blue-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-medium text-slate-900 text-sm truncate">
                                      {vehicule.marque} {vehicule.modele}
                                    </h5>
                                    <p className="text-xs text-slate-600 truncate">
                                      {vehicule.immatriculation}
                                      {vehicule.immatriculationAlternative && ` / ${vehicule.immatriculationAlternative}`}
                                    </p>
                                  </div>
                                </div>
                                <Checkbox
                                  checked={!!vehicleService}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleVehicleServiceChange(vehicule.id, 'typeService', 'CARROSSERIE')
                                    } else {
                                      setSelectedVehicles(prev => prev.filter(v => v.vehicleId !== vehicule.id))
                                    }
                                  }}
                                />
                              </div>

                              {/* Service Configuration */}
                              {vehicleService && (
                                <div className="space-y-3 pl-2 border-l-2 border-blue-200">
                                  {/* Service Type Selection */}
                                  <div className="space-y-2">
                                    <Label className="font-medium text-xs">Type de Service</Label>
                                    <RadioGroup
                                      value={vehicleService.typeService}
                                      onValueChange={(value: any) =>
                                        handleVehicleServiceChange(vehicule.id, 'typeService', value)
                                      }
                                      className="flex flex-wrap gap-3"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="CARROSSERIE" id={`${vehicule.id}-carrosserie`} className="h-3 w-3" />
                                        <Label htmlFor={`${vehicule.id}-carrosserie`} className="flex items-center gap-1 text-xs">
                                          <PaintBucket className="h-3 w-3 text-orange-500" />
                                          Carrosserie
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="MECANIQUE" id={`${vehicule.id}-mecanique`} className="h-3 w-3" />
                                        <Label htmlFor={`${vehicule.id}-mecanique`} className="flex items-center gap-1 text-xs">
                                          <Wrench className="h-3 w-3 text-blue-500" />
                                          Mécanique
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="CARROSSERIE_ET_MECANIQUE" id={`${vehicule.id}-mixte`} className="h-3 w-3" />
                                        <Label htmlFor={`${vehicule.id}-mixte`} className="flex items-center gap-1 text-xs">
                                          <Settings className="h-3 w-3 text-purple-500" />
                                          Mixte
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>

                                  {/* Kilometrage */}
                                  <div className="grid gap-2 grid-cols-2">
                                    <div className="space-y-1">
                                      <Label className="font-medium text-xs">Ancien Km</Label>
                                      <div className="relative">
                                        <Gauge className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                                        <Input disabled
                                          type="number"
                                          value={vehicleService.oldKilometrage}
                                          onChange={(e) =>
                                            handleVehicleServiceChange(
                                              vehicule.id,
                                              'oldKilometrage',
                                              parseInt(e.target.value) || 0
                                            )
                                          }
                                          className="pl-7 h-8 text-xs"
                                          placeholder="0"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="font-medium text-xs">Nouveau Km</Label>
                                      <div className="relative">
                                        <Gauge className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                                        <Input
                                          type="number"
                                          value={vehicleService.newKilometrage}
                                          onChange={(e) =>
                                            handleVehicleServiceChange(
                                              vehicule.id,
                                              'newKilometrage',
                                              parseInt(e.target.value) || 0
                                            )
                                          }
                                          className={`pl-7 h-8 text-xs ${errors[`vehicle_${index}_kilometrage`] ? 'border-red-300' : ''}`}
                                          placeholder="0"
                                        />
                                      </div>
                                      {errors[`vehicle_${index}_kilometrage`] && (
                                        <p className="text-xs text-red-600">{errors[`vehicle_${index}_kilometrage`]}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Car className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 mb-3 text-sm">Aucun véhicule trouvé pour ce client</p>
                      <Button
                        type="button"
                        onClick={() => setShowNewVehicleForm(true)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un véhicule
                      </Button>
                    </div>
                  )}

                  {filteredVehicules.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewVehicleForm(true)}
                      size="sm"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un nouveau véhicule
                    </Button>
                  )}

                  {errors.vehicles && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {errors.vehicles}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Car className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm">Sélectionnez d'abord un client</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* New Client Form */}
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
                    <p className="text-sm text-green-700 font-normal">Informations complètes du client</p>
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
            <CardContent className="space-y-6">
              {/* Informations de Base */}
              <div className="space-y-4">
                <h5 className="font-medium text-green-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations de Base
                </h5>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newClientNomComplet">Nom complet <span className="text-red-500">*</span></Label>
                    <Input
                      id="newClientNomComplet"
                      value={newClientData.nomComplet}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, nomComplet: e.target.value }))}
                      className={errors.clientNomComplet ? 'border-red-300' : ''}
                      placeholder="Ex: Jean Dupont"
                    />
                    {errors.clientNomComplet && <p className="text-sm text-red-600">{errors.clientNomComplet}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newClientEntreprise">Nom entreprise</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="newClientEntreprise"
                        value={newClientData.nomEntreprise}
                        onChange={(e) => setNewClientData(prev => ({ ...prev, nomEntreprise: e.target.value }))}
                        className="pl-10"
                        placeholder="Ex: Transport Dupont "
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newClientTel">Tel <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="newClientTel"
                        value={newClientData.telephone}
                        onChange={(e) => setNewClientData(prev => ({ ...prev, telephone: e.target.value }))}
                        className={`pl-10 ${errors.clientTelephone ? 'border-red-300' : ''}`}
                        placeholder="Ex: 06 12 34 56 78"
                      />
                    </div>
                    {errors.clientTelephone && <p className="text-sm text-red-600">{errors.clientTelephone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newClientEmail">Email <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="newClientEmail"
                        type="email"
                        value={newClientData.email}
                        onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                        className={`pl-10 ${errors.clientEmail ? 'border-red-300' : ''}`}
                        placeholder="Ex: jean.dupont@email.com"
                      />
                    </div>
                    {errors.clientEmail && <p className="text-sm text-red-600">{errors.clientEmail}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Client Category Selection */}
              <div className="space-y-4">
                <RadioGroup
                  value={newClientData.clientCategory}
                  onValueChange={(value: any) => setNewClientData(prev => ({
                    ...prev,
                    clientCategory: value,
                    // Reset contact persons when switching categories
                    contactPersonnes: value === 'GRAND_COMPTE' ? prev.contactPersonnes : []
                  }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg">
                    <RadioGroupItem value="CLIENT_NORMAL" id="client-normal" />
                    <Label htmlFor="client-normal" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4 text-blue-500" />
                      Client Normal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg">
                    <RadioGroupItem value="GRAND_COMPTE" id="grand-compte" />
                    <Label htmlFor="grand-compte" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4 text-purple-500" />
                      Grand Compte
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Grand Compte Section */}
              {newClientData.clientCategory === 'GRAND_COMPTE' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium text-green-900 flex items-center gap-2">
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

                  {newClientData.contactPersonnes.map((contact, index) => (
                    <div key={contact.id} className="p-4 bg-white border border-green-300 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Contact className="h-4 w-4 text-blue-600" />
                          <h6 className="font-medium text-green-900">Contact {index + 1}</h6>
                        </div>
                        {newClientData.contactPersonnes.length > 1 && (
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
                          <Label>Nom <span className="text-red-500">*</span></Label>
                          <Input
                            value={contact.nom}
                            onChange={(e) => updateContactPerson(contact.id, 'nom', e.target.value)}
                            className={errors[`contact_${index}_nom`] ? 'border-red-300' : ''}
                            placeholder="Ex: Marie Martin"
                          />
                          {errors[`contact_${index}_nom`] && (
                            <p className="text-sm text-red-600">{errors[`contact_${index}_nom`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Tel <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              value={contact.telephone}
                              onChange={(e) => updateContactPerson(contact.id, 'telephone', e.target.value)}
                              className={`pl-10 ${errors[`contact_${index}_telephone`] ? 'border-red-300' : ''}`}
                              placeholder="Ex: 01 23 45 67 89"
                            />
                          </div>
                          {errors[`contact_${index}_telephone`] && (
                            <p className="text-sm text-red-600">{errors[`contact_${index}_telephone`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Email <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              type="email"
                              value={contact.email}
                              onChange={(e) => updateContactPerson(contact.id, 'email', e.target.value)}
                              className={`pl-10 ${errors[`contact_${index}_email`] ? 'border-red-300' : ''}`}
                              placeholder="Ex: marie.martin@entreprise.com"
                            />
                          </div>
                          {errors[`contact_${index}_email`] && (
                            <p className="text-sm text-red-600">{errors[`contact_${index}_email`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Fonction <span className="text-red-500">*</span></Label>
                          <Input
                            value={contact.fonction}
                            onChange={(e) => updateContactPerson(contact.id, 'fonction', e.target.value)}
                            className={errors[`contact_${index}_fonction`] ? 'border-red-300' : ''}
                            placeholder="Ex: Responsable Flotte"
                          />
                          {errors[`contact_${index}_fonction`] && (
                            <p className="text-sm text-red-600">{errors[`contact_${index}_fonction`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {newClientData.contactPersonnes.length === 0 && (
                    <div className="text-center py-4 text-slate-500 border border-dashed border-slate-300 rounded-lg">
                      <Contact className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                      <p className="text-sm">Aucune personne de contact ajoutée</p>
                      <p className="text-xs text-slate-400">Cliquez sur "Ajouter Contact" pour commencer</p>
                    </div>
                  )}
                </div>
              )}

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

        {/* New Vehicle Form */}
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
                    <p className="text-sm text-green-700 font-normal">Informations du véhicule</p>
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
              </div>

              {/* Format Immatriculation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Immatriculation <span className="text-red-500">*</span></Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewVehicleData(prev => ({
                      ...prev,
                      formatImmatriculation: prev.formatImmatriculation === 'STANDARD' ? 'LIBRE' : 'STANDARD',
                      immatriculation: ''
                    }))}
                    className="text-xs"
                  >
                    {newVehicleData.formatImmatriculation === 'STANDARD' ? 'Passer en libre' : 'Passer en standard'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={newVehicleData.immatriculation}
                      onChange={(e) => handleImmatriculationChange(e.target.value, 'immatriculation')}
                      placeholder={newVehicleData.formatImmatriculation === 'STANDARD' ? 'AB-123-CD' : 'Immatriculation libre'}
                      className={`pl-10 font-mono ${errors.vehicleImmatriculation ? 'border-red-300' : ''}`}
                      maxLength={newVehicleData.formatImmatriculation === 'STANDARD' ? 9 : undefined}
                    />
                  </div>
                  {errors.vehicleImmatriculation && (
                    <p className="text-sm text-red-600">{errors.vehicleImmatriculation}</p>
                  )}

                  {/* Info sur le format */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 p-2 rounded">
                    <div className="p-1 bg-blue-100 rounded">
                      <AlertCircle className="h-3 w-3 text-blue-600" />
                    </div>
                    {newVehicleData.formatImmatriculation === 'STANDARD' ? (
                      <span>Format standard: Saisissez les lettres et chiffres (ex: ab123cd → AB-123-CD)</span>
                    ) : (
                      <span>Format libre: Pour les immatriculations anciennes ou étrangères</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newVehicleKilometrage">Kilométrage Actuel</Label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="newVehicleKilometrage"
                      type="number"
                      value={newVehicleData.kilometrageActuel}
                      onChange={(e) => setNewVehicleData(prev => ({
                        ...prev,
                        kilometrageActuel: parseInt(e.target.value) || 0
                      }))}
                      className="pl-10"
                      placeholder="0"
                    />
                  </div>
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

        {/* Type de Service */}
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
            <div className="space-y-3">
              <Label className="font-medium">Type de Travail</Label>
              <RadioGroup
                value={formData.typeService}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, typeService: value }))}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CARROSSERIE" id="service-carrosserie" />
                  <Label htmlFor="service-carrosserie" className="flex items-center gap-2">
                    <PaintBucket className="h-4 w-4 text-orange-500" />
                    Carrosserie
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MECANIQUE" id="service-mecanique" />
                  <Label htmlFor="service-mecanique" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-500" />
                    Mécanique
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MIXTE" id="service-mixte" />
                  <Label htmlFor="service-mixte" className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    Mixte
                  </Label>
                </div>
              </RadioGroup>
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
                                {prestation.typeService === 'CARROSSERIE' ? (
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

        {/* Observations */}
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Observations</h4>
                <p className="text-sm text-slate-600 font-normal">Notes et informations complémentaires</p>
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
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Notes particulières, état du véhicule, demandes spécifiques..."
                  rows={4}
                  className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary and Total */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calculator className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Récapitulatif</h4>
                <p className="text-sm text-slate-600 font-normal">Résumé de la commande</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <div className="space-y-3">
                {selectedClient && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Client:
                    </span>
                    <span className="font-medium text-slate-900">
                      {selectedClient.prenom} {selectedClient.nom}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Véhicules sélectionnés:
                  </span>
                  <span className="font-medium text-slate-900">
                    {selectedVehicles.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Type de travail:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.typeService === 'CARROSSERIE' ? 'Carrosserie' :
                      formData.typeService === 'MECANIQUE' ? 'Mécanique' : 'Mixte'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Prestations configurées:
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.articles.length}
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