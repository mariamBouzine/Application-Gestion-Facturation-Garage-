'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  PaintBucket,
  Package,
  Euro,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
  TrendingUp,
  Eye,
  Copy,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Settings,
  Star,
  Calendar,
  Building,
  Car,
  Receipt,
  DollarSign,
  BarChart3,
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { PrestationForm } from '@/components/forms/prestation-form'

// Mock data for prestations
const mockPrestations = [
  {
    id: '1',
    nom: 'Réparation pare-chocs avant',
    description: 'Réparation complète du pare-chocs avant avec peinture',
    typeService: 'CARROSSERIE' as const,
    prixDeBase: 450.00,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    dureeEstimee: 240, // en minutes
    popularite: 'ELEVEE' as const,
    actif: true
  },
  {
    id: '2',
    nom: 'Vidange moteur',
    description: 'Vidange complète avec changement du filtre à huile',
    typeService: 'MECANIQUE' as const,
    prixDeBase: 85.00,
    createdAt: new Date('2024-01-16T14:30:00Z'),
    dureeEstimee: 60,
    popularite: 'ELEVEE' as const,
    actif: true
  },
  {
    id: '3',
    nom: 'Peinture portière',
    description: 'Peinture complète d\'une portière avec apprêt',
    typeService: 'CARROSSERIE' as const,
    prixDeBase: 320.00,
    createdAt: new Date('2024-01-17T09:15:00Z'),
    dureeEstimee: 180,
    popularite: 'MOYENNE' as const,
    actif: true
  },
  {
    id: '4',
    nom: 'Changement plaquettes de frein',
    description: 'Remplacement des plaquettes de frein avant',
    typeService: 'MECANIQUE' as const,
    prixDeBase: 120.00,
    createdAt: new Date('2024-01-18T11:45:00Z'),
    dureeEstimee: 90,
    popularite: 'ELEVEE' as const,
    actif: true
  },
  {
    id: '5',
    nom: 'Diagnostic électronique',
    description: 'Diagnostic complet des systèmes électroniques du véhicule',
    typeService: 'MECANIQUE' as const,
    prixDeBase: 80.00,
    createdAt: new Date('2024-01-19T16:00:00Z'),
    dureeEstimee: 45,
    popularite: 'MOYENNE' as const,
    actif: false
  },
  {
    id: '6',
    nom: 'Réparation rétroviseur',
    description: 'Réparation ou remplacement de rétroviseur extérieur',
    typeService: 'CARROSSERIE' as const,
    prixDeBase: 150.00,
    createdAt: new Date('2024-01-20T11:30:00Z'),
    dureeEstimee: 60,
    popularite: 'FAIBLE' as const,
    actif: true
  }
]

// Mock data for forfaits
const mockForfaits = [
  {
    id: '1',
    nom: 'Forfait carrosserie Peugeot 308',
    marqueVehicule: 'Peugeot',
    modeleVehicule: '308',
    prix: 850.00,
    description: 'Forfait complet carrosserie pour Peugeot 308',
    prestationId: '1',
    createdAt: new Date('2024-01-19T13:20:00Z'),
    actif: true
  },
  {
    id: '2',
    nom: 'Forfait révision Renault Clio',
    marqueVehicule: 'Renault',
    modeleVehicule: 'Clio',
    prix: 180.00,
    description: 'Forfait révision complète pour Renault Clio',
    prestationId: '2',
    createdAt: new Date('2024-01-20T08:30:00Z'),
    actif: true
  },
  {
    id: '3',
    nom: 'Forfait entretien BMW X3',
    marqueVehicule: 'BMW',
    modeleVehicule: 'X3',
    prix: 280.00,
    description: 'Forfait entretien premium pour BMW X3',
    prestationId: '2',
    createdAt: new Date('2024-01-21T10:15:00Z'),
    actif: true
  }
]

export default function PrestationsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddPrestationDialogOpen, setIsAddPrestationDialogOpen] = useState(false)
  const [isAddForfaitDialogOpen, setIsAddForfaitDialogOpen] = useState(false)
  const [selectedPrestation, setSelectedPrestation] = useState<string | null>(null)
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('carrosserie')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'nom' | 'prix' | 'date' | 'popularite'>('nom')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIF' | 'INACTIF'>('ALL')
  const [filterPopularite, setFilterPopularite] = useState<'ALL' | 'ELEVEE' | 'MOYENNE' | 'FAIBLE'>('ALL')
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

  // Handle tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && (tab === 'carrosserie' || tab === 'mecanique')) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const prestationsCarrosserie = mockPrestations.filter(p => p.typeService === 'CARROSSERIE')
  const prestationsMecanique = mockPrestations.filter(p => p.typeService === 'MECANIQUE')

  const getFilteredPrestations = (prestations: typeof mockPrestations) => {
    return prestations.filter(prestation => {
      const matchesSearch =
        prestation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestation.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        filterStatus === 'ALL' ||
        (filterStatus === 'ACTIF' && prestation.actif) ||
        (filterStatus === 'INACTIF' && !prestation.actif)

      const matchesPopularite =
        filterPopularite === 'ALL' || prestation.popularite === filterPopularite

      return matchesSearch && matchesStatus && matchesPopularite
    })
  }

  const getSortedPrestations = (prestations: typeof mockPrestations) => {
    return [...prestations].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'nom':
          comparison = a.nom.localeCompare(b.nom)
          break
        case 'prix':
          comparison = a.prixDeBase - b.prixDeBase
          break
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case 'popularite':
          const populariteOrder = { 'ELEVEE': 3, 'MOYENNE': 2, 'FAIBLE': 1 }
          comparison = populariteOrder[a.popularite] - populariteOrder[b.popularite]
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  const filteredPrestationsCarrosserie = getSortedPrestations(getFilteredPrestations(prestationsCarrosserie))
  const filteredPrestationsMecanique = getSortedPrestations(getFilteredPrestations(prestationsMecanique))

  const getForfaitsForPrestation = (prestationId: string) => {
    return mockForfaits.filter(f => f.prestationId === prestationId && f.actif)
  }

  const handleCreatePrestation = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating prestation:', data)
      setIsAddPrestationDialogOpen(false)
    } catch (error) {
      console.error('Error creating prestation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (prestations: typeof mockPrestations, checked: boolean) => {
    if (checked) {
      setSelectedPrestations(prev => [...new Set([...prev, ...prestations.map(p => p.id)])])
    } else {
      setSelectedPrestations(prev => prev.filter(id => !prestations.some(p => p.id === id)))
    }
  }

  const handleSelectPrestation = (prestationId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrestations(prev => [...prev, prestationId])
    } else {
      setSelectedPrestations(prev => prev.filter(id => id !== prestationId))
    }
  }

  const getPopulariteBadge = (popularite: string) => {
    switch (popularite) {
      case 'ELEVEE':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Populaire</Badge>
      case 'MOYENNE':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Moyenne</Badge>
      case 'FAIBLE':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Rare</Badge>
      default:
        return <Badge variant="secondary">{popularite}</Badge>
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus('ALL')
    setFilterPopularite('ALL')
    setSortBy('nom')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filterStatus !== 'ALL' || filterPopularite !== 'ALL'

  // Calculate stats
  const totalPrestations = mockPrestations.length
  const totalForfaits = mockForfaits.length
  const prestationsActives = mockPrestations.filter(p => p.actif).length
  const prixMoyen = mockPrestations.reduce((sum, p) => sum + p.prixDeBase, 0) / totalPrestations

  const PrestationTable = ({
    prestations,
    typeService
  }: {
    prestations: typeof mockPrestations,
    typeService: 'CARROSSERIE' | 'MECANIQUE'
  }) => {
    // Pagination for current prestations
    const totalPages = Math.ceil(prestations.length / itemsPerPage)
    const paginatedPrestations = prestations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )

    const isAllSelected = prestations.length > 0 && prestations.every(p => selectedPrestations.includes(p.id))
    const isSomeSelected = prestations.some(p => selectedPrestations.includes(p.id))

    return (
      <div className="space-y-6">
        {/* Table */}
        <div className="hidden md:block">
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected
                      }}
                      onCheckedChange={(checked) => handleSelectAll(prestations, checked as boolean)}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Prestation</TableHead>
                  <TableHead className="font-semibold">Prix de Base</TableHead>
                  <TableHead className="font-semibold">Durée</TableHead>
                  <TableHead className="font-semibold">Popularité</TableHead>
                  <TableHead className="font-semibold">Forfaits</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPrestations.map((prestation, index) => {
                  const forfaits = getForfaitsForPrestation(prestation.id)
                  return (
                    <TableRow
                      key={prestation.id}
                      className={`hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                        } ${selectedPrestations.includes(prestation.id) ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedPrestations.includes(prestation.id)}
                          onCheckedChange={(checked) => handleSelectPrestation(prestation.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${typeService === 'CARROSSERIE' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                            {typeService === 'CARROSSERIE' ?
                              <PaintBucket className={`h-4 w-4 ${typeService === 'CARROSSERIE' ? 'text-orange-600' : 'text-blue-600'}`} /> :
                              <Wrench className="h-4 w-4 text-blue-600" />
                            }
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-900">{prestation.nom}</div>
                            <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {prestation.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-slate-900">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(prestation.prixDeBase)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            {formatDuration(prestation.dureeEstimee)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPopulariteBadge(prestation.popularite)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {forfaits.length} forfait{forfaits.length > 1 ? 's' : ''}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-blue-100 transition-colors"
                            onClick={() => {
                              setSelectedPrestation(prestation.id)
                              setIsAddForfaitDialogOpen(true)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {prestation.actif ? (
                            <>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Actif</Badge>
                            </>
                          ) : (
                            <>
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactif</Badge>
                            </>
                          )}
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
                              <Copy className="mr-2 h-4 w-4" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-green-50 hover:text-green-600"
                              onClick={() => {
                                setSelectedPrestation(prestation.id)
                                setIsAddForfaitDialogOpen(true)
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Ajouter forfait
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
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Desktop Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-600">
                  Affichage de <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, prestations.length)}</span> sur{' '}
                  <span className="font-medium">{prestations.length}</span> prestations
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="hover:bg-slate-100 transition-colors"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="hover:bg-slate-100 transition-colors"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hover:bg-slate-100 transition-colors"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Card Layout */}
        <div className="grid gap-4 md:hidden">
          {paginatedPrestations.map((prestation) => {
            const forfaits = getForfaitsForPrestation(prestation.id)
            return (
              <Card
                key={prestation.id}
                className={`border border-slate-200 bg-white hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${selectedPrestations.includes(prestation.id) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
                  }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <div className={`p-2 rounded-lg ${typeService === 'CARROSSERIE' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                          {typeService === 'CARROSSERIE' ?
                            <PaintBucket className="h-4 w-4 text-orange-600" /> :
                            <Wrench className="h-4 w-4 text-blue-600" />
                          }
                        </div>
                        <Checkbox
                          checked={selectedPrestations.includes(prestation.id)}
                          onCheckedChange={(checked) => handleSelectPrestation(prestation.id, checked as boolean)}
                          className="absolute -top-2 -right-2 bg-white shadow-md border-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900">{prestation.nom}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{prestation.description}</p>
                      </div>
                    </div>
                    {prestation.actif ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Actif</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactif</Badge>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(prestation.prixDeBase)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {formatDuration(prestation.dureeEstimee)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPopulariteBadge(prestation.popularite)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-slate-400" />
                        <Badge variant="outline" className="text-xs">
                          {forfaits.length} forfait{forfaits.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
                        onClick={() => {
                          setSelectedPrestation(prestation.id)
                          setIsAddForfaitDialogOpen(true)
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Forfait
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
                          <DropdownMenuItem className="hover:bg-purple-50 hover:text-purple-600">
                            <Copy className="mr-2 h-4 w-4" />
                            Dupliquer
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
            )
          })}
        </div>

        {/* Forfaits Section */}
        {prestations.some(p => getForfaitsForPrestation(p.id).length > 0) && (
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Receipt className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Forfaits Associés</h4>
                  <p className="text-sm text-slate-600 font-normal">Tarifs spécifiques par véhicule</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-50">
                      <TableHead className="font-semibold">Forfait</TableHead>
                      <TableHead className="font-semibold">Véhicule</TableHead>
                      <TableHead className="font-semibold">Prix</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prestations.map(prestation =>
                      getForfaitsForPrestation(prestation.id).map((forfait, index) => (
                        <TableRow
                          key={forfait.id}
                          className={`hover:bg-purple-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            }`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Car className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{forfait.nom}</div>
                                <div className="text-xs text-slate-500">
                                  Pour: {prestation.nom}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              
                              <Badge variant="secondary" className="font-mono">
                                {forfait.marqueVehicule} {forfait.modeleVehicule}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              
                              <div className="font-semibold text-slate-900">
                                {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(forfait.prix)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-slate-600 max-w-xs line-clamp-2">
                              {forfait.description}
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
                                  <Copy className="mr-2 h-4 w-4" />
                                  Dupliquer
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement du catalogue...</p>
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
                  Catalogue des Prestations
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-purple-700">{totalPrestations} prestations</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Gérez vos prestations et forfaits par activité
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                disabled={selectedPrestations.length === 0}
              >
                <Download className="h-4 w-4" />
                Exporter {selectedPrestations.length > 0 && `(${selectedPrestations.length})`}
              </Button>
              <Dialog open={isAddPrestationDialogOpen} onOpenChange={setIsAddPrestationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Prestation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle prestation</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations de la prestation
                    </DialogDescription>
                  </DialogHeader>
                  <PrestationForm
                    onSubmit={handleCreatePrestation}
                    onCancel={() => setIsAddPrestationDialogOpen(false)}
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
                  <CardTitle className="text-sm font-medium text-slate-600">Total Prestations</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{totalPrestations}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <TrendingUp className="h-3 w-3" />
                    +8%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Services disponibles</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Carrosserie</CardTitle>
                  <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <PaintBucket className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{prestationsCarrosserie.length}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    <PaintBucket className="h-3 w-3" />
                    Actifs
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Services carrosserie</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Mécanique</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Wrench className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{prestationsMecanique.length}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <Wrench className="h-3 w-3" />
                    Actifs
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Services mécaniques</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Prix Moyen</CardTitle>
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
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
                    }).format(prixMoyen)}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <DollarSign className="h-3 w-3" />
                    Moy.
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {totalForfaits} forfaits disponibles
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
                    placeholder="Rechercher par nom ou description..."
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
                  <Select value={filterStatus} onValueChange={(value) => {
                    setFilterStatus(value as any)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[140px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="ACTIF">Actifs</SelectItem>
                      <SelectItem value="INACTIF">Inactifs</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPopularite} onValueChange={(value) => {
                    setFilterPopularite(value as any)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[160px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Popularité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toutes popularités</SelectItem>
                      <SelectItem value="ELEVEE">Élevée</SelectItem>
                      <SelectItem value="MOYENNE">Moyenne</SelectItem>
                      <SelectItem value="FAIBLE">Faible</SelectItem>
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
                      <SelectItem value="nom-asc">Nom (A-Z)</SelectItem>
                      <SelectItem value="nom-desc">Nom (Z-A)</SelectItem>
                      <SelectItem value="prix-asc">Prix croissant</SelectItem>
                      <SelectItem value="prix-desc">Prix décroissant</SelectItem>
                      <SelectItem value="popularite-desc">Plus populaire</SelectItem>
                      <SelectItem value="date-desc">Plus récent</SelectItem>
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
                  <span className="font-medium">{prestationsActives}</span> prestations actives
                  {hasActiveFilters && (
                    <span className="text-blue-600 ml-1">(filtré{prestationsActives > 1 ? 's' : ''})</span>
                  )}
                </p>

                {selectedPrestations.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm text-slate-600">
                      <span className="font-medium text-blue-600">{selectedPrestations.length}</span> sélectionné{selectedPrestations.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors">
                        <Copy className="h-3 w-3 mr-1" />
                        Dupliquer
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

          {/* Tabs for Activities */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="carrosserie" className="flex items-center gap-2">
                <PaintBucket className="h-4 w-4" />
                <span>Carrosserie</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filteredPrestationsCarrosserie.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="mecanique" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                <span>Mécanique</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filteredPrestationsMecanique.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carrosserie">
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <PaintBucket className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Prestations Carrosserie</h4>
                      <p className="text-sm text-slate-600 font-normal">Services de réparation et peinture</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredPrestationsCarrosserie.length > 0 ? (
                    <PrestationTable prestations={filteredPrestationsCarrosserie} typeService="CARROSSERIE" />
                  ) : (
                    <div className="text-center py-12">
                      <PaintBucket className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {hasActiveFilters ? 'Aucune prestation trouvée' : 'Aucune prestation carrosserie'}
                      </h3>
                      <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        {hasActiveFilters
                          ? 'Aucune prestation carrosserie ne correspond à vos critères de recherche.'
                          : 'Commencez par ajouter vos premières prestations de carrosserie.'
                        }
                      </p>
                      {hasActiveFilters ? (
                        <Button onClick={clearFilters} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      ) : (
                        <Button onClick={() => setIsAddPrestationDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une prestation
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mecanique">
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Prestations Mécanique</h4>
                      <p className="text-sm text-slate-600 font-normal">Services d'entretien et réparation mécanique</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredPrestationsMecanique.length > 0 ? (
                    <PrestationTable prestations={filteredPrestationsMecanique} typeService="MECANIQUE" />
                  ) : (
                    <div className="text-center py-12">
                      <Wrench className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {hasActiveFilters ? 'Aucune prestation trouvée' : 'Aucune prestation mécanique'}
                      </h3>
                      <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        {hasActiveFilters
                          ? 'Aucune prestation mécanique ne correspond à vos critères de recherche.'
                          : 'Commencez par ajouter vos premières prestations mécaniques.'
                        }
                      </p>
                      {hasActiveFilters ? (
                        <Button onClick={clearFilters} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      ) : (
                        <Button onClick={() => setIsAddPrestationDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une prestation
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Add Forfait Dialog */}
          <Dialog open={isAddForfaitDialogOpen} onOpenChange={setIsAddForfaitDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau forfait</DialogTitle>
                <DialogDescription>
                  Créez un forfait pour une prestation spécifique
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 text-center text-slate-600">
                <Receipt className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="mb-2">Formulaire d'ajout de forfait à implémenter</p>
                {selectedPrestation && (
                  <p className="text-sm text-blue-600 font-medium">
                    Pour la prestation: {mockPrestations.find(p => p.id === selectedPrestation)?.nom}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}