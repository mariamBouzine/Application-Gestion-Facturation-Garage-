'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Trash2, 
  Star, 
  Reply, 
  Forward, 
  Search,
  Plus,
  Paperclip,
  Clock,
  AlertCircle,
  Loader2,
  Filter,
  MailOpen,
  Users,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Mock data for emails
const mockEmails = [
  {
    id: '1',
    from: 'martin.dubois@email.com',
    fromName: 'Martin Dubois',
    to: 'contact@mongarage.fr',
    subject: 'Demande de devis pour réparation carrosserie',
    body: 'Bonjour,\n\nJe souhaiterais obtenir un devis pour la réparation de mon pare-chocs avant suite à un petit accrochage. Mon véhicule est une Peugeot 308 de 2020, immatriculation AB-123-CD.\n\nPouvez-vous me dire quand je peux passer pour une estimation ?\n\nCordialement,\nMartin Dubois',
    date: new Date('2024-01-20T14:30:00Z'),
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    category: 'DEVIS'
  },
  {
    id: '2',
    from: 'sophie.lambert@transport-lambert.fr',
    fromName: 'Sophie Lambert',
    to: 'contact@mongarage.fr',
    subject: 'Facture FAC-2024-002 - Demande de délai de paiement',
    body: 'Bonjour,\n\nSuite à quelques difficultés de trésorerie temporaires, je vous demande s\'il serait possible d\'obtenir un délai de paiement pour la facture FAC-2024-002 d\'un montant de 1250€.\n\nJe peux vous proposer un règlement en 2 fois : 50% sous 15 jours et le solde sous 30 jours.\n\nMerci de votre compréhension.\n\nCordialement,\nSophie Lambert',
    date: new Date('2024-01-19T16:45:00Z'),
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    category: 'FACTURE'
  },
  {
    id: '3',
    from: 'pierre.martin@email.com',
    fromName: 'Pierre Martin',
    to: 'contact@mongarage.fr',
    subject: 'Remerciements pour la réparation',
    body: 'Bonjour,\n\nJe tenais à vous remercier pour l\'excellent travail effectué sur ma Renault Clio. La réparation a été parfaite et dans les délais annoncés.\n\nJe n\'hésiterai pas à revenir et à vous recommander.\n\nCordialement,\nPierre Martin',
    date: new Date('2024-01-18T10:15:00Z'),
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    category: 'GENERAL'
  }
]

export default function MailPage() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      await new Promise(resolve => setTimeout(resolve, 700))
      setIsInitialLoading(false)
    }
    loadData()
  }, [])

  const filteredEmails = mockEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.body.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'ALL' || email.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const selectedEmailData = selectedEmail ? mockEmails.find(e => e.id === selectedEmail) : null

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DEVIS':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'FACTURE':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
      case 'ODR':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'DEVIS':
        return 'Devis'
      case 'FACTURE':
        return 'Facture'
      case 'ODR':
        return 'ODR'
      default:
        return 'Général'
    }
  }

  const unreadCount = mockEmails.filter(e => !e.isRead).length

  const handleSendEmail = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Sending email:', composeData)
      setComposeData({ to: '', subject: '', body: '' })
      setIsComposeOpen(false)
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement de la boîte mail...</p>
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
                  Boîte Mail
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">Synchronisée</span>
                </div>
              </div>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Gérez vos emails clients et communications
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
              <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Send className="h-4 w-4 text-blue-600" />
                      </div>
                      Composer un message
                    </DialogTitle>
                    <DialogDescription>
                      Envoyer un email à un client
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Destinataire</label>
                      <Input
                        placeholder="email@exemple.com"
                        value={composeData.to}
                        onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Objet</label>
                      <Input
                        placeholder="Objet du message"
                        value={composeData.subject}
                        onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="Votre message..."
                        rows={8}
                        value={composeData.body}
                        onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="hover:bg-slate-50 transition-colors">
                        <Paperclip className="mr-2 h-4 w-4" />
                        Joindre un fichier
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleSendEmail} disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="mr-2 h-4 w-4" />
                          )}
                          {isLoading ? 'Envoi...' : 'Envoyer'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Emails</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{mockEmails.length}</div>
                <p className="text-xs text-slate-600 mt-1">Messages reçus</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Non Lus</CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MailOpen className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
                <p className="text-xs text-slate-600 mt-1">À traiter</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Favoris</CardTitle>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {mockEmails.filter(e => e.isStarred).length}
                </div>
                <p className="text-xs text-slate-600 mt-1">Marqués importants</p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Aujourd'hui</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockEmails.filter(e => 
                    format(e.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ).length}
                </div>
                <p className="text-xs text-slate-600 mt-1">Reçus aujourd'hui</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Rechercher dans les emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] border-slate-200 focus:border-blue-300 focus:ring-blue-200">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toutes les catégories</SelectItem>
                      <SelectItem value="DEVIS">Devis</SelectItem>
                      <SelectItem value="FACTURE">Factures</SelectItem>
                      <SelectItem value="ODR">ODR</SelectItem>
                      <SelectItem value="GENERAL">Général</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Interface */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Email List */}
            <Card className="lg:col-span-1 border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Inbox className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900">Boîte de Réception</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2 bg-red-100 text-red-800 hover:bg-red-200">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-1 p-4">
                    {filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedEmail === email.id 
                            ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' 
                            : 'hover:bg-slate-50 border border-transparent'
                        } ${!email.isRead ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500' : ''}`}
                        onClick={() => setSelectedEmail(email.id)}
                      >
                        <div className="flex items-start justify-between space-x-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className={`text-sm truncate ${!email.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                                {email.fromName}
                              </p>
                              {email.isStarred && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              )}
                              {email.hasAttachment && (
                                <Paperclip className="h-3 w-3 text-slate-400" />
                              )}
                            </div>
                            <p className={`text-sm truncate mb-2 ${!email.isRead ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                              {email.subject}
                            </p>
                            <p className="text-xs text-slate-500 truncate mb-3">
                              {email.body.substring(0, 50)}...
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={`text-xs ${getCategoryColor(email.category)}`}>
                                {getCategoryLabel(email.category)}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {format(email.date, 'dd/MM HH:mm', { locale: fr })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Email Content */}
            <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-slate-900">
                    {selectedEmailData ? 'Lecture du Message' : 'Sélectionnez un Email'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmailData ? (
                  <div className="space-y-6">
                    {/* Email Header */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{selectedEmailData.subject}</h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span><strong>De:</strong> {selectedEmailData.fromName} &lt;{selectedEmailData.from}&gt;</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span><strong>À:</strong> {selectedEmailData.to}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-slate-500">
                              {format(selectedEmailData.date, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                            </span>
                            <Badge variant="outline" className={getCategoryColor(selectedEmailData.category)}>
                              {getCategoryLabel(selectedEmailData.category)}
                            </Badge>
                            {selectedEmailData.hasAttachment && (
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                <Paperclip className="mr-1 h-3 w-3" />
                                Pièce jointe
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm" className="hover:bg-yellow-50 hover:border-yellow-200">
                            <Star className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                            <Archive className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Separator />
                    </div>

                    {/* Email Body */}
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <pre className="whitespace-pre-wrap text-sm font-sans text-slate-700 leading-relaxed">
                          {selectedEmailData.body}
                        </pre>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Reply className="mr-2 h-4 w-4" />
                        Répondre
                      </Button>
                      <Button variant="outline" className="hover:bg-slate-50 transition-colors">
                        <Forward className="mr-2 h-4 w-4" />
                        Transférer
                      </Button>
                      <Button variant="outline" className="hover:bg-slate-50 transition-colors">
                        <Archive className="mr-2 h-4 w-4" />
                        Archiver
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-slate-400">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto">
                        <Mail className="h-12 w-12 opacity-50" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-600">Sélectionnez un email</p>
                        <p className="text-sm text-slate-500">Choisissez un message dans la liste pour le lire</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}