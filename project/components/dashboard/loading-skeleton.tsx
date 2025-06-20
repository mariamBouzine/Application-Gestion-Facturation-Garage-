'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 rounded-lg w-80 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-96 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-slate-200 rounded-lg w-20 animate-pulse" />
            <div className="h-9 bg-slate-200 rounded-lg w-24 animate-pulse" />
            <div className="h-9 bg-slate-200 rounded-lg w-22 animate-pulse" />
          </div>
        </div>

        {/* Metrics Cards Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded w-40 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                    <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 bg-slate-200 rounded w-16 animate-pulse" />
                      <div className="h-6 bg-slate-200 rounded w-12 animate-pulse" />
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Alerts Panel Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
                        <div className="h-4 bg-slate-200 rounded w-40 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-6 bg-slate-200 rounded w-8 animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="p-4 border border-slate-200 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-5 bg-slate-200 rounded w-20 animate-pulse" />
                            <div className="h-5 bg-slate-200 rounded w-12 animate-pulse" />
                          </div>
                          <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                          <div className="flex items-center gap-4">
                            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                            <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded w-36 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
          </div>
          <Card className="border border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-200 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-full animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-200 rounded w-48 animate-pulse" />
                      <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-32 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                      <div className="h-5 bg-slate-200 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}