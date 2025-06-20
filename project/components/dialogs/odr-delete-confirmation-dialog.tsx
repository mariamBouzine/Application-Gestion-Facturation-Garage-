'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  AlertTriangle,
  Trash2,
  X,
  Loader2
} from 'lucide-react'

interface ODR {
  id: string
  numeroODR: string
  clientNom: string
  immatriculationVehicule: string
  montantTotal: number
  statut: string
  typeService: string
}

interface ODRDeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  odr: ODR | null
  onConfirm: (odrId: string) => void
  isLoading?: boolean
}

export function ODRDeleteConfirmationDialog({
  open,
  onOpenChange,
  odr,
  onConfirm,
  isLoading = false
}: ODRDeleteConfirmationDialogProps) {
  
  if (!odr) return null

  const handleConfirm = () => {
    onConfirm(odr.id)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Supprimer l'ODR ?
            </DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold">l'ODR {odr.numeroODR}</span> ?
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