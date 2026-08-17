'use client'

import { Mail, MessageCircle, MessageSquare, Phone, User } from 'lucide-react'
import { Booking } from '@/lib/api/types'
import { toDialablePhone } from '@/lib/bookings/booking-format'
import { getGuestEmail, getGuestName, getGuestPhone } from '@/lib/bookings/booking-rules'
import { CopyButton } from './CopyButton'
import { SectionTitle } from './SectionTitle'

interface GuestCardProps {
  booking: Booking
}

/** Guest contact details that are one tap away from a call, an email or WhatsApp. */
export function GuestCard({ booking }: GuestCardProps) {
  const name = getGuestName(booking)
  const email = getGuestEmail(booking)
  const phone = getGuestPhone(booking)
  const dialablePhone = toDialablePhone(phone)

  return (
    <section className="card">
      <SectionTitle icon={<User className="h-4 w-4" />} title="Επισκέπτης" />

      <p className="mt-4 text-lg font-bold text-slate-50">{name}</p>

      <div className="mt-4 space-y-2">
        {phone ? (
          <ContactRow
            icon={<Phone className="h-4 w-4" />}
            href={dialablePhone ? `tel:${dialablePhone}` : undefined}
            text={phone}
            copyTitle="Αντιγραφή τηλεφώνου"
          />
        ) : (
          <EmptyContactRow icon={<Phone className="h-4 w-4" />} text="Χωρίς τηλέφωνο" />
        )}

        {email ? (
          <ContactRow
            icon={<Mail className="h-4 w-4" />}
            href={`mailto:${email}`}
            text={email}
            copyTitle="Αντιγραφή email"
          />
        ) : (
          <EmptyContactRow icon={<Mail className="h-4 w-4" />} text="Χωρίς email" />
        )}
      </div>

      {dialablePhone && (
        <a
          href={`https://wa.me/${dialablePhone.replace('+', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
        >
          <MessageCircle className="h-4 w-4" />
          Μήνυμα στο WhatsApp
        </a>
      )}

      {booking.specialRequests && (
        <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
          <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-300 uppercase">
            <MessageSquare className="h-3.5 w-3.5" />
            Αίτημα επισκέπτη
          </p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-amber-100/90">
            {booking.specialRequests}
          </p>
        </div>
      )}
    </section>
  )
}

interface ContactRowProps {
  icon: React.ReactNode
  text: string
  href?: string
  copyTitle: string
}

function ContactRow({ icon, text, href, copyTitle }: ContactRowProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-slate-900/50 pr-1.5">
      <a
        href={href}
        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:text-blue-300"
      >
        <span className="shrink-0 text-slate-500">{icon}</span>
        <span className="truncate">{text}</span>
      </a>
      <CopyButton value={text} title={copyTitle} />
    </div>
  )
}

function EmptyContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 px-3 py-2.5 text-sm text-slate-500">
      <span className="shrink-0">{icon}</span>
      {text}
    </div>
  )
}
