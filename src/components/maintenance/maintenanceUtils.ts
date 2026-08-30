import { MaintenanceRequest, User } from '@/lib/api/types'

export type MaintenanceStatusValue = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type MaintenancePriorityValue = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export const STATUS_OPTIONS: {
  value: MaintenanceStatusValue
  label: string
  badge: string
  dot: string
  accent: string
}[] = [
  {
    value: 'OPEN',
    label: 'Ανοιχτό',
    badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    dot: 'bg-amber-400',
    accent: 'border-l-amber-500',
  },
  {
    value: 'IN_PROGRESS',
    label: 'Σε εξέλιξη',
    badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    dot: 'bg-blue-400',
    accent: 'border-l-blue-500',
  },
  {
    value: 'COMPLETED',
    label: 'Ολοκληρώθηκε',
    badge: 'bg-green-500/15 text-green-300 border border-green-500/30',
    dot: 'bg-green-400',
    accent: 'border-l-green-500',
  },
  {
    value: 'CANCELLED',
    label: 'Ακυρώθηκε',
    badge: 'bg-slate-600/30 text-slate-400 border border-slate-600/40',
    dot: 'bg-slate-500',
    accent: 'border-l-slate-600',
  },
]

export const PRIORITY_OPTIONS: {
  value: MaintenancePriorityValue
  label: string
  badge: string
  active: string
}[] = [
  {
    value: 'LOW',
    label: 'Χαμηλή',
    badge: 'bg-slate-600/25 text-slate-300 border border-slate-600/40',
    active: 'bg-slate-600/40 border-slate-400 text-slate-100',
  },
  {
    value: 'MEDIUM',
    label: 'Μεσαία',
    badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    active: 'bg-blue-500/20 border-blue-500 text-blue-200',
  },
  {
    value: 'HIGH',
    label: 'Υψηλή',
    badge: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
    active: 'bg-orange-500/20 border-orange-500 text-orange-200',
  },
  {
    value: 'URGENT',
    label: 'Επείγουσα',
    badge: 'bg-red-500/15 text-red-300 border border-red-500/30',
    active: 'bg-red-500/20 border-red-500 text-red-200',
  },
]

export function getStatusMeta(status: string) {
  return (
    STATUS_OPTIONS.find((s) => s.value === status) ?? {
      value: status as MaintenanceStatusValue,
      label: status,
      badge: 'bg-slate-600/30 text-slate-300 border border-slate-600/40',
      dot: 'bg-slate-500',
      accent: 'border-l-slate-600',
    }
  )
}

export function getPriorityMeta(priority: string) {
  return (
    PRIORITY_OPTIONS.find((p) => p.value === priority) ?? {
      value: priority as MaintenancePriorityValue,
      label: priority,
      badge: 'bg-slate-600/25 text-slate-300 border border-slate-600/40',
      active: 'bg-slate-600/40 border-slate-400 text-slate-100',
    }
  )
}

/** A request is still actionable while it is neither completed nor cancelled. */
export function isOpenRequest(request: MaintenanceRequest): boolean {
  return request.status === 'OPEN' || request.status === 'IN_PROGRESS'
}

const STATUS_RANK: Record<string, number> = {
  OPEN: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: 3,
}

const PRIORITY_RANK: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}

/** Open work first, most urgent first, then newest first. */
export function sortByUrgency(requests: MaintenanceRequest[]): MaintenanceRequest[] {
  return [...requests].sort((a, b) => {
    const byStatus = (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9)
    if (byStatus !== 0) return byStatus
    const byPriority = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9)
    if (byPriority !== 0) return byPriority
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * `assignedTo` stores a user id. Resolve it to a readable name, falling back to
 * the raw value for rows assigned before the picker existed.
 */
export function resolveAssignee(
  assignedTo: string | null,
  users: User[],
): { label: string; isKnown: boolean } | null {
  if (!assignedTo) return null
  const user = users.find((u) => u.id === assignedTo)
  if (user) return { label: user.name || user.email, isKnown: true }
  return { label: assignedTo, isKnown: false }
}
