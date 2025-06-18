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
  Car,
  Calendar,
  Gauge,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  X,
  User,
  TrendingUp,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Wrench,
  FileText
} from 'lucide-react'
import { VehiculeForm } from '@/components/forms/vehicule-form'
import { getVehicules, getClients, addVehicule, getVehiculeStats, type Vehicule, type Client } from '@/lib/mock-data'

export default function VehiculesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({ totalVehicules: 0, anneesMoyenne: 0, kilometrageMoyen: 0 })
  const [selectedVehicules, setSelectedVehicules] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'immatriculation' | 'marque' | 'annee' | 'kilometrage' | 'client'>('immatriculation')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterMarque, setFilterMarque] = useState<string>('ALL')
  const [filterAnnee, setFilterAnnee] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      await new Promise(resolve => setTimeout(resolve, 700))
      setVehicules(getVehicules())
      setClients(getClients())
      setStats(getVehiculeStats())
      setIsInitialLoading(false)
    }
    loadData()
  }, [])

  // Get unique marques for filter
  const uniqueMarques = [...new Set(vehicules.map(v => v.marque))].sort()

  // Get year ranges for filter
  const currentYear = new Date().getFullYear()
  const yearRanges = [
    { label: 'Moins de 5 ans', value: 'NEW', min: currentYear - 5 },
    { label: '5-10 ans', value: 'MEDIUM', min: currentYear - 10, max: currentYear - 5 },
    { label: 'Plus de 10 ans', value: 'OLD', max: currentYear - 10 }
  ]

  const filteredVehicules = vehicules.filter(vehicule => {
    const matchesSearch =
      vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(vehicule.clientId).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMarque = filterMarque === 'ALL' || vehicule.marque === filterMarque

    let matchesAnnee = true
    if (filterAnnee !== 'ALL') {
      const range = yearRanges.find(r => r.value === filterAnnee)
      if (range) {
        if (range.min && range.max) {
          matchesAnnee = vehicule.annee >= range.max && vehicule.annee < range.min
        } else if (range.min) {
          matchesAnnee = vehicule.annee >= range.min
        } else if (range.max) {
          matchesAnnee = vehicule.annee <= range.max
        }
      }
    }

    return matchesSearch && matchesMarque && matchesAnnee
  })

  // Sort vehicules
  const sortedVehicules = [...filteredVehicules].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'immatriculation':
        comparison = a.immatriculation.localeCompare(b.immatriculation)
        break
      case 'marque':
        comparison = `${a.marque} ${a.modele}`.localeCompare(`${b.marque} ${b.modele}`)
        break
      case 'annee':
        comparison = a.annee - b.annee
        break
      case 'kilometrage':
        const kmA = a.kilometrage || 0
        const kmB = b.kilometrage || 0
        comparison = kmA - kmB
        break
      case 'client':
        comparison = getClientName(a.clientId).localeCompare(getClientName(b.clientId))
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedVehicules.length / itemsPerPage)
  const paginatedVehicules = sortedVehicules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu'
  }

  const getVehiculeAge = (annee: number) => {
    const age = new Date().getFullYear() - annee
    if (age <= 3) return { label: 'Récent', color: 'bg-green-100 text-green-800 border-green-200' }
    if (age <= 8) return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    return { label: 'Ancien', color: 'bg-red-100 text-red-800 border-red-200' }
  }

  const getKilometrageStatus = (km: number | null) => {
    if (!km) return null
    if (km < 50000) return { label: 'Faible', color: 'bg-green-100 text-green-800' }
    if (km < 150000) return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Élevé', color: 'bg-red-100 text-red-800' }
  }

  const handleCreateVehicule = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newVehicule = addVehicule(data)
      setVehicules(getVehicules())
      setStats(getVehiculeStats())
      setIsAddDialogOpen(false)

      console.log('Vehicule created:', newVehicule)
    } catch (error) {
      console.error('Error creating vehicule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVehicules(paginatedVehicules.map(vehicule => vehicule.id))
    } else {
      setSelectedVehicules([])
    }
  }

  const handleSelectVehicule = (vehiculeId: string, checked: boolean) => {
    if (checked) {
      setSelectedVehicules(prev => [...prev, vehiculeId])
    } else {
      setSelectedVehicules(prev => prev.filter(id => id !== vehiculeId))
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterMarque('ALL')
    setFilterAnnee('ALL')
    setSortBy('immatriculation')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filterMarque !== 'ALL' || filterAnnee !== 'ALL'

  // Calculate additional stats
  const vehiculesRecents = vehicules.filter(v => new Date().getFullYear() - v.annee <= 3).length
  const moyenneKm = vehicules.filter(v => v.kilometrage).reduce((sum, v) => sum + (v.kilometrage || 0), 0) / vehicules.filter(v => v.kilometrage).length

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
          <p className="text-slate-600">Chargement des véhicules...</p>
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
                  Gestion des Véhicules
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">{vehicules.length} véhicules</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Gérez le parc de véhicules de vos clients
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                disabled={selectedVehicules.length === 0}
              >
                <Download className="h-4 w-4" />
                Exporter {selectedVehicules.length > 0 && `(${selectedVehicules.length})`}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Véhicule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du véhicule
                    </DialogDescription>
                  </DialogHeader>
                  <VehiculeForm
                    onSubmit={handleCreateVehicule}
                    onCancel={() => setIsAddDialogOpen(false)}
                    clients={clients}
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
                  <CardTitle className="text-sm font-medium text-slate-600">Total Véhicules</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.totalVehicules}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <TrendingUp className="h-3 w-3" />
                    +7%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Véhicules enregistrés</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Année Moyenne</CardTitle>
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.anneesMoyenne}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <Calendar className="h-3 w-3" />
                    Récent
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Âge moyen du parc</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Km Moyen</CardTitle>
                  <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Gauge className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {Math.round((moyenneKm || 0) / 1000)}k
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <Gauge className="h-3 w-3" />
                    Km
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Kilométrage moyen</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Véhicules Récents</CardTitle>
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{vehiculesRecents}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <CheckCircle className="h-3 w-3" />
                    &lt; 3 ans
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Véhicules récents</p>
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
                    placeholder="Rechercher par immatriculation, marque, modèle, propriétaire..."
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
                  <Select value={filterMarque} onValueChange={(value) => {
                    setFilterMarque(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Marque" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toutes les marques</SelectItem>
                      {uniqueMarques.map(marque => (
                        <SelectItem key={marque} value={marque}>{marque}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterAnnee} onValueChange={(value) => {
                    setFilterAnnee(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Âge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les âges</SelectItem>
                      {yearRanges.map(range => (
                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                      ))}
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
                      <SelectItem value="immatriculation-asc">Immatriculation (A-Z)</SelectItem>
                      <SelectItem value="immatriculation-desc">Immatriculation (Z-A)</SelectItem>
                      <SelectItem value="marque-asc">Marque (A-Z)</SelectItem>
                      <SelectItem value="marque-desc">Marque (Z-A)</SelectItem>
                      <SelectItem value="annee-desc">Plus récent</SelectItem>
                      <SelectItem value="annee-asc">Plus ancien</SelectItem>
                      <SelectItem value="kilometrage-asc">Moins de km</SelectItem>
                      <SelectItem value="kilometrage-desc">Plus de km</SelectItem>
                      <SelectItem value="client-asc">Propriétaire (A-Z)</SelectItem>
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
                  <span className="font-medium">{filteredVehicules.length}</span> véhicule{filteredVehicules.length > 1 ? 's' : ''} trouvé{filteredVehicules.length > 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <span className="text-blue-600 ml-1">(filtré{filteredVehicules.length > 1 ? 's' : ''})</span>
                  )}
                  {filteredVehicules.length !== vehicules.length && (
                    <span className="text-slate-400 ml-1">sur {vehicules.length}</span>
                  )}
                </p>

                {selectedVehicules.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm text-slate-600">
                      <span className="font-medium text-blue-600">{selectedVehicules.length}</span> sélectionné{selectedVehicules.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Wrench className="h-3 w-3 mr-1" />
                        Maintenance
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
          {filteredVehicules.length === 0 && (
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-12 text-center">
                <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {hasActiveFilters ? 'Aucun véhicule trouvé' : 'Aucun véhicule'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Aucun véhicule ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Vous n\'avez pas encore de véhicules enregistrés. Commencez par ajouter votre premier véhicule.'
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
                    Ajouter un véhicule
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table */}
          {filteredVehicules.length > 0 && (
            <Card className="border border-slate-200 bg-white hidden md:block shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Car className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Liste des Véhicules</h4>
                    <p className="text-sm text-slate-600 font-normal">Gérez le parc automobile de vos clients</p>
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
                            checked={selectedVehicules.length === paginatedVehicules.length && paginatedVehicules.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">Immatriculation</TableHead>
                        <TableHead className="font-semibold">Véhicule</TableHead>
                        <TableHead className="font-semibold">Année</TableHead>
                        <TableHead className="font-semibold">Kilométrage</TableHead>
                        <TableHead className="font-semibold">Propriétaire</TableHead>
                        <TableHead className="font-semibold">N° Série</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedVehicules.map((vehicule, index) => (
                        <TableRow
                          key={vehicule.id}
                          className={`hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            } ${selectedVehicules.includes(vehicule.id) ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedVehicules.includes(vehicule.id)}
                              onCheckedChange={(checked) => handleSelectVehicule(vehicule.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm">
                              {vehicule.immatriculation}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium text-slate-900">{vehicule.marque} {vehicule.modele}</div>
                                {vehicule.couleur && (
                                  <div className="text-xs text-slate-500">{vehicule.couleur}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={`shadow-sm ${getVehiculeAge(vehicule.annee).color}`}>
                                {vehicule.annee}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                ({new Date().getFullYear() - vehicule.annee} ans)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {vehicule.kilometrage ? (
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="font-medium text-slate-900">
                                    {vehicule.kilometrage.toLocaleString('fr-FR')} km
                                  </div>
                                  {getKilometrageStatus(vehicule.kilometrage) && (
                                    <Badge className={`text-xs ${getKilometrageStatus(vehicule.kilometrage)?.color}`}>
                                      {getKilometrageStatus(vehicule.kilometrage)?.label}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Non renseigné</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-slate-900">{getClientName(vehicule.clientId)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {vehicule.numeroSerie ? (
                              <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">
                                {vehicule.numeroSerie}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Non renseigné</span>
                            )}
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
                                  <Wrench className="mr-2 h-4 w-4" />
                                  Historique maintenance
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-green-50 hover:text-green-600">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Générer rapport
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
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredVehicules.length)}</span> sur{' '}
                        <span className="font-medium">{filteredVehicules.length}</span> véhicules
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
          {filteredVehicules.length > 0 && (
            <div className="grid gap-4 md:hidden">
              {paginatedVehicules.map((vehicule) => (
                <Card
                  key={vehicule.id}
                  className={`border border-slate-200 bg-white hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${selectedVehicules.includes(vehicule.id) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Car className="h-4 w-4 text-blue-600" />
                          </div>
                          <Checkbox
                            checked={selectedVehicules.includes(vehicule.id)}
                            onCheckedChange={(checked) => handleSelectVehicule(vehicule.id, checked as boolean)}
                            className="absolute -top-2 -right-2 bg-white shadow-md border-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge variant="outline" className="font-mono text-xs mb-1">
                            {vehicule.immatriculation}
                          </Badge>
                          <h3 className="font-semibold text-slate-900">{vehicule.marque} {vehicule.modele}</h3>
                          <p className="text-sm text-slate-600">{getClientName(vehicule.clientId)}</p>
                        </div>
                      </div>
                      <Badge className={`shadow-sm ${getVehiculeAge(vehicule.annee).color}`}>
                        {vehicule.annee}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {new Date().getFullYear() - vehicule.annee} ans
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-3 w-3 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {vehicule.kilometrage ? `${vehicule.kilometrage.toLocaleString('fr-FR')} km` : 'Non renseigné'}
                          </span>
                        </div>
                      </div>

                      {vehicule.kilometrage && getKilometrageStatus(vehicule.kilometrage) && (
                        <div className="flex justify-end">
                          <Badge className={`text-xs ${getKilometrageStatus(vehicule.kilometrage)?.color}`}>
                            Kilométrage {getKilometrageStatus(vehicule.kilometrage)?.label.toLowerCase()}
                          </Badge>
                        </div>
                      )}

                      {vehicule.numeroSerie && (
                        <div className="bg-slate-50 p-2 rounded text-xs">
                          <span className="text-slate-500">N° Série:</span>
                          <span className="font-mono ml-2 text-slate-700">{vehicule.numeroSerie}</span>
                        </div>
                      )}

                      {vehicule.couleur && (
                        <div className="text-xs text-slate-500">
                          Couleur: {vehicule.couleur}
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
                          <Wrench className="h-3 w-3 mr-1" />
                          Maintenance
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
                            <DropdownMenuItem className="hover:bg-green-50 hover:text-green-600">
                              <FileText className="mr-2 h-4 w-4" />
                              Générer rapport
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
          {filteredVehicules.length > 0 && totalPages > 1 && (
            <Card className="md:hidden border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">{filteredVehicules.length}</span> véhicules
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