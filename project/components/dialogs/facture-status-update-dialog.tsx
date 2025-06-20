'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    CheckCircle,
    AlertTriangle,
    Clock,
    X,
    Loader2,
    Calendar as CalendarIcon,
    CreditCard
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Facture {
    id: string
    numeroFacture: string
    clientNom: string
    montantTTC: number
    statut: string
    modePaiement: string | null
    dateReglement: Date | null
}

interface FactureStatusUpdateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    facture: Facture | null
    onConfirm: (factureId: string, newStatut: string, modePaiement?: string, dateReglement?: Date) => void
    isLoading?: boolean
}

export function FactureStatusUpdateDialog({
    open,
    onOpenChange,
    facture,
    onConfirm,
    isLoading = false
}: FactureStatusUpdateDialogProps) {

    const [newStatut, setNewStatut] = useState('')
    const [modePaiement, setModePaiement] = useState('')
    const [dateReglement, setDateReglement] = useState<Date | undefined>(new Date())

    if (!facture) return null

    const handleConfirm = () => {
        onConfirm(facture.id, newStatut, modePaiement, dateReglement)
    }

    const handleCancel = () => {
        onOpenChange(false)
        setNewStatut('')
        setModePaiement('')
        setDateReglement(new Date())
    }

    const getStatutIcon = (statut: string) => {
        switch (statut) {
            case 'PAYEE':
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case 'IMPAYEE':
                return <AlertTriangle className="h-4 w-4 text-red-600" />
            case 'PARTIELLEMENT_PAYEE':
                return <Clock className="h-4 w-4 text-orange-600" />
            case 'EN_ATTENTE':
                return <Clock className="h-4 w-4 text-blue-600" />
            case 'ANNULEE':
                return <X className="h-4 w-4 text-gray-600" />
            default:
                return null
        }
    }

    const needsPaymentInfo = newStatut === 'PAYEE' || newStatut === 'PARTIELLEMENT_PAYEE'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        Mettre à jour le statut
                    </DialogTitle>
                    <DialogDescription>
                        Modifier le statut de la facture <span className="font-semibold">{facture.numeroFacture}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Current Status */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Statut actuel</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatutIcon(facture.statut)}
                                    <span className="text-sm text-slate-600">
                                        {facture.statut === 'PAYEE' ? 'Payée' :
                                            facture.statut === 'EN_ATTENTE' ? 'En attente' :
                                                facture.statut === 'IMPAYEE' ? 'Impayée' :
                                                    facture.statut === 'PARTIELLEMENT_PAYEE' ? 'Partiellement payée' :
                                                        facture.statut === 'ANNULEE' ? 'Annulée' : facture.statut}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-slate-900">
                                    {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(facture.montantTTC)}
                                </p>
                                <p className="text-sm text-slate-600">{facture.clientNom}</p>
                            </div>
                        </div>
                    </div>

                    {/* New Status Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="newStatut">Nouveau statut *</Label>
                        <Select value={newStatut} onValueChange={setNewStatut}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un nouveau statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PAYEE">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Payée
                                    </div>
                                </SelectItem>
                                <SelectItem value="PARTIELLEMENT_PAYEE">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange-600" />
                                        Partiellement payée
                                    </div>
                                </SelectItem>
                                <SelectItem value="IMPAYEE">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        Impayée
                                    </div>
                                </SelectItem>
                                <SelectItem value="EN_ATTENTE">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        En attente
                                    </div>
                                </SelectItem>
                                <SelectItem value="ANNULEE">
                                    <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-gray-600" />
                                        Annulée
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Information (conditionally shown) */}
                    {needsPaymentInfo && (
                        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800 font-medium">
                                <CreditCard className="h-4 w-4" />
                                Informations de paiement
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modePaiement">Mode de paiement *</Label>
                                <Select value={modePaiement} onValueChange={setModePaiement}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le mode de paiement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ESPECES">Espèces</SelectItem>
                                        <SelectItem value="CHEQUE">Chèque</SelectItem>
                                        <SelectItem value="VIREMENT">Virement</SelectItem>
                                        <SelectItem value="TPE_VIVAWALLET">TPE Vivawallet</SelectItem>
                                        <SelectItem value="CREDIT_INTERNE">Crédit Interne</SelectItem>
                                        <SelectItem value="MIXTE">Mixte</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateReglement">Date de règlement *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateReglement ? format(dateReglement, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dateReglement}
                                            onSelect={setDateReglement}
                                            disabled={(date) => date > new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {newStatut && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                                <CheckCircle className="h-4 w-4" />
                                Aperçu des modifications
                            </div>
                            <div className="text-sm text-blue-700">
                                La facture {facture.numeroFacture} passera au statut:{' '}
                                <span className="font-bold">
                                    {newStatut === 'PAYEE' ? 'Payée' :
                                        newStatut === 'EN_ATTENTE' ? 'En attente' :
                                            newStatut === 'IMPAYEE' ? 'Impayée' :
                                                newStatut === 'PARTIELLEMENT_PAYEE' ? 'Partiellement payée' :
                                                    newStatut === 'ANNULEE' ? 'Annulée' : newStatut}
                                </span>
                                {needsPaymentInfo && modePaiement && dateReglement && (
                                    <>
                                        <br />
                                        Mode de paiement: <span className="font-bold">{
                                            modePaiement === 'ESPECES' ? 'Espèces' :
                                                modePaiement === 'CHEQUE' ? 'Chèque' :
                                                    modePaiement === 'VIREMENT' ? 'Virement' :
                                                        modePaiement === 'TPE_VIVAWALLET' ? 'TPE Vivawallet' :
                                                            modePaiement === 'CREDIT_INTERNE' ? 'Crédit Interne' :
                                                                modePaiement === 'MIXTE' ? 'Mixte' : modePaiement
                                        }</span>
                                        <br />
                                        Date de règlement: <span className="font-bold">{format(dateReglement, 'dd/MM/yyyy', { locale: fr })}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="hover:bg-slate-100 transition-colors"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !newStatut || (needsPaymentInfo && (!modePaiement || !dateReglement))}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mise à jour...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mettre à jour
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}