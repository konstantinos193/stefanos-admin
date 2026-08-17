import { BanknoteIcon, CheckCircle, LogIn, LogOut, XCircle, LucideIcon } from 'lucide-react'
import { BookingActionType } from '@/lib/bookings/booking-rules'

export interface BookingActionPresentation {
  label: string
  icon: LucideIcon
  /** Button colours when the action is rendered as the primary call to action. */
  primaryClass: string
  dialogTitle: string
  /** What the action will do, shown inside the confirmation dialog. */
  dialogSummary: string
  confirmLabel: string
  isDestructive: boolean
}

export const BOOKING_ACTION_PRESENTATION: Record<BookingActionType, BookingActionPresentation> = {
  confirm: {
    label: 'Επιβεβαίωση',
    icon: CheckCircle,
    primaryClass: 'bg-green-600 hover:bg-green-500 text-white',
    dialogTitle: 'Επιβεβαίωση κράτησης',
    dialogSummary: 'Η κράτηση γίνεται ΕΠΙΒΕΒΑΙΩΜΕΝΗ και το δωμάτιο δεσμεύεται στο ημερολόγιο.',
    confirmLabel: 'Επιβεβαίωση κράτησης',
    isDestructive: false,
  },
  'check-in': {
    label: 'Check-in',
    icon: LogIn,
    primaryClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    dialogTitle: 'Check-in επισκέπτη',
    dialogSummary: 'Ο επισκέπτης καταχωρείται ως παρών στο κατάλυμα.',
    confirmLabel: 'Ολοκλήρωση check-in',
    isDestructive: false,
  },
  'check-out': {
    label: 'Check-out',
    icon: LogOut,
    primaryClass: 'bg-purple-600 hover:bg-purple-500 text-white',
    dialogTitle: 'Check-out επισκέπτη',
    dialogSummary: 'Η κράτηση κλείνει ως ΟΛΟΚΛΗΡΩΜΕΝΗ και το δωμάτιο μπαίνει σε πρόγραμμα καθαρισμού.',
    confirmLabel: 'Ολοκλήρωση check-out',
    isDestructive: false,
  },
  'mark-paid': {
    label: 'Καταχώρηση πληρωμής',
    icon: BanknoteIcon,
    primaryClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    dialogTitle: 'Καταχώρηση πληρωμής',
    dialogSummary: 'Δημιουργείται εγγραφή πληρωμής για το σύνολο της κράτησης και το υπόλοιπο μηδενίζεται.',
    confirmLabel: 'Καταχώρηση πληρωμής',
    isDestructive: false,
  },
  cancel: {
    label: 'Ακύρωση',
    icon: XCircle,
    primaryClass: 'bg-red-600 hover:bg-red-500 text-white',
    dialogTitle: 'Ακύρωση κράτησης',
    dialogSummary: 'Το δωμάτιο ελευθερώνεται και η επιστροφή χρημάτων υπολογίζεται βάσει της πολιτικής ακύρωσης.',
    confirmLabel: 'Ακύρωση κράτησης',
    isDestructive: true,
  },
}
