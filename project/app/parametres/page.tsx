'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Settings, 
  Bot, 
  Mail, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Activity,
  Key,
  Euro,
  Bell,
  TrendingUp,
  Database,
  Smartphone,
  Shield,
  RefreshCw
} from 'lucide-react'

// Mock data for current settings
const mockParametres = {
  activationAgentSuivi: true,
  activationAgentODR: true,
  activationAgentEmails: false,
  apiPennylaneKey: 'pk_live_xxxxxxxxxxxxxxxx',
  apiVivawalletKey: '',
  affichagePrixCarrosserie: true,
  affichagePrixMecanique: true,
  modesPaiementAutorises: ['ESPECES', 'CHEQUE', 'VIREMENT', 'TPE_VIVAWALLET'],
  delaiAlerteEcheance: 3
}

export default function ParametresPage() {
  const [settings, setSettings] = useState(mockParametres)
  const [showPennylaneKey, setShowPennylaneKey] = useState(false)
  const [showVivawalletKey, setShowVivawalletKey] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      await new Promise(resolve => setTimeout(resolve, 700))
      setIsInitialLoading(false)
    }
    loadData()
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saving settings:', settings)
      setHasChanges(false)
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const modesPaiementOptions = [
    { value: 'ESPECES', label: 'Espèces', icon: Euro, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'CHEQUE', label: 'Chèque', icon: CreditCard, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'VIREMENT', label: 'Virement', icon: TrendingUp, color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { value: 'TPE_VIVAWALLET', label: 'TPE Vivawallet', icon: Smartphone, color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { value: 'CREDIT_INTERNE', label: 'Crédit Interne', icon: Shield, color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
    { value: 'MIXTE', label: 'Mixte', icon: RefreshCw, color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' }
  ]

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement des paramètres...</p>
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
                  Paramètres Système
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">Configuration active</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Configuration générale de l'application
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>

          {/* Changes Alert */}
          {hasChanges && (
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-900">Modifications non sauvegardées</p>
                      <p className="text-sm text-orange-700">N'oubliez pas d'enregistrer vos changements</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSave}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Agents Automatiques */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Bot className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Agents Automatiques</h4>
                    <p className="text-sm text-slate-600 font-normal">Services de traitement automatisé</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.activationAgentSuivi ? 'bg-green-100' : 'bg-slate-200'}`}>
                      <Activity className={`h-4 w-4 ${settings.activationAgentSuivi ? 'text-green-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="agent-suivi" className="font-medium">Agent de Suivi</Label>
                      <p className="text-sm text-slate-600">
                        Surveillance automatique des échéances
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="agent-suivi"
                    checked={settings.activationAgentSuivi}
                    onCheckedChange={(checked) => 
                      handleSettingChange('activationAgentSuivi', checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.activationAgentODR ? 'bg-blue-100' : 'bg-slate-200'}`}>
                      <Settings className={`h-4 w-4 ${settings.activationAgentODR ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="agent-odr" className="font-medium">Agent ODR</Label>
                      <p className="text-sm text-slate-600">
                        Gestion automatique des ordres de réparation
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="agent-odr"
                    checked={settings.activationAgentODR}
                    onCheckedChange={(checked) => 
                      handleSettingChange('activationAgentODR', checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.activationAgentEmails ? 'bg-purple-100' : 'bg-slate-200'}`}>
                      <Mail className={`h-4 w-4 ${settings.activationAgentEmails ? 'text-purple-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="agent-emails" className="font-medium">Agent Emails</Label>
                      <p className="text-sm text-slate-600">
                        Envoi automatique d'emails de rappel
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="agent-emails"
                    checked={settings.activationAgentEmails}
                    onCheckedChange={(checked) => 
                      handleSettingChange('activationAgentEmails', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* APIs Externes */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">APIs Externes</h4>
                    <p className="text-sm text-slate-600 font-normal">Intégrations et services tiers</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Database className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <Label htmlFor="pennylane-key" className="font-medium">Clé API Pennylane</Label>
                      <p className="text-xs text-slate-600">Gestion comptable automatisée</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="pennylane-key"
                        type={showPennylaneKey ? 'text' : 'password'}
                        value={settings.apiPennylaneKey}
                        onChange={(e) => 
                          handleSettingChange('apiPennylaneKey', e.target.value)
                        }
                        placeholder="Entrez votre clé API Pennylane"
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPennylaneKey(!showPennylaneKey)}
                      className="hover:bg-slate-100 transition-colors"
                    >
                      {showPennylaneKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {settings.apiPennylaneKey && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">API configurée</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <CreditCard className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <Label htmlFor="vivawallet-key" className="font-medium">Clé API Vivawallet</Label>
                      <p className="text-xs text-slate-600">Terminal de paiement électronique</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="vivawallet-key"
                        type={showVivawalletKey ? 'text' : 'password'}
                        value={settings.apiVivawalletKey}
                        onChange={(e) => 
                          handleSettingChange('apiVivawalletKey', e.target.value)
                        }
                        placeholder="Entrez votre clé API Vivawallet"
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVivawalletKey(!showVivawalletKey)}
                      className="hover:bg-slate-100 transition-colors"
                    >
                      {showVivawalletKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {!settings.apiVivawalletKey && (
                    <div className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      <span className="text-orange-600">API non configurée</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Affichage des Prix */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Affichage des Prix</h4>
                    <p className="text-sm text-slate-600 font-normal">Visibilité des tarifs dans les devis</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.affichagePrixCarrosserie ? 'bg-orange-100' : 'bg-slate-200'}`}>
                      <Euro className={`h-4 w-4 ${settings.affichagePrixCarrosserie ? 'text-orange-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="prix-carrosserie" className="font-medium">Prix Carrosserie</Label>
                      <p className="text-sm text-slate-600">
                        Afficher les prix dans les devis carrosserie
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="prix-carrosserie"
                    checked={settings.affichagePrixCarrosserie}
                    onCheckedChange={(checked) => 
                      handleSettingChange('affichagePrixCarrosserie', checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.affichagePrixMecanique ? 'bg-blue-100' : 'bg-slate-200'}`}>
                      <Euro className={`h-4 w-4 ${settings.affichagePrixMecanique ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="prix-mecanique" className="font-medium">Prix Mécanique</Label>
                      <p className="text-sm text-slate-600">
                        Afficher les prix dans les devis mécanique
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="prix-mecanique"
                    checked={settings.affichagePrixMecanique}
                    onCheckedChange={(checked) => 
                      handleSettingChange('affichagePrixMecanique', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Modes de Paiement et Alertes */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Settings className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Paiements et Alertes</h4>
                    <p className="text-sm text-slate-600 font-normal">Configuration des modes de paiement</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-medium">Modes de Paiement Autorisés</Label>
                  <div className="flex flex-wrap gap-2">
                    {modesPaiementOptions.map((mode) => {
                      const IconComponent = mode.icon
                      const isSelected = settings.modesPaiementAutorises.includes(mode.value)
                      return (
                        <Badge
                          key={mode.value}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                            isSelected ? mode.color : 'hover:bg-slate-100'
                          } flex items-center gap-1.5 px-3 py-1.5`}
                          onClick={() => {
                            const newModes = isSelected
                              ? settings.modesPaiementAutorises.filter(m => m !== mode.value)
                              : [...settings.modesPaiementAutorises, mode.value]
                            handleSettingChange('modesPaiementAutorises', newModes)
                          }}
                        >
                          <IconComponent className="h-3 w-3" />
                          {mode.label}
                        </Badge>
                      )
                    })}
                  </div>
                  <p className="text-xs text-slate-500">Cliquez pour activer/désactiver les modes de paiement</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Bell className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <Label htmlFor="delai-alerte" className="font-medium">Délai d'Alerte Échéance (jours)</Label>
                      <p className="text-xs text-slate-600">Anticipation des notifications</p>
                    </div>
                  </div>
                  <Select
                    value={settings.delaiAlerteEcheance.toString()}
                    onValueChange={(value) => 
                      handleSettingChange('delaiAlerteEcheance', parseInt(value))
                    }
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 jour</SelectItem>
                      <SelectItem value="3">3 jours</SelectItem>
                      <SelectItem value="5">5 jours</SelectItem>
                      <SelectItem value="7">7 jours</SelectItem>
                      <SelectItem value="15">15 jours</SelectItem>
                      <SelectItem value="30">30 jours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-600">
                    Nombre de jours avant échéance pour déclencher une alerte
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Card */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">Configuration Email</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Pour configurer l'envoi d'emails automatiques, assurez-vous que l'agent Email est activé 
                    et que vos paramètres SMTP sont correctement configurés dans les variables d'environnement.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`w-2 h-2 rounded-full ${settings.activationAgentEmails ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-xs font-medium ${settings.activationAgentEmails ? 'text-green-700' : 'text-red-700'}`}>
                      Agent Email {settings.activationAgentEmails ? 'activé' : 'désactivé'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}