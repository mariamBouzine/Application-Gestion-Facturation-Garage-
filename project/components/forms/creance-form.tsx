'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  FileText, 
  Search,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calculator,
  Settings,
  ExternalLink,
  FileDown,
  Calendar,
  User,
  Car,
  Euro,
  Filter,
  Clock,
  Archive
} from 'lucide-react'

interface ODR {
  id: string
  numeroODR: string
  clientNom: string
  vehicule: string
  montantTotal: number
  dateCreation: Date
  statut: 'EN_COURS' | 'TERMINE' | 'FACTURE'
}

interface ModeleCreance {
  id: string
  nom: string
  description: string
  typeDocument: 'MISE_EN_DEMEURE' | 'RELANCE' | 'SOMMATION'
}

interface ResultatCreance {
  id: string
  odr: ODR
  modeleUtilise: ModeleCreance
  lienTelechargement: string
  dateGeneration: Date
  statut: 'GENERE' | 'TELECHARGE'
}

interface CreanceFormProps {
  odrs: ODR[]
  modelesCreance: ModeleCreance[]
  resultats: ResultatCreance[]
  onGenerer: (odrId: string, modeleId: string) => void
  isLoading?: boolean
}

export function CreanceForm({ 
  odrs, 
  modelesCreance, 
  resultats, 
  onGenerer,
  isLoading = false 
}: CreanceFormProps) {
  const [selectedODR, setSelectedODR] = useState('')
  const [selectedModele, setSelectedModele] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errors, setErrors] = useState<{ odr?: string; modele?: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { odr?: string; modele?: string } = {}

    if (!selectedODR) newErrors.odr = 'Veuillez sélectionner un ODR'
    if (!selectedModele) newErrors.modele = 'Veuillez choisir un modèle de créance'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerer = () => {
    if (validateForm()) {
      onGenerer(selectedODR, selectedModele)
    }
  }

  const handleInputChange = (field: 'odr' | 'modele', value: string) => {
    if (field === 'odr') setSelectedODR(value)
    if (field === 'modele') setSelectedModele(value)
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Filter ODRs based on search term
  const filteredODRs = odrs.filter(odr => 
    odr.numeroODR.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odr.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odr.vehicule.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedODRData = odrs.find(odr => odr.id === selectedODR)
  const selectedModeleData = modelesCreance.find(modele => modele.id === selectedModele)

  const getStatutBadge = (statut: ODR['statut']) => {
    switch (statut) {
      case 'EN_COURS':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700">En cours</Badge>
      case 'TERMINE':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Terminé</Badge>
      case 'FACTURE':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Facturé</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const getTypeDocumentBadge = (type: ModeleCreance['typeDocument']) => {
    switch (type) {
      case 'MISE_EN_DEMEURE':
        return <Badge variant="destructive" className="bg-red-100 text-red-700">Mise en demeure</Badge>
      case 'RELANCE':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Relance</Badge>
      case 'SOMMATION':
        return <Badge variant="destructive" className="bg-red-100 text-red-700">Sommation</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Sélection ODR et Modèle */}
      <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Génération de Créance</h4>
              <p className="text-sm text-slate-600 font-normal">Sélectionnez l'ODR et le modèle de document</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recherche ODR */}
          <div className="space-y-2">
            <Label className="font-medium">Rechercher un ODR</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par numéro ODR, client ou véhicule..."
                className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
              />
              {searchTerm && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  {filteredODRs.length} résultat{filteredODRs.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            {searchTerm && filteredODRs.length === 0 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Aucun ODR trouvé pour cette recherche
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Sélection ODR */}
            <div className="space-y-2">
              <Label htmlFor="odr" className="font-medium">
                Choisir ODR <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                <Select value={selectedODR} onValueChange={(value) => handleInputChange('odr', value)}>
                  <SelectTrigger className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.odr ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}>
                    <SelectValue placeholder="Sélectionner un ODR" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredODRs.map((odr) => (
                      <SelectItem key={odr.id} value={odr.id}>
                        <div className="flex items-center gap-2 w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">{odr.numeroODR}</span>
                            <span className="text-xs text-slate-500">{odr.clientNom} - {odr.vehicule}</span>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            {getStatutBadge(odr.statut)}
                            <Badge variant="secondary" className="text-xs">
                              {odr.montantTotal.toFixed(2)}€
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!errors.odr && selectedODR && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.odr && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.odr && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.odr}
                </div>
              )}
              {selectedODRData && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">{selectedODRData.numeroODR}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <User className="h-3 w-3" />
                      <span>{selectedODRData.clientNom}</span>
                      <Car className="h-3 w-3 ml-2" />
                      <span>{selectedODRData.vehicule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <Euro className="h-3 w-3" />
                      <span>{selectedODRData.montantTotal.toFixed(2)} €</span>
                      <Calendar className="h-3 w-3 ml-2" />
                      <span>{selectedODRData.dateCreation.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sélection Modèle */}
            <div className="space-y-2">
              <Label htmlFor="modele" className="font-medium">
                Choisir modèle de créance <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Settings className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
                <Select value={selectedModele} onValueChange={(value) => handleInputChange('modele', value)}>
                  <SelectTrigger className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                    errors.modele ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                  }`}>
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelesCreance.map((modele) => (
                      <SelectItem key={modele.id} value={modele.id}>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="font-medium">{modele.nom}</span>
                            <span className="text-xs text-slate-500">{modele.description}</span>
                          </div>
                          <div className="ml-auto">
                            {getTypeDocumentBadge(modele.typeDocument)}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!errors.modele && selectedModele && (
                  <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
                {errors.modele && (
                  <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                )}
              </div>
              {errors.modele && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.modele}
                </div>
              )}
              {selectedModeleData && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">{selectedModeleData.nom}</span>
                    </div>
                    <div className="text-xs text-green-600">
                      {selectedModeleData.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getTypeDocumentBadge(selectedModeleData.typeDocument)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bouton Générer */}
          <div className="pt-4 border-t border-slate-200">
            <Button 
              onClick={handleGenerer} 
              disabled={isLoading || !selectedODR || !selectedModele}
              className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Générer la Créance
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Récapitulatif */}
      {(selectedODRData || selectedModeleData) && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calculator className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Récapitulatif</h4>
                <p className="text-sm text-slate-600 font-normal">Vérifiez les informations avant génération</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ODR sélectionné:
                  </span>
                  <span className="font-medium text-slate-900">
                    {selectedODRData ? selectedODRData.numeroODR : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client:
                  </span>
                  <span className="font-medium text-slate-900">
                    {selectedODRData ? selectedODRData.clientNom : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Modèle de créance:
                  </span>
                  <span className="font-medium text-slate-900">
                    {selectedModeleData ? selectedModeleData.nom : '-'}
                  </span>
                </div>
                {selectedODRData && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      Montant:
                    </span>
                    <span className="font-medium text-slate-900">
                      {selectedODRData.montantTotal.toFixed(2)} €
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Archive className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Historique des Créances</h4>
              <p className="text-sm text-slate-600 font-normal">Documents générés et disponibles au téléchargement</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resultats.length === 0 ? (
            <div className="text-center py-8">
              <Archive className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-2">Aucune créance générée</p>
              <p className="text-sm text-slate-400">Les documents générés apparaîtront ici</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">ODR</TableHead>
                    <TableHead className="font-semibold text-slate-700">Modèle utilisé</TableHead>
                    <TableHead className="font-semibold text-slate-700">Date génération</TableHead>
                    <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultats.map((resultat) => (
                    <TableRow key={resultat.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{resultat.odr.numeroODR}</span>
                          <span className="text-sm text-slate-500">{resultat.odr.clientNom}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{resultat.modeleUtilise.nom}</span>
                          <div className="mt-1">
                            {getTypeDocumentBadge(resultat.modeleUtilise.typeDocument)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          {resultat.dateGeneration.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={resultat.statut === 'TELECHARGE' ? 'default' : 'secondary'}
                          className={resultat.statut === 'TELECHARGE' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {resultat.statut === 'GENERE' ? 'Généré' : 'Téléchargé'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={() => window.open(resultat.lienTelechargement, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}