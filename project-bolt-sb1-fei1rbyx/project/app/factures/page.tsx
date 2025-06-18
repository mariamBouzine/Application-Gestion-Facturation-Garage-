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
  Search,
  Receipt,
  Euro,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  X,
  Send,
  Copy,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Building,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  FileText,
  DollarSign
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FactureForm } from '@/components/forms/facture-form'
import { toast } from 'sonner'

// Mock data with more entries
const mockFactures = [
  {
    id: '1',
    numeroFacture: 'FAC-2024-001',
    date: new Date('2024-01-15T00:00:00Z'),
    dateEcheance: new Date('2024-02-15T00:00:00Z'),
    clientNom: 'Martin Dubois',
    clientId: '1',
    montantTTC: 850.50,
    statut: 'EN_ATTENTE',
    modePaiement: null,
    dateReglement: null,
    numeroODR: 'ODR-2024-012',
    createdAt: new Date('2024-01-15T00:00:00Z')
  },
  {
    id: '2',
    numeroFacture: 'FAC-2024-002',
    date: new Date('2024-01-10T00:00:00Z'),
    dateEcheance: new Date('2024-01-25T00:00:00Z'),
    clientNom: 'Sophie Lambert',
    clientId: '2',
    montantTTC: 1250.00,
    statut: 'IMPAYEE',
    modePaiement: null,
    dateReglement: null,
    numeroODR: 'ODR-2024-008',
    createdAt: new Date('2024-01-10T00:00:00Z')
  },
  {
    id: '3',
    numeroFacture: 'FAC-2024-003',
    date: new Date('2024-01-12T00:00:00Z'),
    dateEcheance: new Date('2024-02-12T00:00:00Z'),
    clientNom: 'Garage Centrale',
    clientId: '3',
    montantTTC: 450.75,
    statut: 'PAYEE',
    modePaiement: 'VIREMENT',
    dateReglement: new Date('2024-01-20T00:00:00Z'),
    numeroODR: 'ODR-2024-010',
    createdAt: new Date('2024-01-12T00:00:00Z')
  },
  {
    id: '4',
    numeroFacture: 'FAC-2024-004',
    date: new Date('2024-01-18T00:00:00Z'),
    dateEcheance: new Date('2024-02-18T00:00:00Z'),
    clientNom: 'Transport Martin',
    clientId: '4',
    montantTTC: 2150.00,
    statut: 'PARTIELLEMENT_PAYEE',
    modePaiement: 'MIXTE',
    dateReglement: new Date('2024-01-25T00:00:00Z'),
    numeroODR: 'ODR-2024-015',
    createdAt: new Date('2024-01-18T00:00:00Z')
  },
  {
    id: '5',
    numeroFacture: 'FAC-2024-005',
    date: new Date('2024-01-22T00:00:00Z'),
    dateEcheance: new Date('2024-02-22T00:00:00Z'),
    clientNom: 'Marie Petit',
    clientId: '5',
    montantTTC: 675.25,
    statut: 'PAYEE',
    modePaiement: 'TPE_VIVAWALLET',
    dateReglement: new Date('2024-01-23T00:00:00Z'),
    numeroODR: 'ODR-2024-017',
    createdAt: new Date('2024-01-22T00:00:00Z')
  },
  {
    id: '6',
    numeroFacture: 'FAC-2024-006',
    date: new Date('2024-01-08T00:00:00Z'),
    dateEcheance: new Date('2024-01-23T00:00:00Z'),
    clientNom: 'Jean Durand',
    clientId: '6',
    montantTTC: 380.90,
    statut: 'ANNULEE',
    modePaiement: null,
    dateReglement: null,
    numeroODR: 'ODR-2024-006',
    createdAt: new Date('2024-01-08T00:00:00Z')
  }
]

const mockClients = [
  { id: '1', nom: 'Dubois', prenom: 'Martin', numeroClient: 'CLI-001' },
  { id: '2', nom: 'Lambert', prenom: 'Sophie', numeroClient: 'CLI-002' },
  { id: '3', nom: 'Centrale', prenom: 'Garage', numeroClient: 'CLI-003' },
  { id: '4', nom: 'Martin', prenom: 'Transport', numeroClient: 'CLI-004' },
  { id: '5', nom: 'Petit', prenom: 'Marie', numeroClient: 'CLI-005' },
  { id: '6', nom: 'Durand', prenom: 'Jean', numeroClient: 'CLI-006' }
]

const mockODRs = [
  { id: '1', numeroODR: 'ODR-2024-012', clientNom: 'Martin Dubois', montantTotal: 850.50 },
  { id: '2', numeroODR: 'ODR-2024-008', clientNom: 'Sophie Lambert', montantTotal: 1250.00 },
  { id: '3', numeroODR: 'ODR-2024-010', clientNom: 'Garage Centrale', montantTotal: 450.75 },
  { id: '4', numeroODR: 'ODR-2024-015', clientNom: 'Transport Martin', montantTotal: 2150.00 },
  { id: '5', numeroODR: 'ODR-2024-017', clientNom: 'Marie Petit', montantTotal: 675.25 },
  { id: '6', numeroODR: 'ODR-2024-006', clientNom: 'Jean Durand', montantTotal: 380.90 }
]

export default function FacturesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedFactures, setSelectedFactures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'montant' | 'statut' | 'echeance'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterStatut, setFilterStatut] = useState<'ALL' | 'PAYEE' | 'EN_ATTENTE' | 'IMPAYEE' | 'PARTIELLEMENT_PAYEE' | 'ANNULEE'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      setIsInitialLoading(false)
    }
    loadData()
  }, [])

  const filteredFactures = mockFactures.filter(facture => {
    const matchesSearch =
      facture.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.numeroODR.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatut = filterStatut === 'ALL' || facture.statut === filterStatut

    return matchesSearch && matchesStatut
  })

  // Sort factures
  const sortedFactures = [...filteredFactures].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'client':
        comparison = a.clientNom.localeCompare(b.clientNom)
        break
      case 'montant':
        comparison = a.montantTTC - b.montantTTC
        break
      case 'statut':
        comparison = a.statut.localeCompare(b.statut)
        break
      case 'echeance':
        comparison = new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime()
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedFactures.length / itemsPerPage)
  const paginatedFactures = sortedFactures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateFacture = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating facture:', data)
      setIsAddDialogOpen(false)
      toast.success('Facture créée avec succès', {
        description: `La facture ${data.numeroFacture || 'FAC-2024-XXX'} a été créée.`
      })
    } catch (error) {
      toast.error('Erreur lors de la création de la facture')
      console.error('Error creating facture:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncPennylane = async () => {
    setIsSyncing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Synchronisation réussie', {
        description: 'Les données Pennylane ont été mises à jour.'
      })
    } catch (error) {
      toast.error('Erreur lors de la synchronisation')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFactures(paginatedFactures.map(facture => facture.id))
    } else {
      setSelectedFactures([])
    }
  }

  const handleSelectFacture = (factureId: string, checked: boolean) => {
    if (checked) {
      setSelectedFactures(prev => [...prev, factureId])
    } else {
      setSelectedFactures(prev => prev.filter(id => id !== factureId))
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatut('ALL')
    setSortBy('date')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filterStatut !== 'ALL'

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'PAYEE':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 shadow-sm">
            <CheckCircle className="mr-1 h-3 w-3" />
            Payée
          </Badge>
        )
      case 'EN_ATTENTE':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 shadow-sm">
            <Clock className="mr-1 h-3 w-3" />
            En Attente
          </Badge>
        )
      case 'IMPAYEE':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 shadow-sm">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Impayée
          </Badge>
        )
      case 'PARTIELLEMENT_PAYEE':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100 shadow-sm">
            <Clock className="mr-1 h-3 w-3" />
            Partiellement Payée
          </Badge>
        )
      case 'ANNULEE':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 shadow-sm">
            <X className="mr-1 h-3 w-3" />
            Annulée
          </Badge>
        )
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const getModePaiementText = (mode: string | null) => {
    if (!mode) return '-'
    switch (mode) {
      case 'ESPECES':
        return 'Espèces'
      case 'CHEQUE':
        return 'Chèque'
      case 'VIREMENT':
        return 'Virement'
      case 'TPE_VIVAWALLET':
        return 'TPE Vivawallet'
      case 'CREDIT_INTERNE':
        return 'Crédit Interne'
      case 'MIXTE':
        return 'Mixte'
      default:
        return mode
    }
  }

  const getModePaiementIcon = (mode: string | null) => {
    if (!mode) return null
    switch (mode) {
      case 'ESPECES':
        return <DollarSign className="h-3 w-3" />
      case 'CHEQUE':
        return <FileText className="h-3 w-3" />
      case 'VIREMENT':
        return <Building className="h-3 w-3" />
      case 'TPE_VIVAWALLET':
        return <CreditCard className="h-3 w-3" />
      case 'CREDIT_INTERNE':
        return <Receipt className="h-3 w-3" />
      case 'MIXTE':
        return <Copy className="h-3 w-3" />
      default:
        return <CreditCard className="h-3 w-3" />
    }
  }

  // Calculate stats
  const stats = {
    total: mockFactures.length,
    payees: mockFactures.filter(f => f.statut === 'PAYEE').length,
    impayees: mockFactures.filter(f => f.statut === 'IMPAYEE').length,
    montantTotal: mockFactures.reduce((sum, f) => sum + f.montantTTC, 0),
    montantImpaye: mockFactures.filter(f => f.statut === 'IMPAYEE').reduce((sum, f) => sum + f.montantTTC, 0)
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
          <p className="text-slate-600">Chargement des factures...</p>
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
                  Gestion des Factures
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">{mockFactures.length} factures</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Suivi des factures générées depuis Pennylane
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleSyncPennylane}
                disabled={isSyncing}
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Synchroniser Pennylane
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                disabled={selectedFactures.length === 0}
              >
                <Download className="h-4 w-4" />
                Exporter {selectedFactures.length > 0 && `(${selectedFactures.length})`}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Facture
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle facture</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations de la facture
                    </DialogDescription>
                  </DialogHeader>
                  <FactureForm
                    onSubmit={handleCreateFacture}
                    onCancel={() => setIsAddDialogOpen(false)}
                    clients={mockClients}
                    odrs={mockODRs}
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
                  <CardTitle className="text-sm font-medium text-slate-600">Total Factures</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Receipt className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <TrendingUp className="h-3 w-3" />
                    +3%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Factures émises</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Factures Payées</CardTitle>
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">{stats.payees}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Réglées
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Paiements reçus</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Factures Impayées</CardTitle>
                  <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">{stats.impayees}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <TrendingDown className="h-3 w-3" />
                    En retard
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">En attente de paiement</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Montant Impayé</CardTitle>
                  <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Euro className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0
                    }).format(stats.montantImpaye)}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <AlertTriangle className="h-3 w-3" />
                    À recouvrer
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Créances en cours</p>
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
                    placeholder="Rechercher par numéro facture, client, ODR..."
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
                    <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="PAYEE">Payée</SelectItem>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                      <SelectItem value="IMPAYEE">Impayée</SelectItem>
                      <SelectItem value="PARTIELLEMENT_PAYEE">Partiellement payée</SelectItem>
                      <SelectItem value="ANNULEE">Annulée</SelectItem>
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
                      <SelectItem value="montant-desc">Montant ↓</SelectItem>
                      <SelectItem value="montant-asc">Montant ↑</SelectItem>
                      <SelectItem value="echeance-asc">Échéance proche</SelectItem>
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
                  <span className="font-medium">{filteredFactures.length}</span> facture{filteredFactures.length > 1 ? 's' : ''} trouvée{filteredFactures.length > 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <span className="text-blue-600 ml-1">(filtré{filteredFactures.length > 1 ? 'es' : 'e'})</span>
                  )}
                  {filteredFactures.length !== mockFactures.length && (
                    <span className="text-slate-400 ml-1">sur {mockFactures.length}</span>
                  )}
                </p>

                {selectedFactures.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm text-slate-600">
                      <span className="font-medium text-blue-600">{selectedFactures.length}</span> sélectionnée{selectedFactures.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Send className="h-3 w-3 mr-1" />
                        Relancer
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
          {filteredFactures.length === 0 && (
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-12 text-center">
                <Receipt className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {hasActiveFilters ? 'Aucune facture trouvée' : 'Aucune facture'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Aucune facture ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Vous n\'avez pas encore de factures. Commencez par créer votre première facture.'
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
                    Créer une facture
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table */}
          {filteredFactures.length > 0 && (
            <Card className="border border-slate-200 bg-white hidden md:block shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Receipt className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Liste des Factures</h4>
                    <p className="text-sm text-slate-600 font-normal">Gérez vos factures et leur statut de paiement</p>
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
                            checked={selectedFactures.length === paginatedFactures.length && paginatedFactures.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">N° Facture</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold">ODR Origine</TableHead>
                        <TableHead className="font-semibold">Montant TTC</TableHead>
                        <TableHead className="font-semibold">Échéance</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Mode Paiement</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedFactures.map((facture, index) => (
                        <TableRow
                          key={facture.id}
                          className={`hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            } ${selectedFactures.includes(facture.id) ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedFactures.includes(facture.id)}
                              onCheckedChange={(checked) => handleSelectFacture(facture.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono bg-slate-50 hover:bg-slate-100 transition-colors">
                              {facture.numeroFacture}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Calendar className="h-3 w-3" />
                              {format(facture.date, 'dd/MM/yyyy', { locale: fr })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-full">
                                <User className="h-3 w-3 text-blue-600" />
                              </div>
                              <div className="font-medium text-slate-900">{facture.clientNom}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono bg-purple-50 text-purple-700 border-purple-200 shadow-sm">
                              {facture.numeroODR}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-right">
                              <div className="font-semibold text-slate-900">
                                {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(facture.montantTTC)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-slate-600">
                              {format(facture.dateEcheance, 'dd/MM/yyyy', { locale: fr })}
                            </div>
                            {facture.dateEcheance < new Date() && facture.statut !== 'PAYEE' && (
                              <div className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Échéance dépassée
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatutBadge(facture.statut)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="text-sm text-slate-700">
                                  {getModePaiementText(facture.modePaiement)}
                                </div>
                                {facture.dateReglement && (
                                  <div className="text-xs text-slate-500">
                                    Réglé le {format(facture.dateReglement, 'dd/MM/yyyy', { locale: fr })}
                                  </div>
                                )}
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
                                  Voir la facture
                                </DropdownMenuItem>
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
                                <DropdownMenuItem className="hover:bg-orange-50 hover:text-orange-600">
                                  <Send className="mr-2 h-4 w-4" />
                                  Relancer client
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
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredFactures.length)}</span> sur{' '}
                        <span className="font-medium">{filteredFactures.length}</span> factures
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
          {filteredFactures.length > 0 && (
            <div className="grid gap-4 md:hidden">
              {paginatedFactures.map((facture) => (
                <Card
                  key={facture.id}
                  className={`border border-slate-200 bg-white hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${selectedFactures.includes(facture.id) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Receipt className="h-4 w-4 text-blue-600" />
                          </div>
                          <Checkbox
                            checked={selectedFactures.includes(facture.id)}
                            onCheckedChange={(checked) => handleSelectFacture(facture.id, checked as boolean)}
                            className="absolute -top-2 -right-2 bg-white shadow-md border-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge variant="outline" className="font-mono text-xs mb-1">
                            {facture.numeroFacture}
                          </Badge>
                          <h3 className="font-semibold text-slate-900">{facture.clientNom}</h3>
                          <p className="text-sm text-slate-600">ODR: {facture.numeroODR}</p>
                        </div>
                      </div>
                      {getStatutBadge(facture.statut)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getModePaiementIcon(facture.modePaiement)}
                          <span className="text-sm text-slate-600">
                            {getModePaiementText(facture.modePaiement)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(facture.montantTTC)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Émise le {format(facture.date, 'dd/MM/yyyy', { locale: fr })}</span>
                        </div>
                        <div className="text-right">
                          <div>Échéance</div>
                          <div className={facture.dateEcheance < new Date() && facture.statut !== 'PAYEE' ? 'text-red-500 font-medium' : ''}>
                            {format(facture.dateEcheance, 'dd/MM/yyyy', { locale: fr })}
                          </div>
                        </div>
                      </div>

                      {facture.dateReglement && (
                        <div className="text-xs text-slate-500 bg-green-50 p-2 rounded">
                          Réglé le {format(facture.dateReglement, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <div className="flex gap-2">
                        {facture.statut === 'IMPAYEE' && (
                          <Button variant="outline" size="sm" className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors">
                            <Send className="h-3 w-3 mr-1" />
                            Relancer
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
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
          {filteredFactures.length > 0 && totalPages > 1 && (
            <Card className="md:hidden border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">{filteredFactures.length}</span> factures
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