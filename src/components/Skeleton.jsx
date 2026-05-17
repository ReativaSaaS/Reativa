export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/[0.05] rounded ${className}`} />
  )
}

export function KpiSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/[0.03]">
      <td className="px-4 py-3.5"><Skeleton className="w-4 h-4" /></td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
      <td className="px-4 py-3.5 hidden md:table-cell"><Skeleton className="h-4 w-28" /></td>
      <td className="px-4 py-3.5 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-3.5 hidden lg:table-cell"><Skeleton className="h-4 w-10" /></td>
      <td className="px-4 py-3.5"><Skeleton className="h-6 w-16" /></td>
    </tr>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Insight skeleton */}
      <Skeleton className="h-32 w-full rounded-xl" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <KpiSkeleton key={i} />)}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <Skeleton className="w-9 h-9 rounded-lg mb-3" />
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Content row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Chart */}
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

export function ClientsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody>
            {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
