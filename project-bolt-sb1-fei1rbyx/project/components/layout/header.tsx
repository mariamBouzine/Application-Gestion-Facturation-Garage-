'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Search, Settings, User, LogOut } from 'lucide-react'

const pageNames: Record<string, string> = {
  '/': 'Tableau de Bord',
  '/clients': 'Gestion des Clients',
  '/vehicules': 'Gestion des Véhicules',
  '/devis': 'Gestion des Devis',
  '/odr': 'Ordres de Réparation',
  '/factures': 'Gestion des Factures',
  '/prestations': 'Catalogue des Prestations',
  '/prestations/carrosserie': 'Prestations Carrosserie',
  '/prestations/mecanique': 'Prestations Mécanique',
  '/creances': 'Remplissage de Créance',
  '/camera': 'Gestion des Caméras',
  '/reporting': 'Configuration Reporting',
  '/parametres': 'Paramètres Système',
  '/mail': 'Boîte Mail',
  '/profil': 'Mon Profil'
}

export function Header() {
  const pathname = usePathname()
  const currentPageName = pageNames[pathname] || 'Page'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {currentPageName}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="w-[300px] pl-10"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>GP</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Garage Pro</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@mongarage.fr
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}