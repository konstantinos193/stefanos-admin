'use client'

import { useMemo, useState } from 'react'
import {
  CalendarDays,
  CalendarRange,
  Sparkles,
  Building2,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Mail,
  Search,
  SearchX,
} from 'lucide-react'
import { HELP_TOPICS, HelpTopic, SUPPORT_EMAIL } from './helpTopics'

const ICONS: Record<HelpTopic['icon'], typeof CalendarDays> = {
  bookings: CalendarRange,
  calendar: CalendarDays,
  cleaning: Sparkles,
  properties: Building2,
  reports: BarChart3,
  users: ShieldCheck,
}

interface HelpContentProps {
  search: string
}

export function HelpContent({ search }: HelpContentProps) {
  const [openTopic, setOpenTopic] = useState<string | null>(HELP_TOPICS[0]?.id ?? null)

  const topics = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return HELP_TOPICS

    return HELP_TOPICS.filter((topic) =>
      [
        topic.title,
        topic.description,
        ...topic.steps.map((step) => `${step.title} ${step.body}`),
      ].some((text) => text.toLowerCase().includes(query)),
    )
  }, [search])

  return (
    <div className="space-y-4">
      {topics.length === 0 ? (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700 py-16 text-center">
          <SearchX className="h-8 w-8 text-slate-600 mx-auto" />
          <p className="mt-3 text-base font-semibold text-slate-200">Κανένα αποτέλεσμα</p>
          <p className="mt-1 text-sm text-slate-400">
            Δεν βρέθηκε θέμα βοήθειας για «{search}».
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const Icon = ICONS[topic.icon]
            const isOpen = openTopic === topic.id

            return (
              <div
                key={topic.id}
                className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden h-fit"
              >
                <button
                  onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start gap-3 p-5 text-left hover:bg-slate-800 transition-colors"
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${topic.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-slate-100">{topic.title}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{topic.description}</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-700/60 pt-4">
                    {topic.steps.map((step) => (
                      <div key={step.title}>
                        <h3 className="text-sm font-semibold text-slate-200">{step.title}</h3>
                        <p className="mt-1 text-sm text-slate-400 leading-relaxed">{step.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="p-2.5 rounded-xl border bg-blue-500/15 text-blue-300 border-blue-500/25 w-fit">
          <Mail className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-slate-100">Χρειάζεστε περισσότερη βοήθεια;</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Αν δεν βρήκατε αυτό που ψάχνετε, στείλτε μας μήνυμα και θα σας απαντήσουμε.
          </p>
        </div>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Υποστήριξη — SMH Admin')}`}
          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          <Mail className="h-4 w-4" />
          Επικοινωνία
        </a>
      </div>
    </div>
  )
}

export function HelpSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Αναζήτηση στη βοήθεια..."
        className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
      />
    </div>
  )
}
