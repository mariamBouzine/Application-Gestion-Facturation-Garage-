'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Euro,
  Eye,
  PaintBucket,
  Wrench,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  Copy,
  Send,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building,
  Car,
  User
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DevisForm } from '@/components/forms/devis-form'
import { toast } from 'sonner'

// Mock data
const mockDevis = [
  {
    id: '1',
    numeroDevis: 'DEV-2024-001',
    date: new Date('2024-01-20T09:00:00Z'),
    dateValidite: new Date('2024-02-19T09:00:00Z'),
    clientNom: 'Martin Dubois',
    vehicule: 'Peugeot 308 - AB-123-CD',
    statut: 'EN_ATTENTE',
    typeService: 'CARROSSERIE',
    totalHT: 850.00,
    montantTVA: 170.00,
    totalTTC: 1020.00,
    createdAt: new Date('2024-01-20T09:00:00Z')
  },
  {
    id: '2',
    numeroDevis: 'DEV-2024-002',
    date: new Date('2024-01-15T14:30:00Z'),
    dateValidite: new Date('2024-02-14T14:30:00Z'),
    clientNom: 'Sophie Lambert',
    vehicule: 'Renault Clio - EF-456-GH',
    statut: 'ACCEPTE',
    typeService: 'MECANIQUE',
    totalHT: 450.00,
    montantTVA: 90.00,
    totalTTC: 540.00,
    createdAt: new Date('2024-01-15T14:30:00Z')
  },
  {
    id: '3',
    numeroDevis: 'DEV-2024-003',
    date: new Date('2024-01-22T10:15:00Z'),
    dateValidite: new Date('2024-02-21T10:15:00Z'),
    clientNom: 'Pierre Moreau',
    vehicule: 'BMW X3 - IJ-789-KL',
    statut: 'REFUSE',
    typeService: 'CARROSSERIE',
    totalHT: 1250.00,
    montantTVA: 250.00,
    totalTTC: 1500.00,
    createdAt: new Date('2024-01-22T10:15:00Z')
  },
  {
    id: '4',
    numeroDevis: 'DEV-2024-004',
    date: new Date('2024-01-10T16:45:00Z'),
    dateValidite: new Date('2024-02-09T16:45:00Z'),
    clientNom: 'Marie Petit',
    vehicule: 'Volkswagen Golf - MN-012-OP',
    statut: 'EXPIRE',
    typeService: 'MECANIQUE',
    totalHT: 320.00,
    montantTVA: 64.00,
    totalTTC: 384.00,
    createdAt: new Date('2024-01-10T16:45:00Z')
  },
  {
    id: '5',
    numeroDevis: 'DEV-2024-005',
    date: new Date('2024-01-25T11:30:00Z'),
    dateValidite: new Date('2024-02-24T11:30:00Z'),
    clientNom: 'Jean Durand',
    vehicule: 'Audi A4 - QR-345-ST',
    statut: 'EN_ATTENTE',
    typeService: 'CARROSSERIE',
    totalHT: 675.00,
    montantTVA: 135.00,
    totalTTC: 810.00,
    createdAt: new Date('2024-01-25T11:30:00Z')
  }
]

const mockClients = [
  { id: '1', nom: 'Dubois', prenom: 'Martin', numeroClient: 'CLI-001' },
  { id: '2', nom: 'Lambert', prenom: 'Sophie', numeroClient: 'CLI-002' },
  { id: '3', nom: 'Moreau', prenom: 'Pierre', numeroClient: 'CLI-003' },
  { id: '4', nom: 'Petit', prenom: 'Marie', numeroClient: 'CLI-004' },
  { id: '5', nom: 'Durand', prenom: 'Jean', numeroClient: 'CLI-005' }
]

const mockVehicules = [
  { id: '1', immatriculation: 'AB-123-CD', marque: 'Peugeot', modele: '308', clientId: '1' },
  { id: '2', immatriculation: 'EF-456-GH', marque: 'Renault', modele: 'Clio', clientId: '2' },
  { id: '3', immatriculation: 'IJ-789-KL', marque: 'BMW', modele: 'X3', clientId: '3' },
  { id: '4', immatriculation: 'MN-012-OP', marque: 'Volkswagen', modele: 'Golf', clientId: '4' },
  { id: '5', immatriculation: 'QR-345-ST', marque: 'Audi', modele: 'A4', clientId: '5' }
]

const mockPrestations = [
  { id: '1', nom: 'Réparation pare-chocs', prixDeBase: 450, typeService: 'CARROSSERIE' as const },
  { id: '2', nom: 'Vidange moteur', prixDeBase: 85, typeService: 'MECANIQUE' as const },
  { id: '3', nom: 'Peinture complète', prixDeBase: 1200, typeService: 'CARROSSERIE' as const },
  { id: '4', nom: 'Changement freins', prixDeBase: 280, typeService: 'MECANIQUE' as const }
]

export default function DevisPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedDevis, setSelectedDevis] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'montant' | 'statut'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterStatut, setFilterStatut] = useState<'ALL' | 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE' | 'EXPIRE'>('ALL')
  const [filterService, setFilterService] = useState<'ALL' | 'CARROSSERIE' | 'MECANIQUE'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setIsInitialLoading(false)
    }
    loadData()
  }, [])

  const filteredDevis = mockDevis.filter(devis => {
    const matchesSearch =
      devis.numeroDevis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.vehicule.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatut = filterStatut === 'ALL' || devis.statut === filterStatut
    const matchesService = filterService === 'ALL' || devis.typeService === filterService

    return matchesSearch && matchesStatut && matchesService
  })

  // Sort devis
  const sortedDevis = [...filteredDevis].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'client':
        comparison = a.clientNom.localeCompare(b.clientNom)
        break
      case 'montant':
        comparison = a.totalTTC - b.totalTTC
        break
      case 'statut':
        comparison = a.statut.localeCompare(b.statut)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedDevis.length / itemsPerPage)
  const paginatedDevis = sortedDevis.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateDevis = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating devis:', data)
      setIsAddDialogOpen(false)
      toast.success('Devis créé avec succès', {
        description: `Le devis ${data.numeroDevis || 'DEV-2024-XXX'} a été créé.`
      })
    } catch (error) {
      toast.error('Erreur lors de la création du devis')
      console.error('Error creating devis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevis(paginatedDevis.map(devis => devis.id))
    } else {
      setSelectedDevis([])
    }
  }

  const handleSelectDevis = (devisId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevis(prev => [...prev, devisId])
    } else {
      setSelectedDevis(prev => prev.filter(id => id !== devisId))
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatut('ALL')
    setFilterService('ALL')
    setSortBy('date')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filterStatut !== 'ALL' || filterService !== 'ALL'

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ACCEPTE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REFUSE':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'EXPIRE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En Attente'
      case 'ACCEPTE':
        return 'Accepté'
      case 'REFUSE':
        return 'Refusé'
      case 'EXPIRE':
        return 'Expiré'
      default:
        return statut
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return <Clock className="h-3 w-3" />
      case 'ACCEPTE':
        return <CheckCircle className="h-3 w-3" />
      case 'REFUSE':
        return <X className="h-3 w-3" />
      case 'EXPIRE':
        return <Calendar className="h-3 w-3" />
      default:
        return null
    }
  }

  // Calculate stats
  const stats = {
    total: mockDevis.length,
    enAttente: mockDevis.filter(d => d.statut === 'EN_ATTENTE').length,
    acceptes: mockDevis.filter(d => d.statut === 'ACCEPTE').length,
    montantTotal: mockDevis.reduce((sum, devis) => sum + devis.totalTTC, 0)
  }

  // Pagination navigation
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement des devis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Gestion des Devis
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">{mockDevis.length} devis</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Créez et gérez vos devis pour carrosserie et mécanique
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                disabled={selectedDevis.length === 0}
              >
                <Download className="h-4 w-4" />
                Exporter {selectedDevis.length > 0 && `(${selectedDevis.length})`}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Devis
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau devis</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du devis
                    </DialogDescription>
                  </DialogHeader>
                  <DevisForm
                    onSubmit={handleCreateDevis}
                    onCancel={() => setIsAddDialogOpen(false)}
                    clients={mockClients}
                    vehicules={mockVehicules}
                    prestations={mockPrestations}
                    isLoading={isLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Devis</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <TrendingUp className="h-3 w-3" />
                    +5%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Devis créés</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">En Attente</CardTitle>
                  <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.enAttente}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    <Clock className="h-3 w-3" />
                    Actifs
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Devis en cours</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Acceptés</CardTitle>
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">{stats.acceptes}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Validés
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Devis confirmés</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Montant Total</CardTitle>
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <Euro className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0
                    }).format(stats.montantTotal)}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    +8%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Chiffre d'affaires</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Rechercher par numéro, client, véhicule..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10 h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
                      onClick={() => {
                        setSearchTerm('')
                        setCurrentPage(1)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={filterStatut} onValueChange={(value: any) => {
                    setFilterStatut(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                      <SelectItem value="ACCEPTE">Accepté</SelectItem>
                      <SelectItem value="REFUSE">Refusé</SelectItem>
                      <SelectItem value="EXPIRE">Expiré</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterService} onValueChange={(value: any) => {
                    setFilterService(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les services</SelectItem>
                      <SelectItem value="CARROSSERIE">Carrosserie</SelectItem>
                      <SelectItem value="MECANIQUE">Mécanique</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Plus récent</SelectItem>
                      <SelectItem value="date-asc">Plus ancien</SelectItem>
                      <SelectItem value="client-asc">Client (A-Z)</SelectItem>
                      <SelectItem value="client-desc">Client (Z-A)</SelectItem>
                      <SelectItem value="montant-desc">Montant ↓</SelectItem>
                      <SelectItem value="montant-asc">Montant ↑</SelectItem>
                      <SelectItem value="statut-asc">Statut</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="h-11 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Effacer
                    </Button>
                  )}
                </div>
              </div>

              {/* Results summary */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">{filteredDevis.length}</span> devis trouvé{filteredDevis.length > 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <span className="text-blue-600 ml-1">(filtré{filteredDevis.length > 1 ? 's' : ''})</span>
                  )}
                  {filteredDevis.length !== mockDevis.length && (
                    <span className="text-slate-400 ml-1">sur {mockDevis.length}</span>
                  )}
                </p>

                {selectedDevis.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm text-slate-600">
                      <span className="font-medium text-blue-600">{selectedDevis.length}</span> sélectionné{selectedDevis.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Send className="h-3 w-3 mr-1" />
                        Envoyer
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors">
                        <Download className="h-3 w-3 mr-1" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* No results state */}
          {filteredDevis.length === 0 && (
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {hasActiveFilters ? 'Aucun devis trouvé' : 'Aucun devis'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Aucun devis ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Vous n\'avez pas encore de devis. Commencez par créer votre premier devis.'
                  }
                </p>
                {hasActiveFilters ? (
                  <Button onClick={clearFilters} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Effacer les filtres
                  </Button>
                ) : (
                  <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un devis
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table */}
          {filteredDevis.length > 0 && (
            <Card className="border border-slate-200 bg-white hidden md:block shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Liste des Devis</h4>
                    <p className="text-sm text-slate-600 font-normal">Gérez vos devis et leur état</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-slate-50">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedDevis.length === paginatedDevis.length && paginatedDevis.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">N° Devis</TableHead>
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold">Véhicule</TableHead>
                        <TableHead className="font-semibold">Type Service</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Validité</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Montant TTC</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDevis.map((devis, index) => (
                        <TableRow
                          key={devis.id}
                          className={`hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            } ${selectedDevis.includes(devis.id) ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedDevis.includes(devis.id)}
                              onCheckedChange={(checked) => handleSelectDevis(devis.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono bg-slate-50 hover:bg-slate-100 transition-colors">
                              {devis.numeroDevis}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-full">
                                <User className="h-3 w-3 text-blue-600" />
                              </div>
                              <div className="font-medium text-slate-900">{devis.clientNom}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Car className="h-3 w-3 text-slate-400" />
                              <div className="text-sm text-slate-700">{devis.vehicule}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={devis.typeService === 'CARROSSERIE'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                : 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                              }
                            >
                              {devis.typeService === 'CARROSSERIE' ? (
                                <>
                                  <PaintBucket className="mr-1 h-3 w-3" />
                                  Carrosserie
                                </>
                              ) : (
                                <>
                                  <Wrench className="mr-1 h-3 w-3" />
                                  Mécanique
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Calendar className="h-3 w-3" />
                              {format(devis.date, 'dd/MM/yyyy', { locale: fr })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-slate-600">
                              {format(devis.dateValidite, 'dd/MM/yyyy', { locale: fr })}
                            </div>
                            {new Date(devis.dateValidite) < new Date() && devis.statut === 'EN_ATTENTE' && (
                              <div className="text-xs text-red-500 font-medium mt-1">Expire bientôt</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatutColor(devis.statut)} shadow-sm`}>
                              {getStatutIcon(devis.statut)}
                              <span className="ml-1">{getStatutLabel(devis.statut)}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-right">
                              <div className="font-semibold text-slate-900">
                                {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(devis.totalTTC)}
                              </div>
                              <div className="text-xs text-slate-500">
                                HT: {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(devis.totalHT)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 transition-colors">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir le devis
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Dupliquer
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                                  <Send className="mr-2 h-4 w-4" />
                                  Envoyer au client
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-green-50 hover:text-green-600">
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Enhanced Desktop Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-slate-600">
                        Affichage de <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> à{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredDevis.length)}</span> sur{' '}
                        <span className="font-medium">{filteredDevis.length}</span> devis
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className="hover:bg-slate-100 transition-colors"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="hover:bg-slate-100 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>

                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 p-0 ${currentPage === pageNum
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'hover:bg-slate-100'
                                } transition-colors`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="hover:bg-slate-100 transition-colors"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className="hover:bg-slate-100 transition-colors"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Mobile Card Layout */}
          {filteredDevis.length > 0 && (
            <div className="grid gap-4 md:hidden">
              {paginatedDevis.map((devis) => (
                <Card
                  key={devis.id}
                  className={`border border-slate-200 bg-white hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${selectedDevis.includes(devis.id) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <Checkbox
                            checked={selectedDevis.includes(devis.id)}
                            onCheckedChange={(checked) => handleSelectDevis(devis.id, checked as boolean)}
                            className="absolute -top-2 -right-2 bg-white shadow-md border-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge variant="outline" className="font-mono text-xs mb-1">
                            {devis.numeroDevis}
                          </Badge>
                          <h3 className="font-semibold text-slate-900">{devis.clientNom}</h3>
                          <p className="text-sm text-slate-600 truncate">{devis.vehicule}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatutColor(devis.statut)} shadow-sm`}>
                        {getStatutIcon(devis.statut)}
                        <span className="ml-1">{getStatutLabel(devis.statut)}</span>
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={devis.typeService === 'CARROSSERIE'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                          }
                        >
                          {devis.typeService === 'CARROSSERIE' ? (
                            <>
                              <PaintBucket className="mr-1 h-3 w-3" />
                              Carrosserie
                            </>
                          ) : (
                            <>
                              <Wrench className="mr-1 h-3 w-3" />
                              Mécanique
                            </>
                          )}
                        </Badge>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(devis.totalTTC)}
                          </div>
                          <div className="text-xs text-slate-500">
                            HT: {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(devis.totalHT)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Créé le {format(devis.date, 'dd/MM/yyyy', { locale: fr })}</span>
                        </div>
                        <div className="text-right">
                          <div>Valide jusqu'au</div>
                          <div className={new Date(devis.dateValidite) < new Date() && devis.statut === 'EN_ATTENTE' ? 'text-red-500 font-medium' : ''}>
                            {format(devis.dateValidite, 'dd/MM/yyyy', { locale: fr })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors">
                          <Send className="h-3 w-3 mr-1" />
                          Envoyer
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 hover:bg-slate-100 transition-colors">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                              <Copy className="mr-2 h-4 w-4" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-green-50 hover:text-green-600">
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Mobile Pagination */}
          {filteredDevis.length > 0 && totalPages > 1 && (
            <Card className="md:hidden border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">{filteredDevis.length}</span> devis
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="hover:bg-slate-100 transition-colors"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="hover:bg-slate-100 transition-colors flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="hover:bg-slate-100 transition-colors flex-1"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="hover:bg-slate-100 transition-colors"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}