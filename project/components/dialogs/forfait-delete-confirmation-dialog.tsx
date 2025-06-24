'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle,
  Trash2,
  X,
  Loader2,
  Car,
  Receipt
} from 'lucide-react'

interface Forfait {
  id: string
  nom: string
  description: string
  marqueVehicule: string
  modeleVehicule: string
  prixDeBase: number
  tva: number
  unite: string
  uniteAutre?: string
  prestationId: string
}

interface ForfaitDeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  forfait: Forfait | null
  onConfirm: (forfaitId: string) => void
  isLoading?: boolean
}

export function ForfaitDeleteConfirmationDialog({
  open,
  onOpenChange,
  forfait,
  onConfirm,
  isLoading = false
}: ForfaitDeleteConfirmationDialogProps) {
  
  if (!forfait) return null

  const handleConfirm = () => {
    onConfirm(forfait.id)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const calculatePrixTTC = () => {
    return forfait.prixDeBase * (1 + forfait.tva / 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Supprimer le forfait ?
            </DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              Êtes-vous sûr de vouloir supprimer le forfait <span className="font-semibold">"{forfait.nom}"</span> ?
              <br />
              Cette action est irréversible.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 hover:bg-slate-100 transition-colors"
          >
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}