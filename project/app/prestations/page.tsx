'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
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
  AlertTriangle,
  FileText,
  Check,
  ChevronsUpDown,
  Clock
} from 'lucide-react'
import { PrestationForm } from '@/components/forms/prestation-form'
import { PrestationDeleteConfirmationDialog } from '@/components/dialogs/prestation-delete-confirmation-dialog'
import { ForfaitDeleteConfirmationDialog } from '@/components/dialogs/forfait-delete-confirmation-dialog'

interface ForfaitFormData {
  nom: string
  description: string
  marqueVehicule: string
  modeleVehicule: string
  prestationId: string
  prixDeBase: number
  unite: 'prestation' | 'heure' | 'jour' | 'autre'
  uniteAutre?: string
  tva: number
}

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
    prixDeBase: 750.00,
    tva: 20,
    unite: 'prestation',
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
    prixDeBase: 150.00,
    tva: 20,
    unite: 'prestation',
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
    prixDeBase: 230.00,
    tva: 20,
    unite: 'prestation',
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
  const [prestationSearchOpen, setPrestationSearchOpen] = useState(false)
  const [prestationSearchValue, setPrestationSearchValue] = useState('')
  const [forfaitFormData, setForfaitFormData] = useState<ForfaitFormData>({
    nom: '',
    description: '',
    marqueVehicule: '',
    modeleVehicule: '',
    prestationId: selectedPrestation || '',
    prixDeBase: 0,
    unite: 'prestation',
    uniteAutre: '',
    tva: 20
  })
  const [forfaitErrors, setForfaitErrors] = useState<Partial<Record<keyof ForfaitFormData, string>>>({})
  const [marqueSearchOpen, setMarqueSearchOpen] = useState(false)
  const [marqueSearchValue, setMarqueSearchValue] = useState('')
  const [modeleSearchOpen, setModeleSearchOpen] = useState(false)
  const [modeleSearchValue, setModeleSearchValue] = useState('')
  const [mockMarques, setMockMarques] = useState([
    'Toyota', 'Renault', 'Peugeot', 'Citroën', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Ford', 'Opel'
  ])
  const [mockModeles, setMockModeles] = useState<Record<string, string[]>>({
    'Toyota': ['Corolla', 'Yaris', 'Auris', 'RAV4', 'Prius', 'Camry'],
    'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Twingo', 'Scenic'],
    'Peugeot': ['208', '308', '508', '2008', '3008', '5008'],
    'Citroën': ['C3', 'C4', 'C5', 'C3 Aircross', 'Berlingo', 'Spacetourer'],
    'BMW': ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5'],
    'Mercedes': ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC', 'GLE'],
    'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touran', 'Arteon'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'EcoSport', 'Edge'],
    'Opel': ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland', 'Mokka']
  })
  const [isEditPrestationDialogOpen, setIsEditPrestationDialogOpen] = useState(false)
  const [editingPrestation, setEditingPrestation] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [prestationToDelete, setPrestationToDelete] = useState<any>(null)
  const [isEditForfaitDialogOpen, setIsEditForfaitDialogOpen] = useState(false)
  const [editingForfait, setEditingForfait] = useState<any>(null)
  const [isForfaitDeleteDialogOpen, setIsForfaitDeleteDialogOpen] = useState(false)
  const [forfaitToDelete, setForfaitToDelete] = useState<any>(null)

  // Add this helper function
  const getModelesForMarque = (marque: string): string[] => {
    return mockModeles[marque] || []
  }

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

  useEffect(() => {
    if (selectedPrestation) {
      setForfaitFormData(prev => ({
        ...prev,
        prestationId: selectedPrestation,
        marqueVehicule: '', // Clear marque when prestation changes
        modeleVehicule: '' // Clear modele when prestation changes
      }))
      const prestation = mockPrestations.find(p => p.id === selectedPrestation)
      if (prestation) {
        setForfaitFormData(prev => ({
          ...prev,
          nom: `${prestation.nom}`,
          description: prestation.description
        }))
      }
    }
  }, [selectedPrestation])

  // Add new useEffect to clear modele when marque changes
  useEffect(() => {
    if (forfaitFormData.marqueVehicule) {
      setForfaitFormData(prev => ({ ...prev, modeleVehicule: '' }))
    }
  }, [forfaitFormData.marqueVehicule])

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

  const handleEditPrestation = (prestationId: string) => {
    setEditingPrestation(prestationId)
    setIsEditPrestationDialogOpen(true)
  }

  const handleUpdatePrestation = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updating prestation:', editingPrestation, data)
      setIsEditPrestationDialogOpen(false)
      setEditingPrestation(null)
    } catch (error) {
      console.error('Error updating prestation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handler functions for forfait actions
  const handleEditForfait = (forfait: any) => {
    setEditingForfait(forfait)
    setForfaitFormData({
      nom: forfait.nom,
      description: forfait.description,
      marqueVehicule: forfait.marqueVehicule,
      modeleVehicule: forfait.modeleVehicule,
      prestationId: forfait.prestationId,
      prixDeBase: forfait.prixDeBase,
      unite: forfait.unite,
      uniteAutre: forfait.uniteAutre || '',
      tva: forfait.tva
    })
    setIsEditForfaitDialogOpen(true)
  }

  const handleUpdateForfait = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForfaitForm()) {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Updating forfait:', editingForfait.id, forfaitFormData)
        setIsEditForfaitDialogOpen(false)
        setEditingForfait(null)
        // Reset form
        setForfaitFormData({
          nom: '',
          description: '',
          marqueVehicule: '',
          modeleVehicule: '',
          prestationId: '',
          prixDeBase: 0,
          unite: 'prestation',
          uniteAutre: '',
          tva: 20
        })
      } catch (error) {
        console.error('Error updating forfait:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteForfait = (forfait: any) => {
    setForfaitToDelete(forfait)
    setIsForfaitDeleteDialogOpen(true)
  }

  const handleConfirmForfaitDelete = async (forfaitId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Deleting forfait:', forfaitId)
      setIsForfaitDeleteDialogOpen(false)
      setForfaitToDelete(null)
    } catch (error) {
      console.error('Error deleting forfait:', error)
    } finally {
      setIsLoading(false)
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

  const validateForfaitForm = (): boolean => {
    const newErrors: Partial<Record<keyof ForfaitFormData, string>> = {}

    if (!forfaitFormData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!forfaitFormData.description.trim()) newErrors.description = 'La description est requise'
    if (!forfaitFormData.marqueVehicule.trim()) newErrors.marqueVehicule = 'La marque est requise'
    if (!forfaitFormData.modeleVehicule.trim()) newErrors.modeleVehicule = 'Le modèle est requis'
    if (!forfaitFormData.prestationId) newErrors.prestationId = 'La prestation est requise'
    if (forfaitFormData.prixDeBase <= 0) newErrors.prixDeBase = 'Le prix doit être supérieur à 0'
    if (forfaitFormData.unite === 'autre' && !forfaitFormData.uniteAutre?.trim()) {
      newErrors.uniteAutre = 'Précisez l\'unité'
    }

    setForfaitErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleForfaitInputChange = (field: keyof ForfaitFormData, value: string | number) => {
    setForfaitFormData(prev => ({ ...prev, [field]: value }))
    if (forfaitErrors[field]) {
      setForfaitErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCreateForfait = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForfaitForm()) {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Creating forfait:', forfaitFormData)
        setIsAddForfaitDialogOpen(false)
        // Reset form
        setForfaitFormData({
          nom: '',
          description: '',
          marqueVehicule: '',
          modeleVehicule: '',
          prestationId: '',
          prixDeBase: 0,
          unite: 'prestation',
          uniteAutre: '',
          tva: 20
        })
      } catch (error) {
        console.error('Error creating forfait:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeletePrestation = (prestation: any) => {
    setPrestationToDelete(prestation)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async (prestationId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Deleting prestation:', prestationId)
      setIsDeleteDialogOpen(false)
      setPrestationToDelete(null)
      // Here you would typically update your data or refetch
    } catch (error) {
      console.error('Error deleting prestation:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const calculatePrixTTC = () => {
    return forfaitFormData.prixDeBase * (1 + forfaitFormData.tva / 100)
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
        {/* Desktop Table Layout */}
        <div className="hidden md:block rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPrestations.length === prestations.length && prestations.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="border-slate-300"
                  />
                </TableHead>
                <TableHead className="font-semibold min-w-[200px]">Nom</TableHead>
                <TableHead className="font-semibold min-w-[250px]">Description</TableHead>
                <TableHead className="font-semibold text-center w-20">Durée</TableHead>
                <TableHead className="font-semibold text-center w-24">Popularité</TableHead>
                <TableHead className="font-semibold text-center w-24">Forfaits</TableHead>
                <TableHead className="font-semibold text-center w-20">Statut</TableHead>
                <TableHead className="text-right font-semibold w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPrestations.map((prestation, index) => {
                const forfaits = getForfaitsForPrestation(prestation.id)
                return (
                  <TableRow
                    key={prestation.id}
                    className={`hover:bg-slate-50/80 transition-colors duration-200 ${selectedPrestations.includes(prestation.id) ? 'bg-blue-50/50' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedPrestations.includes(prestation.id)}
                        onCheckedChange={(checked) => handleSelectPrestation(prestation.id, checked as boolean)}
                        className="border-slate-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${typeService === 'CARROSSERIE' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                          {typeService === 'CARROSSERIE' ?
                            <PaintBucket className="h-4 w-4 text-orange-600" /> :
                            <Wrench className="h-4 w-4 text-blue-600" />
                          }
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900">{prestation.nom}</div>
                          <div className="text-xs text-slate-500">ID: {prestation.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600 max-w-xs">
                        {prestation.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-medium text-slate-900 whitespace-nowrap">
                          {formatDuration(prestation.dureeEstimee)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getPopulariteBadge(prestation.popularite)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {forfaits.length} forfait{forfaits.length > 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {prestation.actif ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 whitespace-nowrap">Actif</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 whitespace-nowrap">Inactif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors whitespace-nowrap"
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
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => handleEditPrestation(prestation.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDeletePrestation(prestation)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
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
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold">Marque</TableHead>
                      <TableHead className="font-semibold">Modèle</TableHead>
                      <TableHead className="font-semibold">Prix Base (€ HT)</TableHead>
                      <TableHead className="font-semibold">TVA (%)</TableHead>
                      <TableHead className="font-semibold">Prix TTC (€)</TableHead>
                      <TableHead className="font-semibold">Unité</TableHead>
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
                            <div className="text-sm text-slate-600 max-w-xs line-clamp-2">
                              {forfait.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono">
                              {forfait.marqueVehicule}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono">
                              {forfait.modeleVehicule}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-slate-900">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(forfait.prixDeBase)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-600">{forfait.tva}%</span>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-green-700">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(forfait.prixDeBase * (1 + forfait.tva / 100))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {forfait.unite === 'autre' ? forfait.uniteAutre || forfait.unite : forfait.unite}
                            </Badge>
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
                                <DropdownMenuItem
                                  className="hover:bg-blue-50 hover:text-blue-600"
                                  onClick={() => handleEditForfait(forfait)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleDeleteForfait(forfait)}
                                >
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

          {/* Delete Prestation Dialog */}
          <PrestationDeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            prestation={prestationToDelete}
            onConfirm={handleConfirmDelete}
            isLoading={isLoading}
          />

          {/* Edit Prestation Dialog */}
          <Dialog open={isEditPrestationDialogOpen} onOpenChange={setIsEditPrestationDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier la prestation</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de la prestation
                </DialogDescription>
              </DialogHeader>
              <PrestationForm
                onSubmit={handleUpdatePrestation}
                onCancel={() => {
                  setIsEditPrestationDialogOpen(false)
                  setEditingPrestation(null)
                }}
                isLoading={isLoading}
                initialData={editingPrestation ? mockPrestations.find(p => p.id === editingPrestation) : undefined}
              />
            </DialogContent>
          </Dialog>

          {/* Add Forfait Dialog */}
          <Dialog open={isAddForfaitDialogOpen} onOpenChange={setIsAddForfaitDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau forfait</DialogTitle>
                <DialogDescription>
                  Exemple: RÉVISION GÉNÉRALE Toyota
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateForfait} className="space-y-6">
                <Card className="border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    {/* Nom du forfait */}
                    <div className="space-y-2">
                      <Label htmlFor="forfait-nom" className="font-medium">
                        Nom du forfait <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="forfait-nom"
                          value={forfaitFormData.nom}
                          onChange={(e) => handleForfaitInputChange('nom', e.target.value)}
                          placeholder="RÉVISION GÉNÉRALE Toyota"
                          className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.nom ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                            }`}
                        />
                        {forfaitErrors.nom && (
                          <AlertTriangle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                        )}
                      </div>
                      {forfaitErrors.nom && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {forfaitErrors.nom}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="forfait-description" className="font-medium">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <textarea
                          id="forfait-description"
                          value={forfaitFormData.description}
                          onChange={(e) => handleForfaitInputChange('description', e.target.value)}
                          placeholder="RÉVISION GÉNÉRALE"
                          rows={3}
                          className={`w-full pl-10 pr-10 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.description ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                            }`}
                        />
                        {forfaitErrors.description && (
                          <AlertTriangle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {forfaitErrors.description && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {forfaitErrors.description}
                        </div>
                      )}
                    </div>

                    {/* Prestation (disabled) */}
                    <div className="space-y-2">
                      <Label className="font-medium">
                        Prestation <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={(() => {
                            const prestation = mockPrestations.find(p => p.id === forfaitFormData.prestationId);
                            return prestation ? prestation.nom : 'Aucune prestation sélectionnée';
                          })()}
                          disabled
                          className="pl-10 bg-slate-50 text-slate-600 border-slate-200"
                        />
                      </div>
                      {forfaitFormData.prestationId && (
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          {(() => {
                            const selectedPrestation = mockPrestations.find(p => p.id === forfaitFormData.prestationId);
                            return selectedPrestation ? (
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${selectedPrestation.typeService === 'CARROSSERIE' ? 'bg-orange-100' : 'bg-blue-100'
                                  }`}>
                                  {selectedPrestation.typeService === 'CARROSSERIE' ? (
                                    <PaintBucket className="h-4 w-4 text-orange-600" />
                                  ) : (
                                    <Wrench className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-slate-900">{selectedPrestation.nom}</div>
                                  <div className="text-sm text-slate-600 mt-1">{selectedPrestation.description}</div>
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Véhicule avec recherche */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Marque avec recherche */}
                      <div className="space-y-2">
                        <Label className="font-medium">
                          Marque <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={marqueSearchOpen} onOpenChange={setMarqueSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={marqueSearchOpen}
                              className={`w-full justify-between h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.marqueVehicule ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                                } ${!forfaitFormData.marqueVehicule ? 'text-slate-500' : ''}`}
                            >
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-slate-400" />
                                <span>{forfaitFormData.marqueVehicule || "Sélectionner une marque..."}</span>
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Rechercher ou taper une nouvelle marque..."
                                value={marqueSearchValue}
                                onValueChange={setMarqueSearchValue}
                              />
                              <CommandEmpty>
                                <div className="p-4 text-center">
                                  <p className="text-sm text-slate-600 mb-3">Aucune marque trouvée</p>
                                  {marqueSearchValue && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        // Add new marque to the list
                                        const newMarque = marqueSearchValue.trim()
                                        if (newMarque && !mockMarques.includes(newMarque)) {
                                          setMockMarques(prev => [...prev, newMarque])
                                        }
                                        handleForfaitInputChange('marqueVehicule', newMarque)
                                        setMarqueSearchOpen(false)
                                        setMarqueSearchValue('')
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Ajouter "{marqueSearchValue}"
                                    </Button>
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {mockMarques
                                  .filter(marque =>
                                    marque.toLowerCase().includes(marqueSearchValue.toLowerCase())
                                  )
                                  .map((marque) => (
                                    <CommandItem
                                      key={marque}
                                      value={marque}
                                      onSelect={(currentValue) => {
                                        handleForfaitInputChange('marqueVehicule', currentValue === forfaitFormData.marqueVehicule ? '' : currentValue)
                                        setMarqueSearchOpen(false)
                                        setMarqueSearchValue('')
                                      }}
                                      className="flex items-center gap-3 p-3 hover:bg-slate-50"
                                    >
                                      <Car className="h-4 w-4 text-slate-400" />
                                      <span className="font-medium text-slate-900">{marque}</span>
                                      <Check
                                        className={`ml-auto h-4 w-4 ${forfaitFormData.marqueVehicule === marque ? "opacity-100" : "opacity-0"
                                          }`}
                                      />
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {forfaitErrors.marqueVehicule && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            {forfaitErrors.marqueVehicule}
                          </div>
                        )}
                      </div>

                      {/* Modèle avec recherche */}
                      <div className="space-y-2">
                        <Label className="font-medium">
                          Modèle <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={modeleSearchOpen} onOpenChange={setModeleSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={modeleSearchOpen}
                              disabled={!forfaitFormData.marqueVehicule}
                              className={`w-full justify-between h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.modeleVehicule ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                                } ${!forfaitFormData.modeleVehicule ? 'text-slate-500' : ''} ${!forfaitFormData.marqueVehicule ? 'bg-slate-50 text-slate-400' : ''}`}
                            >
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-slate-400" />
                                <span>{forfaitFormData.modeleVehicule || "Sélectionner un modèle..."}</span>
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Rechercher ou taper un nouveau modèle..."
                                value={modeleSearchValue}
                                onValueChange={setModeleSearchValue}
                              />
                              <CommandEmpty>
                                <div className="p-4 text-center">
                                  <p className="text-sm text-slate-600 mb-3">Aucun modèle trouvé</p>
                                  {modeleSearchValue && forfaitFormData.marqueVehicule && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        // Add new modele to the list
                                        const newModele = modeleSearchValue.trim()
                                        if (newModele && !getModelesForMarque(forfaitFormData.marqueVehicule).includes(newModele)) {
                                          setMockModeles(prev => ({
                                            ...prev,
                                            [forfaitFormData.marqueVehicule]: [
                                              ...(prev[forfaitFormData.marqueVehicule] || []),
                                              newModele
                                            ]
                                          }))
                                        }
                                        handleForfaitInputChange('modeleVehicule', newModele)
                                        setModeleSearchOpen(false)
                                        setModeleSearchValue('')
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Ajouter "{modeleSearchValue}"
                                    </Button>
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {getModelesForMarque(forfaitFormData.marqueVehicule)
                                  .filter(modele =>
                                    modele.toLowerCase().includes(modeleSearchValue.toLowerCase())
                                  )
                                  .map((modele) => (
                                    <CommandItem
                                      key={modele}
                                      value={modele}
                                      onSelect={(currentValue) => {
                                        handleForfaitInputChange('modeleVehicule', currentValue === forfaitFormData.modeleVehicule ? '' : currentValue)
                                        setModeleSearchOpen(false)
                                        setModeleSearchValue('')
                                      }}
                                      className="flex items-center gap-3 p-3 hover:bg-slate-50"
                                    >
                                      <Car className="h-4 w-4 text-slate-400" />
                                      <span className="font-medium text-slate-900">{modele}</span>
                                      <Check
                                        className={`ml-auto h-4 w-4 ${forfaitFormData.modeleVehicule === modele ? "opacity-100" : "opacity-0"
                                          }`}
                                      />
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {forfaitErrors.modeleVehicule && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            {forfaitErrors.modeleVehicule}
                          </div>
                        )}
                        {!forfaitFormData.marqueVehicule && (
                          <p className="text-xs text-slate-500">Sélectionnez d'abord une marque</p>
                        )}
                      </div>
                    </div>

                    {/* Unité - Radio Buttons */}
                    <div className="space-y-3">
                      <Label className="font-medium">
                        Unité <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={forfaitFormData.unite}
                        onValueChange={(value) => handleForfaitInputChange('unite', value)}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="prestation" id="unite-prestation" />
                          <Label htmlFor="unite-prestation" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Prestation</span>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="heure" id="unite-heure" />
                          <Label htmlFor="unite-heure" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Heure</span>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="jour" id="unite-jour" />
                          <Label htmlFor="unite-jour" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Jour</span>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="autre" id="unite-autre" />
                          <Label htmlFor="unite-autre" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Autre</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {forfaitFormData.unite === 'autre' && (
                        <div className="mt-3">
                          <Label htmlFor="unite-autre-input" className="text-sm font-medium text-slate-700 mb-2 block">
                            Précisez l'unité
                          </Label>
                          <Input
                            id="unite-autre-input"
                            value={forfaitFormData.uniteAutre || ''}
                            onChange={(e) => handleForfaitInputChange('uniteAutre', e.target.value)}
                            placeholder="Ex: Kilomètre, Pièce, Forfait..."
                            className={`border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.uniteAutre ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                              }`}
                          />
                          {forfaitErrors.uniteAutre && (
                            <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                              <AlertTriangle className="h-3 w-3" />
                              {forfaitErrors.uniteAutre}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Prix de base */}
                    <div className="space-y-2">
                      <Label htmlFor="forfait-prix" className="font-medium">
                        Prix de base (€ HT) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="forfait-prix"
                          type="number"
                          step="0.01"
                          min="0"
                          value={forfaitFormData.prixDeBase}
                          onChange={(e) => handleForfaitInputChange('prixDeBase', parseFloat(e.target.value) || 0)}
                          placeholder="150.00"
                          className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.prixDeBase ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                            }`}
                        />
                        {forfaitErrors.prixDeBase && (
                          <AlertTriangle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                        )}
                      </div>
                      {forfaitErrors.prixDeBase && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {forfaitErrors.prixDeBase}
                        </div>
                      )}
                    </div>

                    {/* TVA */}
                    <div className="space-y-2">
                      <Label htmlFor="forfait-tva" className="font-medium">
                        TVA (%)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                        <Input
                          id="forfait-tva"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={forfaitFormData.tva}
                          onChange={(e) => handleForfaitInputChange('tva', parseFloat(e.target.value) || 0)}
                          className="pl-8 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                        />
                      </div>
                      <p className="text-xs text-slate-500">TVA standard: 20%</p>
                    </div>

                    {/* Récapitulatif prix */}
                    {forfaitFormData.prixDeBase > 0 && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Récapitulatif</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Prix HT:</span>
                            <span className="font-medium text-blue-900">
                              {forfaitFormData.prixDeBase.toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">TVA ({forfaitFormData.tva}%):</span>
                            <span className="font-medium text-blue-900">
                              {(forfaitFormData.prixDeBase * forfaitFormData.tva / 100).toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-blue-300 pt-1">
                            <span className="font-medium text-blue-900">Prix TTC:</span>
                            <span className="font-bold text-blue-900">
                              {calculatePrixTTC().toFixed(2)} €
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 mt-2">
                            Par {forfaitFormData.unite === 'autre' ? forfaitFormData.uniteAutre : forfaitFormData.unite}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddForfaitDialogOpen(false)}
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
                              Ajouter le Forfait
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Forfait Dialog */}
          <Dialog open={isEditForfaitDialogOpen} onOpenChange={setIsEditForfaitDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier le forfait</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du forfait
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpdateForfait} className="space-y-6">
                <Card className="border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    {/* Nom du forfait */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-forfait-nom" className="font-medium">
                        Nom du forfait <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="edit-forfait-nom"
                          value={forfaitFormData.nom}
                          onChange={(e) => handleForfaitInputChange('nom', e.target.value)}
                          placeholder="RÉVISION GÉNÉRALE Toyota"
                          className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.nom ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                            }`}
                        />
                        {forfaitErrors.nom && (
                          <AlertTriangle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                        )}
                      </div>
                      {forfaitErrors.nom && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {forfaitErrors.nom}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-forfait-description" className="font-medium">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <textarea
                          id="edit-forfait-description"
                          value={forfaitFormData.description}
                          onChange={(e) => handleForfaitInputChange('description', e.target.value)}
                          placeholder="RÉVISION GÉNÉRALE"
                          rows={3}
                          className={`w-full pl-10 pr-10 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.description ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                            }`}
                        />
                        {forfaitErrors.description && (
                          <AlertTriangle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {forfaitErrors.description && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {forfaitErrors.description}
                        </div>
                      )}
                    </div>

                    {/* Prestation (disabled) */}
                    <div className="space-y-2">
                      <Label className="font-medium">
                        Prestation <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={(() => {
                            const prestation = mockPrestations.find(p => p.id === forfaitFormData.prestationId);
                            return prestation ? prestation.nom : 'Aucune prestation sélectionnée';
                          })()}
                          disabled
                          className="pl-10 bg-slate-50 text-slate-600 border-slate-200"
                        />
                      </div>
                      {forfaitFormData.prestationId && (
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          {(() => {
                            const selectedPrestation = mockPrestations.find(p => p.id === forfaitFormData.prestationId);
                            return selectedPrestation ? (
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${selectedPrestation.typeService === 'CARROSSERIE' ? 'bg-orange-100' : 'bg-blue-100'
                                  }`}>
                                  {selectedPrestation.typeService === 'CARROSSERIE' ? (
                                    <PaintBucket className="h-4 w-4 text-orange-600" />
                                  ) : (
                                    <Wrench className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-slate-900">{selectedPrestation.nom}</div>
                                  <div className="text-sm text-slate-600 mt-1">{selectedPrestation.description}</div>
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Véhicule avec recherche */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Marque avec recherche */}
                      <div className="space-y-2">
                        <Label className="font-medium">
                          Marque <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={marqueSearchOpen} onOpenChange={setMarqueSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={marqueSearchOpen}
                              className={`w-full justify-between h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.marqueVehicule ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                                } ${!forfaitFormData.marqueVehicule ? 'text-slate-500' : ''}`}
                            >
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-slate-400" />
                                <span>{forfaitFormData.marqueVehicule || "Sélectionner une marque..."}</span>
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Rechercher ou taper une nouvelle marque..."
                                value={marqueSearchValue}
                                onValueChange={setMarqueSearchValue}
                              />
                              <CommandEmpty>
                                <div className="p-4 text-center">
                                  <p className="text-sm text-slate-600 mb-3">Aucune marque trouvée</p>
                                  {marqueSearchValue && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        // Add new marque to the list
                                        const newMarque = marqueSearchValue.trim()
                                        if (newMarque && !mockMarques.includes(newMarque)) {
                                          setMockMarques(prev => [...prev, newMarque])
                                        }
                                        handleForfaitInputChange('marqueVehicule', newMarque)
                                        setMarqueSearchOpen(false)
                                        setMarqueSearchValue('')
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Ajouter "{marqueSearchValue}"
                                    </Button>
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {mockMarques
                                  .filter(marque =>
                                    marque.toLowerCase().includes(marqueSearchValue.toLowerCase())
                                  )
                                  .map((marque) => (
                                    <CommandItem
                                      key={marque}
                                      value={marque}
                                      onSelect={(currentValue) => {
                                        handleForfaitInputChange('marqueVehicule', currentValue === forfaitFormData.marqueVehicule ? '' : currentValue)
                                        setMarqueSearchOpen(false)
                                        setMarqueSearchValue('')
                                      }}
                                      className="flex items-center gap-3 p-3 hover:bg-slate-50"
                                    >
                                      <Car className="h-4 w-4 text-slate-400" />
                                      <span className="font-medium text-slate-900">{marque}</span>
                                      <Check
                                        className={`ml-auto h-4 w-4 ${forfaitFormData.marqueVehicule === marque ? "opacity-100" : "opacity-0"
                                          }`}
                                      />
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {forfaitErrors.marqueVehicule && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            {forfaitErrors.marqueVehicule}
                          </div>
                        )}
                      </div>

                      {/* Modèle avec recherche */}
                      <div className="space-y-2">
                        <Label className="font-medium">
                          Modèle <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={modeleSearchOpen} onOpenChange={setModeleSearchOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={modeleSearchOpen}
                              disabled={!forfaitFormData.marqueVehicule}
                              className={`w-full justify-between h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.modeleVehicule ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                                } ${!forfaitFormData.modeleVehicule ? 'text-slate-500' : ''} ${!forfaitFormData.marqueVehicule ? 'bg-slate-50 text-slate-400' : ''
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-slate-400" />
                                <span>{forfaitFormData.modeleVehicule || "Sélectionner un modèle..."}</span>
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Rechercher ou taper un nouveau modèle..."
                                value={modeleSearchValue}
                                onValueChange={setModeleSearchValue}
                              />
                              <CommandEmpty>
                                <div className="p-4 text-center">
                                  <p className="text-sm text-slate-600 mb-3">Aucun modèle trouvé</p>
                                  {modeleSearchValue && forfaitFormData.marqueVehicule && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        // Add new modele to the list
                                        const newModele = modeleSearchValue.trim()
                                        if (newModele && !getModelesForMarque(forfaitFormData.marqueVehicule).includes(newModele)) {
                                          setMockModeles(prev => ({
                                            ...prev,
                                            [forfaitFormData.marqueVehicule]: [
                                              ...(prev[forfaitFormData.marqueVehicule] || []),
                                              newModele
                                            ]
                                          }))
                                        }
                                        handleForfaitInputChange('modeleVehicule', newModele)
                                        setModeleSearchOpen(false)
                                        setModeleSearchValue('')
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Ajouter "{modeleSearchValue}"
                                    </Button>
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {getModelesForMarque(forfaitFormData.marqueVehicule)
                                  .filter(modele =>
                                    modele.toLowerCase().includes(modeleSearchValue.toLowerCase())
                                  )
                                  .map((modele) => (
                                    <CommandItem
                                      key={modele}
                                      value={modele}
                                      onSelect={(currentValue) => {
                                        handleForfaitInputChange('modeleVehicule', currentValue === forfaitFormData.modeleVehicule ? '' : currentValue)
                                        setModeleSearchOpen(false)
                                        setModeleSearchValue('')
                                      }}
                                      className="flex items-center gap-3 p-3 hover:bg-slate-50"
                                    >
                                      <Car className="h-4 w-4 text-slate-400" />
                                      <span className="font-medium text-slate-900">{modele}</span>
                                      <Check
                                        className={`ml-auto h-4 w-4 ${forfaitFormData.modeleVehicule === modele ? "opacity-100" : "opacity-0"
                                          }`}
                                      />
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {forfaitErrors.modeleVehicule && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            {forfaitErrors.modeleVehicule}
                          </div>
                        )}
                        {!forfaitFormData.marqueVehicule && (
                          <p className="text-xs text-slate-500">Sélectionnez d'abord une marque</p>
                        )}
                      </div>
                    </div>

                    {/* Unité - Radio Buttons */}
                    <div className="space-y-3">
                      <Label className="font-medium">
                        Unité <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={forfaitFormData.unite}
                        onValueChange={(value) => handleForfaitInputChange('unite', value)}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="prestation" id="edit-unite-prestation" />
                          <Label htmlFor="edit-unite-prestation" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Prestation</span>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="heure" id="edit-unite-heure" />
                          <Label htmlFor="edit-unite-heure" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Heure</span>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="jour" id="edit-unite-jour" />
                          <Label htmlFor="edit-unite-jour" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Jour</span>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="autre" id="edit-unite-autre" />
                          <Label htmlFor="edit-unite-autre" className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Autre</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {forfaitFormData.unite === 'autre' && (
                        <div className="mt-3">
                          <Label htmlFor="edit-unite-autre-input" className="text-sm font-medium text-slate-700 mb-2 block">
                            Précisez l'unité
                          </Label>
                          <Input
                            id="edit-unite-autre-input"
                            value={forfaitFormData.uniteAutre || ''}
                            onChange={(e) => handleForfaitInputChange('uniteAutre', e.target.value)}
                            placeholder="Ex: Kilomètre, Pièce, Forfait..."
                            className={`border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.uniteAutre ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                              }`}
                          />
                          {forfaitErrors.uniteAutre && (
                            <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                              <AlertTriangle className="h-3 w-3" />
                              {forfaitErrors.uniteAutre}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Prix de base */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-forfait-prix" className="font-medium">
                        Prix de base (€ HT) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="edit-forfait-prix"
                          type="number"
                          step="0.01"
                          min="0"
                          value={forfaitFormData.prixDeBase}
                          onChange={(e) => handleForfaitInputChange('prixDeBase', parseFloat(e.target.value) || 0)}
                          placeholder="150.00"
                          className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${forfaitErrors.prixDeBase ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                            }`}
                        />
                        {forfaitErrors.prixDeBase && (
                          <AlertTriangle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                        )}
                      </div>
                      {forfaitErrors.prixDeBase && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {forfaitErrors.prixDeBase}
                        </div>
                      )}
                    </div>

                    {/* TVA */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-forfait-tva" className="font-medium">
                        TVA (%)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                        <Input
                          id="edit-forfait-tva"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={forfaitFormData.tva}
                          onChange={(e) => handleForfaitInputChange('tva', parseFloat(e.target.value) || 0)}
                          className="pl-8 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                        />
                      </div>
                      <p className="text-xs text-slate-500">TVA standard: 20%</p>
                    </div>

                    {/* Récapitulatif prix */}
                    {forfaitFormData.prixDeBase > 0 && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Récapitulatif</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Prix HT:</span>
                            <span className="font-medium text-blue-900">
                              {forfaitFormData.prixDeBase.toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">TVA ({forfaitFormData.tva}%):</span>
                            <span className="font-medium text-blue-900">
                              {(forfaitFormData.prixDeBase * forfaitFormData.tva / 100).toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-blue-300 pt-1">
                            <span className="font-medium text-blue-900">Prix TTC:</span>
                            <span className="font-bold text-blue-900">
                              {calculatePrixTTC().toFixed(2)} €
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 mt-2">
                            Par {forfaitFormData.unite === 'autre' ? forfaitFormData.uniteAutre : forfaitFormData.unite}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditForfaitDialogOpen(false)
                            setEditingForfait(null)
                            // Reset form
                            setForfaitFormData({
                              nom: '',
                              description: '',
                              marqueVehicule: '',
                              modeleVehicule: '',
                              prestationId: '',
                              prixDeBase: 0,
                              unite: 'prestation',
                              uniteAutre: '',
                              tva: 20
                            })
                            setForfaitErrors({})
                          }}
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
                              Mise à jour...
                            </>
                          ) : (
                            <>
                              Mettre à jour le Forfait
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Forfait Dialog */}
          <ForfaitDeleteConfirmationDialog
            open={isForfaitDeleteDialogOpen}
            onOpenChange={setIsForfaitDeleteDialogOpen}
            forfait={forfaitToDelete}
            onConfirm={handleConfirmForfaitDelete}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}