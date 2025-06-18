'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Plus,
  Eye,
  Phone,
  Camera,
  Download,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

// Types
interface CameraCapture {
  id: string
  immatriculation: string
  dateCapture: Date
  dateSortie: Date
  statut: 'EN_COURS' | 'SORTIE'
  client: {
    nom: string
    prenom: string
    entreprise?: string
    telephone: string
  }
  numeroODR: string
  imageIn: string
  imageOut: string
}

// Mock data
const mockCaptures: CameraCapture[] = [
  {
    id: '1',
    immatriculation: 'QJ-458-AL',
    dateCapture: new Date('2024-06-18T10:00:00'),
    dateSortie: new Date('2024-06-18T16:00:00'),
    statut: 'SORTIE',
    client: {
      nom: 'DUPONT',
      prenom: 'martin',
      entreprise: 'Entreprise',
      telephone: '+33123456789'
    },
    numeroODR: 'ODR-2024-001',
    imageIn: '/images/capture-in-1.jpg',
    imageOut: '/images/capture-out-1.jpg'
  },
  {
    id: '2',
    immatriculation: 'BM-789-XY',
    dateCapture: new Date('2024-06-18T08:30:00'),
    dateSortie: new Date('2024-06-18T14:30:00'),
    statut: 'EN_COURS',
    client: {
      nom: 'BERNARD',
      prenom: 'sophie',
      entreprise: 'Auto Plus',
      telephone: '+33198765432'
    },
    numeroODR: 'ODR-2024-002',
    imageIn: '/images/capture-in-2.jpg',
    imageOut: '/images/capture-out-2.jpg'
  },
  {
    id: '3',
    immatriculation: 'CD-123-EF',
    dateCapture: new Date('2024-06-18T11:15:00'),
    dateSortie: new Date('2024-06-18T17:45:00'),
    statut: 'SORTIE',
    client: {
      nom: 'MOREAU',
      prenom: 'pierre',
      telephone: '+33147258369'
    },
    numeroODR: 'ODR-2024-003',
    imageIn: '/images/capture-in-3.jpg',
    imageOut: '/images/capture-out-3.jpg'
  }
]

export default function CameraPage() {
  const [captures, setCaptures] = useState<CameraCapture[]>(mockCaptures)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Filter captures based on search term
  const filteredCaptures = captures.filter(capture => 
    capture.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capture.client.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImageView = (imageUrl: string, type: 'IN' | 'OUT') => {
    toast.info(`Affichage image ${type}: ${imageUrl}`)
    // In a real app, you would open the image in a modal or new window
  }

  const handlePhoneCall = (telephone: string) => {
    toast.info(`Appeler: ${telephone}`)
    // In a real app, you would initiate a phone call
  }

  const handleODRClick = (numeroODR: string) => {
    toast.info(`Ouvrir ODR: ${numeroODR}`)
    // In a real app, you would navigate to the ODR details
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-medium text-gray-900 mb-4">Camera Manager</h1>
        
        {/* Search and Controls */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">List :</span>
            <span className="text-sm text-gray-600">search by</span>
            <span className="text-sm font-medium text-gray-900">Immat, client</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-8 w-64 h-8 text-sm border-gray-300"
              />
            </div>
            <Button 
              size="sm"
              className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Camera className="mr-1 h-3 w-3" />
              Nouvelle Capture
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="h-8 text-xs"
            >
              <Settings className="mr-1 h-3 w-3" />
              Paramètres
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3 w-24">Images</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3 w-32">Immatriculation</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3 w-36">Date Capture In</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3 w-36">Date Capture Out</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3 w-32">Statut</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3">Client</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3 w-28">Tel</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 py-2 px-3 w-36">Liste ODR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCaptures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500 text-sm">
                  {searchTerm ? 'Aucune capture trouvée pour cette recherche' : 'Aucune capture disponible'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCaptures.map((capture) => (
                <TableRow key={capture.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="py-2 px-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleImageView(capture.imageIn, 'IN')}
                        className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                        title="Image d'entrée"
                      >
                        <Eye className="h-3 w-3 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleImageView(capture.imageOut, 'OUT')}
                        className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                        title="Image de sortie"
                      >
                        <Eye className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-3 text-sm font-mono">
                    {capture.immatriculation}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-sm">
                    {capture.dateCapture.toLocaleDateString('fr-FR')} à {capture.dateCapture.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-sm">
                    {capture.dateSortie.toLocaleDateString('fr-FR')} à {capture.dateSortie.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="py-2 px-3">
                    <Badge 
                      variant={capture.statut === 'SORTIE' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        capture.statut === 'SORTIE' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      {capture.statut === 'SORTIE' ? 'sortie' : 'sortie'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 px-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {capture.client.nom} <span className="underline">{capture.client.prenom}</span>
                        {capture.client.entreprise && `(${capture.client.entreprise})`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-6 w-6 hover:bg-blue-50"
                      onClick={() => handlePhoneCall(capture.client.telephone)}
                      title={capture.client.telephone}
                    >
                      <Phone className="h-3 w-3 text-gray-600" />
                    </Button>
                  </TableCell>
                  <TableCell className="py-2 px-3">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 text-xs underline"
                      onClick={() => handleODRClick(capture.numeroODR)}
                    >
                      {capture.numeroODR}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      {filteredCaptures.length > 0 && (
        <div className="mt-4 text-xs text-gray-500">
          {filteredCaptures.length} résultat{filteredCaptures.length > 1 ? 's' : ''} 
          {searchTerm && ` pour "${searchTerm}"`}
        </div>
      )}
    </div>
  )
}