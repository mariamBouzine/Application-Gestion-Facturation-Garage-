'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  Receipt,
  Package,
  Settings,
  Mail,
  User,
  ChevronLeft,
  Wrench,
  PaintBucket,
  Menu,
  ChevronDown,
  Camera,
  BarChart3,
  Scale,
  AlertTriangle
} from 'lucide-react'

const menuItems = [
  {
    title: 'Tableau de Bord',
    href: '/',
    icon: LayoutDashboard
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users
  },
  {
    title: 'Véhicules',
    href: '/vehicules',
    icon: Car
  },
  {
    title: 'Devis',
    href: '/devis',
    icon: FileText
  },
  {
    title: 'Ordres de Réparation',
    href: '/odr',
    icon: Wrench
  },
  {
    title: 'Factures',
    href: '/factures',
    icon: Receipt
  },
  {
    title: 'Prestations',
    href: '/prestations',
    icon: Package,
    hasSubmenu: true,
    submenu: [
      {
        title: 'Carrosserie',
        href: '/prestations?tab=carrosserie',
        icon: PaintBucket
      },
      {
        title: 'Mécanique',
        href: '/prestations?tab=mecanique',
        icon: Wrench
      }
    ]
  },
  {
    title: 'Créances',
    href: '/creances',
    icon: Scale
  },
  {
    title: 'Camera Manager',
    href: '/camera',
    icon: Camera
  },
  {
    title: 'Reporting',
    href: '/reporting',
    icon: BarChart3
  }
]

const bottomMenuItems = [
  {
    title: 'Paramètres',
    href: '/parametres',
    icon: Settings
  },
  {
    title: 'Boîte Mail',
    href: '/mail',
    icon: Mail
  },
  {
    title: 'Profil',
    href: '/profil',
    icon: User
  }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [prestationsOpen, setPrestationsOpen] = useState(false)
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    if (href.includes('?tab=')) {
      const basePath = href.split('?')[0]
      const tab = href.split('tab=')[1]
      return pathname === basePath && (
        (tab === 'carrosserie' && pathname.includes('carrosserie')) ||
        (tab === 'mecanique' && pathname.includes('mecanique'))
      )
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isPrestationsActive = pathname === '/prestations' || pathname.startsWith('/prestations')

  // Mobile overlay
  const MobileOverlay = () => (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setMobileOpen(false)}
    />
  )

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 bg-white">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">Garage Pro</span>
              <p className="text-xs text-gray-500 font-medium">Management System</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCollapsed(!collapsed)
            setMobileOpen(false)
          }}
          className="h-9 w-9 p-0 hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-300",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {/* Main Menu Items */}
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.hasSubmenu ? (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setPrestationsOpen(!prestationsOpen)}
                    className={cn(
                      "w-full justify-start h-11 px-3 font-medium transition-all duration-200",
                      collapsed && "h-11 w-11 p-0 justify-center",
                      isPrestationsActive 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 hover:bg-blue-100" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          prestationsOpen && "rotate-180"
                        )} />
                      </>
                    )}
                  </Button>
                  
                  {/* Submenu */}
                  {!collapsed && (
                    <div className={cn(
                      "ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300",
                      prestationsOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      {item.submenu?.map((subItem) => (
                        <Button
                          key={subItem.href}
                          asChild
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-9 px-3 text-sm font-medium transition-all duration-200",
                            isActiveLink(subItem.href)
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 hover:bg-blue-100"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <Link href={subItem.href} onClick={() => setMobileOpen(false)}>
                            <subItem.icon className="h-4 w-4 mr-2" />
                            <span>{subItem.title}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-11 px-3 font-medium transition-all duration-200",
                    collapsed && "h-11 w-11 p-0 justify-center",
                    isActiveLink(item.href)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Link href={item.href} onClick={() => setMobileOpen(false)}>
                    <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </Button>
              )}
            </div>
          ))}

          <Separator className="my-4" />

          {/* Bottom Menu Items */}
          {bottomMenuItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 px-3 font-medium transition-all duration-200",
                collapsed && "h-11 w-11 p-0 justify-center",
                isActiveLink(item.href)
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 hover:bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Link href={item.href} onClick={() => setMobileOpen(false)}>
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">
            <p className="font-semibold text-gray-700">Mon Garage SARL</p>
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 Garage Pro</p>
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 p-0 bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      <MobileOverlay />

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex relative flex-col h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-72"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 lg:hidden",
        "w-72",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>
    </>
  )
}