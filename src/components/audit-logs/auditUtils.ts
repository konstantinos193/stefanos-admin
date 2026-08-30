export const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Δημιουργία',
  UPDATE: 'Ενημέρωση',
  DELETE: 'Διαγραφή',
  READ: 'Προβολή',
  LOGIN: 'Σύνδεση',
  LOGOUT: 'Αποσύνδεση',
}

export const ENTITY_LABELS: Record<string, string> = {
  USER: 'Χρήστης',
  USERS: 'Χρήστες',
  PROPERTY: 'Ακίνητο',
  PROPERTIES: 'Ακίνητα',
  BOOKING: 'Κράτηση',
  BOOKINGS: 'Κρατήσεις',
  PAYMENT: 'Πληρωμή',
  PAYMENTS: 'Πληρωμές',
  ROOM: 'Δωμάτιο',
  ROOMS: 'Δωμάτια',
  REVIEW: 'Κριτική',
  REVIEWS: 'Κριτικές',
  SERVICE: 'Υπηρεσία',
  SERVICES: 'Υπηρεσίες',
  MAINTENANCE: 'Συντήρηση',
  CLEANING: 'Καθαρισμός',
  SETTINGS: 'Ρυθμίσεις',
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Διαχειριστής',
  MANAGER: 'Υπεύθυνος',
  PROPERTY_OWNER: 'Ιδιοκτήτης',
  USER: 'Χρήστης',
}

export function actionLabel(action: string): string {
  return ACTION_LABELS[action?.toUpperCase()] ?? action
}

export function entityLabel(entityType: string): string {
  return ENTITY_LABELS[entityType?.toUpperCase()] ?? entityType
}

export function roleLabel(role: string): string {
  return ROLE_LABELS[role?.toUpperCase()] ?? role
}

export function actionBadge(action: string): string {
  switch (action?.toUpperCase()) {
    case 'CREATE':
      return 'bg-green-500/15 text-green-300 border border-green-500/30'
    case 'UPDATE':
      return 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
    case 'DELETE':
      return 'bg-red-500/15 text-red-300 border border-red-500/30'
    case 'READ':
      return 'bg-slate-600/30 text-slate-300 border border-slate-600/40'
    default:
      return 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
  }
}

export function roleBadge(role: string): string {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'bg-red-500/15 text-red-300 border border-red-500/30'
    case 'MANAGER':
      return 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
    case 'PROPERTY_OWNER':
      return 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
    default:
      return 'bg-slate-600/30 text-slate-300 border border-slate-600/40'
  }
}

/** Existing rows were stored behind a proxy as `::ffff:172.18.0.1`. */
export function formatIp(ip?: string | null): string {
  if (!ip) return '—'
  return ip.replace(/^::ffff:/i, '') || '—'
}

export function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString('el-GR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatFullTimestamp(value: string): string {
  return new Date(value).toLocaleString('el-GR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
