'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings,
  Mail,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Plus,
  Save,
  Eye,
  Calendar,
  DollarSign,
  Receipt,
  Users,
  Send,
  Trash2
} from 'lucide-react'

interface ReportingConfig {
  heureEnvoi: string
  emails: string[]
  contenuRapport: {
    odr: boolean
    paiement: boolean
    facture: boolean
    nouveauxClients: boolean
  }
}

interface ReportingConfigProps {
  config?: ReportingConfig
  onSave: (config: ReportingConfig) => void
  isLoading?: boolean
}

export function ReportingConfig({ 
  config,
  onSave,
  isLoading = false 
}: ReportingConfigProps) {
  const [formData, setFormData] = useState<ReportingConfig>({
    heureEnvoi: config?.heureEnvoi || '08:00',
    emails: config?.emails || [],
    contenuRapport: {
      odr: config?.contenuRapport?.odr || false,
      paiement: config?.contenuRapport?.paiement || false,
      facture: config?.contenuRapport?.facture || false,
      nouveauxClients: config?.contenuRapport?.nouveauxClients || false
    }
  })

  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddEmail = () => {
    if (!newEmail.trim()) {
      setEmailError('Veuillez saisir une adresse email')
      return
    }

    if (!validateEmail(newEmail)) {
      setEmailError('Format d\'email invalide')
      return
    }

    if (formData.emails.includes(newEmail)) {
      setEmailError('Cette adresse email existe déjà')
      return
    }

    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, newEmail]
    }))
    setNewEmail('')
    setEmailError('')
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter(email => email !== emailToRemove)
    }))
  }

  const handleContentChange = (field: keyof ReportingConfig['contenuRapport'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      contenuRapport: {
        ...prev.contenuRapport,
        [field]: checked
      }
    }))
  }

  const handleSave = () => {
    onSave(formData)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const selectedContentCount = Object.values(formData.contenuRapport).filter(Boolean).length
  const isConfigValid = formData.emails.length > 0 && selectedContentCount > 0

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'odr':
        return <FileText className="h-4 w-4" />
      case 'paiement':
        return <DollarSign className="h-4 w-4" />
      case 'facture':
        return <Receipt className="h-4 w-4" />
      case 'nouveauxClients':
        return <Users className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getContentDescription = (type: string) => {
    switch (type) {
      case 'odr':
        return 'Statistiques des ordres de réparation (en cours, terminés, facturés)'
      case 'paiement':
        return 'Récapitulatif des paiements reçus et en attente'
      case 'facture':
        return 'État des factures émises et leur statut de paiement'
      case 'nouveauxClients':
        return 'Liste et statistiques des nouveaux clients inscrits'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Configuration du Reporting</h4>
              <p className="text-sm text-slate-600 font-normal">Paramétrez l'envoi automatique de vos rapports</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Configuration Section */}
      <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Configuration d'Envoi</h4>
              <p className="text-sm text-slate-600 font-normal">Définissez quand et à qui envoyer les rapports</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Heure d'envoi */}
          <div className="space-y-2">
            <Label htmlFor="heureEnvoi" className="font-medium">
              Heure d'envoi quotidien <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="heureEnvoi"
                type="time"
                value={formData.heureEnvoi}
                onChange={(e) => setFormData(prev => ({ ...prev, heureEnvoi: e.target.value }))}
                className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
              />
              <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            </div>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  Envoi quotidien programmé à {formData.heureEnvoi}
                </span>
              </div>
            </div>
          </div>

          {/* Gestion des emails */}
          <div className="space-y-4">
            <Label className="font-medium">
              Destinataires <span className="text-red-500">*</span>
            </Label>
            
            {/* Ajout d'email */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value)
                      if (emailError) setEmailError('')
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                    placeholder="exemple@entreprise.com"
                    className={`pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors ${
                      emailError ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''
                    }`}
                  />
                </div>
                <Button 
                  onClick={handleAddEmail}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              {emailError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {emailError}
                </div>
              )}
            </div>

            {/* Liste des emails */}
            <div className="space-y-2">
              {formData.emails.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Destinataires configurés ({formData.emails.length})
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.emails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">{email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                  <Mail className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Aucun destinataire configuré</p>
                  <p className="text-slate-400 text-xs">Ajoutez au moins une adresse email</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu du rapport */}
      <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Contenu du Rapport</h4>
              <p className="text-sm text-slate-600 font-normal">Sélectionnez les sections à inclure dans vos rapports</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* ODR */}
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="odr"
                  checked={formData.contenuRapport.odr}
                  onCheckedChange={(checked) => handleContentChange('odr', !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-blue-100 rounded">
                      {getContentIcon('odr')}
                    </div>
                    <Label htmlFor="odr" className="font-medium cursor-pointer">
                      Ordres de Réparation (ODR)
                    </Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    {getContentDescription('odr')}
                  </p>
                </div>
              </div>
            </div>

            {/* Paiements */}
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="paiement"
                  checked={formData.contenuRapport.paiement}
                  onCheckedChange={(checked) => handleContentChange('paiement', !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-green-100 rounded">
                      {getContentIcon('paiement')}
                    </div>
                    <Label htmlFor="paiement" className="font-medium cursor-pointer">
                      Paiements
                    </Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    {getContentDescription('paiement')}
                  </p>
                </div>
              </div>
            </div>

            {/* Factures */}
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="facture"
                  checked={formData.contenuRapport.facture}
                  onCheckedChange={(checked) => handleContentChange('facture', !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-purple-100 rounded">
                      {getContentIcon('facture')}
                    </div>
                    <Label htmlFor="facture" className="font-medium cursor-pointer">
                      Factures
                    </Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    {getContentDescription('facture')}
                  </p>
                </div>
              </div>
            </div>

            {/* Nouveaux clients */}
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="nouveauxClients"
                  checked={formData.contenuRapport.nouveauxClients}
                  onCheckedChange={(checked) => handleContentChange('nouveauxClients', !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-orange-100 rounded">
                      {getContentIcon('nouveauxClients')}
                    </div>
                    <Label htmlFor="nouveauxClients" className="font-medium cursor-pointer">
                      Nouveaux Clients
                    </Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    {getContentDescription('nouveauxClients')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {selectedContentCount === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-amber-200 bg-amber-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="text-amber-700 text-sm font-medium">Aucune section sélectionnée</p>
              <p className="text-amber-600 text-xs">Choisissez au moins une section pour votre rapport</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prévisualisation */}
      {selectedContentCount > 0 && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Eye className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Prévisualisation</h4>
                <p className="text-sm text-slate-600 font-normal">Aperçu du rapport qui sera envoyé</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Send className="h-5 w-5" />
                  Rapport Quotidien - {new Date().toLocaleDateString('fr-FR')}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Heure d'envoi:</span>
                    <span className="font-medium text-slate-900">{formData.heureEnvoi}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Destinataires:</span>
                    <span className="font-medium text-slate-900">{formData.emails.length} adresse{formData.emails.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Sections incluses:</span>
                    <span className="font-medium text-slate-900">{selectedContentCount} section{selectedContentCount > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Contenu du rapport:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.contenuRapport.odr && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        <FileText className="h-3 w-3 mr-1" />
                        ODR
                      </Badge>
                    )}
                    {formData.contenuRapport.paiement && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Paiements
                      </Badge>
                    )}
                    {formData.contenuRapport.facture && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        <Receipt className="h-3 w-3 mr-1" />
                        Factures
                      </Badge>
                    )}
                    {formData.contenuRapport.nouveauxClients && (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                        <Users className="h-3 w-3 mr-1" />
                        Nouveaux Clients
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <Card className="border border-green-200 bg-green-50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Configuration sauvegardée avec succès!</p>
                <p className="text-sm text-green-700">Vos rapports seront envoyés automatiquement selon vos paramètres.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <Card className="border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isConfigValid ? 'bg-green-100' : 'bg-amber-100'}`}>
                {isConfigValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
              </div>
              <div>
                <p className={`font-medium ${isConfigValid ? 'text-slate-900' : 'text-amber-800'}`}>
                  {isConfigValid ? 'Configuration prête' : 'Configuration incomplète'}
                </p>
                <p className={`text-sm ${isConfigValid ? 'text-slate-600' : 'text-amber-600'}`}>
                  {isConfigValid 
                    ? 'Vous pouvez sauvegarder vos paramètres'
                    : 'Ajoutez au moins un email et sélectionnez une section'
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSave}
              disabled={!isConfigValid || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder la Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}