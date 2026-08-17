'use client'

import { useEffect, useRef, useState } from 'react'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { BookingActionType } from '@/lib/bookings/booking-rules'
import { BOOKING_ACTION_PRESENTATION } from './booking-action-presentation'

interface BookingActionBarProps {
  /** Allowed actions, most relevant first (see getAvailableActions). */
  actions: BookingActionType[]
  isBusy: boolean
  onAction: (action: BookingActionType) => void
  onEdit: () => void
  onDelete: () => void
}

/**
 * One contextual primary action, one secondary, everything else behind a menu —
 * so reception sees the obvious next step instead of five equally loud buttons.
 */
export function BookingActionBar({ actions, isBusy, onAction, onEdit, onDelete }: BookingActionBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMenuOpen])

  const workflowActions = actions.filter((action) => action !== 'cancel')
  const [primary, secondary] = workflowActions
  const menuActions = [...workflowActions.slice(2), ...actions.filter((action) => action === 'cancel')]

  function runAction(action: BookingActionType) {
    setIsMenuOpen(false)
    onAction(action)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {primary && (
        <ActionButton action={primary} isBusy={isBusy} variant="primary" onClick={() => runAction(primary)} />
      )}
      {secondary && (
        <ActionButton action={secondary} isBusy={isBusy} variant="secondary" onClick={() => runAction(secondary)} />
      )}

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Περισσότερες ενέργειες"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 py-1 shadow-2xl"
          >
            <MenuItem
              icon={<Edit className="h-4 w-4" />}
              label="Επεξεργασία κράτησης"
              onClick={() => {
                setIsMenuOpen(false)
                onEdit()
              }}
            />

            {menuActions.map((action) => {
              const { label, icon: Icon, isDestructive } = BOOKING_ACTION_PRESENTATION[action]
              return (
                <MenuItem
                  key={action}
                  icon={<Icon className="h-4 w-4" />}
                  label={label}
                  isDestructive={isDestructive}
                  disabled={isBusy}
                  onClick={() => runAction(action)}
                />
              )
            })}

            <div className="my-1 border-t border-slate-700" />
            <MenuItem
              icon={<Trash2 className="h-4 w-4" />}
              label="Οριστική διαγραφή"
              isDestructive
              onClick={() => {
                setIsMenuOpen(false)
                onDelete()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface ActionButtonProps {
  action: BookingActionType
  variant: 'primary' | 'secondary'
  isBusy: boolean
  onClick: () => void
}

function ActionButton({ action, variant, isBusy, onClick }: ActionButtonProps) {
  const { label, icon: Icon, primaryClass } = BOOKING_ACTION_PRESENTATION[action]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isBusy}
      className={`flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        variant === 'primary'
          ? `${primaryClass} shadow-lg shadow-black/20`
          : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  isDestructive?: boolean
  disabled?: boolean
}

function MenuItem({ icon, label, onClick, isDestructive = false, disabled = false }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors disabled:opacity-50 ${
        isDestructive ? 'text-red-300 hover:bg-red-500/10' : 'text-slate-200 hover:bg-slate-700/70'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
