'use client'

import { Button } from '@/components/ui/button'
import { Wrench, PaintBucket, LayoutGrid } from 'lucide-react'

interface ActivityFilterProps {
  selectedActivity: 'ALL' | 'CARROSSERIE' | 'MECANIQUE'
  onActivityChange: (activity: 'ALL' | 'CARROSSERIE' | 'MECANIQUE') => void
}

export function ActivityFilter({ selectedActivity, onActivityChange }: ActivityFilterProps) {
  const filters = [
    {
      value: 'ALL' as const,
      label: 'Toutes',
      icon: LayoutGrid,
      color: 'text-slate-600'
    },
    {
      value: 'CARROSSERIE' as const,
      label: 'Carrosserie',
      icon: PaintBucket,
      color: 'text-blue-600'
    },
    {
      value: 'MECANIQUE' as const,
      label: 'Mécanique',
      icon: Wrench,
      color: 'text-emerald-600'
    }
  ]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
        Filtrer par activité:
      </span>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedActivity === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onActivityChange(filter.value)}
            className={`h-9 px-4 transition-all duration-200 ${
              selectedActivity === filter.value
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
            }`}
          >
            <filter.icon className={`h-4 w-4 mr-2 ${
              selectedActivity === filter.value ? 'text-white' : filter.color
            }`} />
            <span className="font-medium">{filter.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}