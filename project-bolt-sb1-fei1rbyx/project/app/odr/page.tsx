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
  Wrench,
  Calendar,
  Euro,
  FileText,
  PaintBucket,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  X,
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Car,
  Receipt,
  Building,
  Settings,
  DollarSign
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ODRForm } from '@/components/forms/odr-form'

// Mock data
const mockODR = [
  {
    id: '1',
    numeroODR: 'ODR-2024-001',
    date: new Date('2024-01-15T00:00:00Z'),
    dateValidite: new Date('2024-02-15T00:00:00Z'),
    clientNom: 'Martin Dubois',
    numeroClient: 'CLI-001',
    immatriculationVehicule: 'AB-123-CD',
    statut: 'EN_COURS',
    typeService: 'CARROSSERIE',
    montantTotal: 1250.80,
    observations: 'Réparation suite à accident - Pare-choc avant et phare gauche'
  },
  {
    id: '2',
    numeroODR: 'ODR-2024-002',
    date: new Date('2024-01-16T00:00:00Z'),
    dateValidite: new Date('2024-02-16T00:00:00Z'),
    clientNom: 'Sophie Lambert',
    numeroClient: 'CLI-002',
    immatriculationVehicule: 'EF-456-GH',
    statut: 'TERMINE',
    typeService: 'MECANIQUE',
    montantTotal: 450.00,
    observations: 'Révision complète + changement plaquettes de frein'
  },
  {
    id: '3',
    numeroODR: 'ODR-2024-003',
    date: new Date('2024-01-17T00:00:00Z'),
    dateValidite: new Date('2024-02-17T00:00:00Z'),
    clientNom: 'Pierre Martin',
    numeroClient: 'CLI-003',
    immatriculationVehicule: 'IJ-789-KL',
    statut: 'EN_COURS',
    typeService: 'MECANIQUE',
    montantTotal: 850.50,
    observations: 'Diagnostic moteur - Problème de démarrage'
  },
  {
    id: '4',
    numeroODR: 'ODR-2024-004',
    date: new Date('2024-01-18T00:00:00Z'),
    dateValidite: new Date('2024-02-18T00:00:00Z'),
    clientNom: 'Anne Rousseau',
    numeroClient: 'CLI-004',
    immatriculationVehicule: 'MN-012-OP',
    statut: 'TERMINE',
    typeService: 'CARROSSERIE',
    montantTotal: 2100.00,
    observations: 'Peinture complète véhicule'
  },
  {
    id: '5',
    numeroODR: 'ODR-2024-005',
    date: new Date('2024-01-19T00:00:00Z'),
    dateValidite: new Date('2024-02-19T00:00:00Z'),
    clientNom: 'Thomas Durand',
    numeroClient: 'CLI-005',
    immatriculationVehicule: 'QR-345-ST',
    statut: 'ANNULE',
    typeService: 'MECANIQUE',
    montantTotal: 320.00,
    observations: 'Vidange - Annulé par le client'
  }
]

const mockClients = [
  { id: '1', nom: 'Dubois', prenom: 'Martin', numeroClient: 'CLI-001' },
  { id: '2', nom: 'Lambert', prenom: 'Sophie', numeroClient: 'CLI-002' },
  { id: '3', nom: 'Martin', prenom: 'Pierre', numeroClient: 'CLI-003' },
  { id: '4', nom: 'Rousseau', prenom: 'Anne', numeroClient: 'CLI-004' },
  { id: '5', nom: 'Durand', prenom: 'Thomas', numeroClient: 'CLI-005' }
]

const mockVehicules = [
  { id: '1', immatriculation: 'AB-123-CD', marque: 'Peugeot', modele: '308', clientId: '1' },
  { id: '2', immatriculation: 'EF-456-GH', marque: 'Renault', modele: 'Clio', clientId: '2' },
  { id: '3', immatriculation: 'IJ-789-KL', marque: 'Citroën', modele: 'C3', clientId: '3' },
  { id: '4', immatriculation: 'MN-012-OP', marque: 'BMW', modele: 'X3', clientId: '4' },
  { id: '5', immatriculation: 'QR-345-ST', marque: 'Audi', modele: 'A4', clientId: '5' }
]

const mockPrestations = [
  { id: '1', nom: 'Réparation pare-chocs', prixDeBase: 450, typeService: 'CARROSSERIE' as const },
  { id: '2', nom: 'Vidange moteur', prixDeBase: 85, typeService: 'MECANIQUE' as const },
  { id: '3', nom: 'Diagnostic moteur', prixDeBase: 120, typeService: 'MECANIQUE' as const }
]

export default function ODRPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedODR, setSelectedODR] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'montant' | 'statut' | 'numero'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterStatut, setFilterStatut] = useState<string>('ALL')
  const [filterService, setFilterService] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      await new Promise(resolve => setTimeout(resolve, 700))
      setIsInitialLoading(false)
    }
    loadData()
  }, [])

  const filteredODR = mockODR.filter(odr => {
    const matchesSearch =
      odr.numeroODR.toLowerCase().includes(searchTerm.toLowerCase()) ||
      odr.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      odr.immatriculationVehicule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      odr.numeroClient.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatut = filterStatut === 'ALL' || odr.statut === filterStatut
    const matchesService = filterService === 'ALL' || odr.typeService === filterService

    return matchesSearch && matchesStatut && matchesService
  })

  // Sort ODR
  const sortedODR = [...filteredODR].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = a.date.getTime() - b.date.getTime()
        break
      case 'client':
        comparison = a.clientNom.localeCompare(b.clientNom)
        break
      case 'montant':
        comparison = a.montantTotal - b.montantTotal
        break
      case 'statut':
        comparison = a.statut.localeCompare(b.statut)
        break
      case 'numero':
        comparison = a.numeroODR.localeCompare(b.numeroODR)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedODR.length / itemsPerPage)
  const paginatedODR = sortedODR.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateODR = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating ODR:', data)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error creating ODR:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedODR(paginatedODR.map(odr => odr.id))
    } else {
      setSelectedODR([])
    }
  }

  const handleSelectODR = (odrId: string, checked: boolean) => {
    if (checked) {
      setSelectedODR(prev => [...prev, odrId])
    } else {
      setSelectedODR(prev => prev.filter(id => id !== odrId))
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">En Cours</Badge>
      case 'TERMINE':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Terminé</Badge>
      case 'ANNULE':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Annulé</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getServiceIcon = (typeService: string) => {
    return typeService === 'CARROSSERIE' ?
      <PaintBucket className="h-4 w-4" /> :
      <Wrench className="h-4 w-4" />
  }

  const getServiceBadge = (typeService: string) => {
    return typeService === 'CARROSSERIE' ?
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
        <PaintBucket className="mr-1 h-3 w-3" />
        Carrosserie
      </Badge> :
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
        <Wrench className="mr-1 h-3 w-3" />
        Mécanique
      </Badge>
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

  // Calculate stats
  const totalODR = mockODR.length
  const odrEnCours = mockODR.filter(o => o.statut === 'EN_COURS').length
  const odrTermines = mockODR.filter(o => o.statut === 'TERMINE').length
  const montantTotal = mockODR.reduce((sum, odr) => sum + odr.montantTotal, 0)
  const montantMoyen = montantTotal / totalODR

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
          <p className="text-slate-600">Chargement des ODR...</p>
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
                  Ordres de Réparation
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">{totalODR} ODR</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Gérez les ordres de réparation de votre garage
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                disabled={selectedODR.length === 0}
              >
                <Download className="h-4 w-4" />
                Exporter {selectedODR.length > 0 && `(${selectedODR.length})`}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvel ODR
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer un nouvel ordre de réparation</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations de l'ODR
                    </DialogDescription>
                  </DialogHeader>
                  <ODRForm
                    onSubmit={handleCreateODR}
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
                  <CardTitle className="text-sm font-medium text-slate-600">Total ODR</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{totalODR}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <TrendingUp className="h-3 w-3" />
                    +12%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Ordres ce mois</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">En Cours</CardTitle>
                  <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{odrEnCours}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <Clock className="h-3 w-3" />
                    Actifs
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">En cours de traitement</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Terminés</CardTitle>
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{odrTermines}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Finis
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Travaux terminés</p>
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
                      maximumFractionDigits: 0
                    }).format(montantTotal)}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <DollarSign className="h-3 w-3" />
                    CA
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Moyenne: {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(montantMoyen)}
                </p>
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
                    placeholder="Rechercher par N° ODR, client, véhicule..."
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
                  <Select value={filterStatut} onValueChange={(value) => {
                    setFilterStatut(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[140px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="EN_COURS">En cours</SelectItem>
                      <SelectItem value="TERMINE">Terminé</SelectItem>
                      <SelectItem value="ANNULE">Annulé</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterService} onValueChange={(value) => {
                    setFilterService(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les services</SelectItem>
                      <SelectItem value="MECANIQUE">Mécanique</SelectItem>
                      <SelectItem value="CARROSSERIE">Carrosserie</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Plus récent</SelectItem>
                      <SelectItem value="date-asc">Plus ancien</SelectItem>
                      <SelectItem value="client-asc">Client (A-Z)</SelectItem>
                      <SelectItem value="client-desc">Client (Z-A)</SelectItem>
                      <SelectItem value="montant-desc">Montant décroissant</SelectItem>
                      <SelectItem value="montant-asc">Montant croissant</SelectItem>
                      <SelectItem value="numero-asc">N° ODR (A-Z)</SelectItem>
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
                  <span className="font-medium">{filteredODR.length}</span> ODR trouvé{filteredODR.length > 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <span className="text-blue-600 ml-1">(filtré{filteredODR.length > 1 ? 's' : ''})</span>
                  )}
                  {filteredODR.length !== mockODR.length && (
                    <span className="text-slate-400 ml-1">sur {mockODR.length}</span>
                  )}
                </p>

                {selectedODR.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm text-slate-600">
                      <span className="font-medium text-blue-600">{selectedODR.length}</span> sélectionné{selectedODR.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Receipt className="h-3 w-3 mr-1" />
                        Facturer
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
          {filteredODR.length === 0 && (
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {hasActiveFilters ? 'Aucun ODR trouvé' : 'Aucun ODR'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Aucun ordre de réparation ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Vous n\'avez pas encore d\'ordres de réparation. Commencez par créer votre premier ODR.'
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
                    Créer un ODR
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table */}
          {filteredODR.length > 0 && (
            <Card className="border border-slate-200 bg-white hidden md:block shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Liste des Ordres de Réparation</h4>
                    <p className="text-sm text-slate-600 font-normal">Gérez les ODR de votre garage</p>
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
                            checked={selectedODR.length === paginatedODR.length && paginatedODR.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">N° ODR</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold">Véhicule</TableHead>
                        <TableHead className="font-semibold">Service</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Montant</TableHead>
                        <TableHead className="font-semibold">Observations</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedODR.map((odr, index) => (
                        <TableRow
                          key={odr.id}
                          className={`hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            } ${selectedODR.includes(odr.id) ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedODR.includes(odr.id)}
                              onCheckedChange={(checked) => handleSelectODR(odr.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm">
                              {odr.numeroODR}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                            
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {format(odr.date, 'dd/MM/yyyy', { locale: fr })}
                                </div>
                                {odr.dateValidite && (
                                  <div className="text-xs text-slate-500">
                                    Validité: {format(odr.dateValidite, 'dd/MM/yyyy', { locale: fr })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium text-slate-900">{odr.clientNom}</div>
                                <div className="text-sm text-slate-500">{odr.numeroClient}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                            
                              <Badge variant="outline" className="font-mono">
                                {odr.immatriculationVehicule}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getServiceBadge(odr.typeService)}
                          </TableCell>
                          <TableCell>
                            {getStatutBadge(odr.statut)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-slate-900">
                                {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(odr.montantTotal)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="text-sm text-slate-600 truncate" title={odr.observations}>
                              {odr.observations}
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
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-purple-50 hover:text-purple-600">
                                  <Receipt className="mr-2 h-4 w-4" />
                                  Générer facture
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-green-50 hover:text-green-600">
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger PDF
                                </DropdownMenuItem>
                                {odr.statut === 'EN_COURS' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="hover:bg-green-50 hover:text-green-600">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Marquer terminé
                                    </DropdownMenuItem>
                                  </>
                                )}
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
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredODR.length)}</span> sur{' '}
                        <span className="font-medium">{filteredODR.length}</span> ODR
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
          {filteredODR.length > 0 && (
            <div className="grid gap-4 md:hidden">
              {paginatedODR.map((odr) => (
                <Card
                  key={odr.id}
                  className={`border border-slate-200 bg-white hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${selectedODR.includes(odr.id) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
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
                            checked={selectedODR.includes(odr.id)}
                            onCheckedChange={(checked) => handleSelectODR(odr.id, checked as boolean)}
                            className="absolute -top-2 -right-2 bg-white shadow-md border-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge variant="outline" className="font-mono text-xs mb-1">
                            {odr.numeroODR}
                          </Badge>
                          <h3 className="font-semibold text-slate-900">{odr.clientNom}</h3>
                          <p className="text-sm text-slate-600">{odr.numeroClient}</p>
                        </div>
                      </div>
                      {getStatutBadge(odr.statut)}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {format(odr.date, 'dd/MM/yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-3 w-3 text-slate-400" />
                          <Badge variant="outline" className="font-mono text-xs">
                            {odr.immatriculationVehicule}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getServiceBadge(odr.typeService)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="h-3 w-3 text-slate-400" />
                          <span className="font-semibold text-slate-900">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(odr.montantTotal)}
                          </span>
                        </div>
                      </div>

                      {odr.dateValidite && (
                        <div className="bg-slate-50 p-2 rounded text-xs">
                          <span className="text-slate-500">Validité:</span>
                          <span className="ml-2 text-slate-700">
                            {format(odr.dateValidite, 'dd/MM/yyyy', { locale: fr })}
                          </span>
                        </div>
                      )}

                      {odr.observations && (
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-slate-600 line-clamp-2">{odr.observations}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors">
                          <Receipt className="h-3 w-3 mr-1" />
                          Facturer
                        </Button>
                        {odr.statut === 'EN_COURS' && (
                          <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Terminer
                          </Button>
                        )}
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
          {filteredODR.length > 0 && totalPages > 1 && (
            <Card className="md:hidden border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">{filteredODR.length}</span> ODR
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