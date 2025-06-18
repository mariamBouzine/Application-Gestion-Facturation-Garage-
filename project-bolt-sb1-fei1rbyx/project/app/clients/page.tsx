'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Crown,
  User,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  Building,
  Calendar,
  TrendingUp,
  Users,
  Car,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2
} from 'lucide-react'
import { ClientForm } from '@/components/forms/client-form'
import { getClients, addClient, getClientStats, type Client } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({ totalClients: 0, grandsComptes: 0, nouveauxClientsMois: 0 })
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'nom' | 'date' | 'vehicules'>('nom')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterType, setFilterType] = useState<'ALL' | 'NORMAL' | 'GRAND_COMPTE'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500))
      setClients(getClients())
      setStats(getClientStats())
      setIsInitialLoading(false)
    }
    loadData()
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.numeroClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.entreprise && client.entreprise.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = filterType === 'ALL' || client.typeClient === filterType

    return matchesSearch && matchesFilter
  })

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'nom':
        comparison = `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`)
        break
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'vehicules':
        comparison = vehiculesCount(a.id) - vehiculesCount(b.id)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage)
  const paginatedClients = sortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateClient = async (data: any) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newClient = addClient(data)
      setClients(getClients())
      setStats(getClientStats())
      setIsAddDialogOpen(false)

      toast.success('Client créé avec succès', {
        description: `${newClient.prenom} ${newClient.nom} a été ajouté à votre base de données.`
      })
    } catch (error) {
      toast.error('Erreur lors de la création du client')
      console.error('Error creating client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const vehiculesCount = (clientId: string) => {
    return Math.floor(Math.random() * 5) + 1
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(paginatedClients.map(client => client.id))
    } else {
      setSelectedClients([])
    }
  }

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId])
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId))
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterType('ALL')
    setSortBy('nom')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  const getClientInitials = (client: Client) => {
    return `${client.prenom.charAt(0)}${client.nom.charAt(0)}`.toUpperCase()
  }

  const hasActiveFilters = searchTerm || filterType !== 'ALL'

  // Improved pagination navigation
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement des clients...</p>
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
                  Gestion des Clients
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">{clients.length} clients</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Gérez vos clients et leurs informations de contact
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                disabled={selectedClients.length === 0}
              >
                <Download className="h-4 w-4" />
                Exporter {selectedClients.length > 0 && `(${selectedClients.length})`}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau client</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du client pour l'ajouter à votre base de données
                    </DialogDescription>
                  </DialogHeader>
                  <ClientForm
                    onSubmit={handleCreateClient}
                    onCancel={() => setIsAddDialogOpen(false)}
                    isLoading={isLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Clients</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.totalClients}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    +12%
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Clients actifs</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Grands Comptes</CardTitle>
                  <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Crown className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.grandsComptes}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <Crown className="h-3 w-3" />
                    VIP
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Clients premium</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Véhicules Total</CardTitle>
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <Car className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {clients.reduce((sum, client) => sum + vehiculesCount(client.id), 0)}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <Car className="h-3 w-3" />
                    Actifs
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">Véhicules enregistrés</p>
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
                    placeholder="Rechercher par nom, email, numéro client, entreprise..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1) // Reset to first page when searching
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
                  <Select value={filterType} onValueChange={(value: any) => {
                    setFilterType(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type de client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les clients</SelectItem>
                      <SelectItem value="NORMAL">Clients normaux</SelectItem>
                      <SelectItem value="GRAND_COMPTE">Grands comptes</SelectItem>
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
                      <SelectItem value="date-desc">Plus récent</SelectItem>
                      <SelectItem value="date-asc">Plus ancien</SelectItem>
                      <SelectItem value="vehicules-desc">Plus de véhicules</SelectItem>
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
                  <span className="font-medium">{filteredClients.length}</span> client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <span className="text-blue-600 ml-1">(filtré{filteredClients.length > 1 ? 's' : ''})</span>
                  )}
                  {filteredClients.length !== clients.length && (
                    <span className="text-slate-400 ml-1">sur {clients.length}</span>
                  )}
                </p>

                {selectedClients.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm text-slate-600">
                      <span className="font-medium text-blue-600">{selectedClients.length}</span> sélectionné{selectedClients.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
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
          {filteredClients.length === 0 && (
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {hasActiveFilters ? 'Aucun client trouvé' : 'Aucun client'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Aucun client ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Vous n\'avez pas encore de clients. Commencez par ajouter votre premier client.'
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
                    Ajouter un client
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table */}
          {filteredClients.length > 0 && (
            <Card className="border border-slate-200 bg-white hidden md:block shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-500">Liste des Clients</h4>
                    <p className="text-sm text-slate-600 font-normal">Gérez vos clients et leurs informations</p>
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
                            checked={selectedClients.length === paginatedClients.length && paginatedClients.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Entreprise</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Véhicules</TableHead>
                        <TableHead className="font-semibold">Inscription</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedClients.map((client, index) => (
                        <TableRow
                          key={client.id}
                          className={`hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            } ${selectedClients.includes(client.id) ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedClients.includes(client.id)}
                              onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.prenom}${client.nom}`} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                  {getClientInitials(client)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-slate-900">{client.prenom} {client.nom}</div>
                                <div className="text-sm text-slate-500 font-mono">{client.numeroClient}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-2 h-3 w-3 text-slate-400" />
                                <span className="text-slate-700 truncate max-w-[200px]" title={client.email}>
                                  {client.email}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="mr-2 h-3 w-3 text-slate-400" />
                                <span className="text-slate-700">{client.telephone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {client.entreprise ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 max-w-[120px] truncate" title={client.entreprise}>
                                  {client.entreprise}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm italic">Particulier</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={client.typeClient === 'GRAND_COMPTE' ? 'default' : 'secondary'}
                              className={client.typeClient === 'GRAND_COMPTE'
                                ? 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm'
                                : 'bg-slate-100 text-slate-700 shadow-sm'
                              }
                            >
                              {client.typeClient === 'GRAND_COMPTE' ? (
                                <>
                                  <Crown className="mr-1 h-3 w-3" />
                                  Grand Compte
                                </>
                              ) : (
                                <>
                                  <User className="mr-1 h-3 w-3" />
                                  Normal
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm">
                                {vehiculesCount(client.id)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              
                              {new Date(client.createdAt).toLocaleDateString('fr-FR')}
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
                                  Voir le profil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                                  <Mail className="mr-2 h-4 w-4" />
                                  Envoyer un email
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
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredClients.length)}</span> sur{' '}
                        <span className="font-medium">{filteredClients.length}</span> clients
                      </p>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        // Note: You'd need to make itemsPerPage a state variable for this to work
                        // setItemsPerPage(parseInt(value))
                        // setCurrentPage(1)
                      }}>
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
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
          {filteredClients.length > 0 && (
            <div className="grid gap-4 md:hidden">
              {paginatedClients.map((client) => (
                <Card
                  key={client.id}
                  className={`border border-slate-200 bg-white hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${selectedClients.includes(client.id) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 ring-2 ring-slate-100">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.prenom}${client.nom}`} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                              {getClientInitials(client)}
                            </AvatarFallback>
                          </Avatar>
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                            className="absolute -top-2 -right-2 bg-white shadow-md border-2"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{client.prenom} {client.nom}</h3>
                          <p className="text-sm text-slate-500 font-mono">{client.numeroClient}</p>
                        </div>
                      </div>
                      <Badge
                        variant={client.typeClient === 'GRAND_COMPTE' ? 'default' : 'secondary'}
                        className={client.typeClient === 'GRAND_COMPTE'
                          ? 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm'
                          : 'bg-slate-100 text-slate-700 shadow-sm'
                        }
                      >
                        {client.typeClient === 'GRAND_COMPTE' ? (
                          <>
                            <Crown className="mr-1 h-3 w-3" />
                            VIP
                          </>
                        ) : 'Normal'}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="mr-2 h-3 w-3 text-slate-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="mr-2 h-3 w-3 text-slate-400" />
                        {client.telephone}
                      </div>
                      {client.entreprise && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Building className="mr-2 h-3 w-3 text-slate-400" />
                          <span className="truncate">{client.entreprise}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Car className="h-3 w-3 text-slate-400" />
                          <span>{vehiculesCount(client.id)} véhicule{vehiculesCount(client.id) > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{new Date(client.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
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
                              <Mail className="mr-2 h-4 w-4" />
                              Envoyer un email
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
          {filteredClients.length > 0 && totalPages > 1 && (
            <Card className="md:hidden border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">{filteredClients.length}</span> client{filteredClients.length > 1 ? 's' : ''}
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