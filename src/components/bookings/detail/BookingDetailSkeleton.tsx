/** Loading placeholder shaped like the real booking detail layout. */
export function BookingDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-800" />
      <div className="card h-40 animate-pulse" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="card h-64 animate-pulse" />
          <div className="card h-48 animate-pulse" />
        </div>
        <div className="space-y-5">
          <div className="card h-72 animate-pulse" />
          <div className="card h-52 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
