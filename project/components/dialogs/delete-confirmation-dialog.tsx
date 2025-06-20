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

interface Client {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  entreprise?: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
  numeroClient: string
}

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
  onConfirm: (clientId: string) => void
  isLoading?: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  client,
  onConfirm,
  isLoading = false
}: DeleteConfirmationDialogProps) {
  
  if (!client) return null

  const handleConfirm = () => {
    onConfirm(client.id)
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
              Supprimer le client ?
            </DialogTitle>
            <DialogDescription className="text-slate-600 mt-2">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{client.prenom} {client.nom}</span> ?
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