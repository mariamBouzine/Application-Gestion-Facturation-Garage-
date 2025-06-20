'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Save,
  AlertTriangle,
  CheckCircle,
  Camera,
  Shield,
  Key,
  Loader2,
  Calendar,
  Clock,
  Edit,
  Settings,
  UserCheck,
  Lock,
  RefreshCw
} from 'lucide-react'

// Mock data for current user profile
const mockProfile = {
  nom: 'Garage Pro',
  prenom: 'Admin',
  email: 'admin@mongarage.fr',
  telephone: '01.23.45.67.89',
  adresse: '123 Rue de l\'Automobile',
  ville: 'Paris',
  codePostal: '75001',
  entreprise: 'Mon Garage SARL',
  siret: '12345678901234',
  role: 'ADMIN',
  avatar: null,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  lastLogin: new Date('2024-01-20T08:30:00Z')
}

export default function ProfilPage() {
  const [profile, setProfile] = useState(mockProfile)
  const [hasChanges, setHasChanges] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
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

  const handleProfileChange = (key: string, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saving profile:', profile)
      setHasChanges(false)
      // Show success message
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = () => {
    // In production, this would handle password change
    console.log('Changing password')
    setIsChangingPassword(false)
    // Show success message
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement du profil...</p>
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
                  Mon Profil
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">Compte actif</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Gérez vos informations personnelles et paramètres de compte
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
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

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Picture & Basic Info */}
            <Card className="lg:col-span-1 border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Photo de Profil</h4>
                    <p className="text-sm text-slate-600 font-normal">Avatar et informations de base</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 p-4 rounded-lg bg-slate-50">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={profile.avatar || undefined} alt="Profile" />
                      <AvatarFallback className="text-lg bg-blue-100 text-blue-600 font-semibold">
                        {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* <div className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 rounded-full">
                      <Camera className="h-3 w-3 text-white" />
                    </div> */}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900">{profile.prenom} {profile.nom}</h3>
                    <p className="text-sm text-slate-600">{profile.email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Rôle: </Label>
                        <Badge variant="default" className="mt-1 bg-green-100 text-green-800 hover:bg-green-200">
                          
                           Administrateur
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Membre depuis</Label>
                        <p className="text-sm text-slate-600">{profile.createdAt.toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Dernière connexion</Label>
                        <p className="text-sm text-slate-600">
                          {profile.lastLogin.toLocaleDateString('fr-FR')} à {profile.lastLogin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Informations Personnelles</h4>
                    <p className="text-sm text-slate-600 font-normal">Vos données personnelles et de contact</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prenom" className="font-medium">Prénom</Label>
                    <div className="relative">
                      <Input
                        id="prenom"
                        value={profile.prenom}
                        onChange={(e) => handleProfileChange('prenom', e.target.value)}
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="font-medium">Nom</Label>
                    <Input
                      id="nom"
                      value={profile.nom}
                      onChange={(e) => handleProfileChange('nom', e.target.value)}
                      className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone" className="font-medium">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="telephone"
                      value={profile.telephone}
                      onChange={(e) => handleProfileChange('telephone', e.target.value)}
                      className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse" className="font-medium">Adresse</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="adresse"
                      value={profile.adresse}
                      onChange={(e) => handleProfileChange('adresse', e.target.value)}
                      className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ville" className="font-medium">Ville</Label>
                    <Input
                      id="ville"
                      value={profile.ville}
                      onChange={(e) => handleProfileChange('ville', e.target.value)}
                      className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codePostal" className="font-medium">Code Postal</Label>
                    <Input
                      id="codePostal"
                      value={profile.codePostal}
                      onChange={(e) => handleProfileChange('codePostal', e.target.value)}
                      className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Informations Entreprise</h4>
                    <p className="text-sm text-slate-600 font-normal">Données légales et commerciales</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="entreprise" className="font-medium">Nom de l'Entreprise</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="entreprise"
                      value={profile.entreprise}
                      onChange={(e) => handleProfileChange('entreprise', e.target.value)}
                      className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siret" className="font-medium">SIRET</Label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="siret"
                      value={profile.siret}
                      onChange={(e) => handleProfileChange('siret', e.target.value)}
                      placeholder="12345678901234"
                      className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Numéro d'identification de votre entreprise</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="lg:col-span-1 border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Lock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Sécurité</h4>
                    <p className="text-sm text-slate-600 font-normal">Gestion des accès et authentification</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Key className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="font-medium">Mot de passe</Label>
                        <p className="text-sm text-slate-600">
                          Dernière modification il y a 30 jours
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </Button>
                  </div>

                  <Separator />

                  <div className="p-4 rounded-lg bg-slate-50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Shield className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <Label className="font-medium">Authentification à deux facteurs</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-600">Non configurée</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Configurer 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Message */}
          {!hasChanges && (
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-1">Profil à jour</h4>
                    <p className="text-sm text-green-700">
                      Toutes vos informations sont synchronisées et sauvegardées.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}