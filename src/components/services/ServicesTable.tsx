'use client'

import { Edit, Trash2, Eye, ToggleLeft, ToggleRight, Loader2, Briefcase, SearchX } from 'lucide-react'
import { Service } from '@/lib/api/services'

interface ServicesTableProps {
  services: Service[]
  loading: boolean
  busyId?: string | null
  isFiltered?: boolean
  onView: (service: Service) => void
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onToggleActive: (service: Service) => void
  onCreate?: () => void
  onClearFilters?: () => void
}

function ServiceIcon({ icon }: { icon: string | null }) {
  return (
    <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-slate-700/60 border border-slate-600/60 flex items-center justify-center">
      {icon ? (
        <span className="text-base leading-none">{icon}</span>
      ) : (
        <Briefcase className="h-4 w-4 text-slate-400" />
      )}
    </div>
  )
}

function ActiveToggle({
  service,
  busy,
  onToggle,
}: {
  service: Service
  busy: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      disabled={busy}
      title={service.isActive ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
        service.isActive
          ? 'bg-green-500/15 text-green-300 border border-green-500/30 hover:bg-green-500/25'
          : 'bg-slate-600/30 text-slate-400 border border-slate-600/40 hover:bg-slate-600/50'
      }`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : service.isActive ? (
        <ToggleRight className="h-3.5 w-3.5" />
      ) : (
        <ToggleLeft className="h-3.5 w-3.5" />
      )}
      {service.isActive ? 'Ενεργή' : 'Ανενεργή'}
    </button>
  )
}

function FeatureChips({ features, limit = 2 }: { features: string[]; limit?: number }) {
  if (!features || features.length === 0) {
    return <span className="text-sm text-slate-500">—</span>
  }

  const shown = features.slice(0, limit)
  const rest = features.length - shown.length

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((feature, index) => (
        <span
          key={index}
          className="px-2 py-0.5 text-xs rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50"
        >
          {feature}
        </span>
      ))}
      {rest > 0 && (
        <span
          title={features.slice(limit).join(', ')}
          className="px-2 py-0.5 text-xs rounded-lg bg-slate-700/30 text-slate-400 border border-slate-600/40"
        >
          +{rest}
        </span>
      )}
    </div>
  )
}

function EmptyState({
  isFiltered,
  onCreate,
  onClearFilters,
}: Pick<ServicesTableProps, 'isFiltered' | 'onCreate' | 'onClearFilters'>) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-16">
      <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
        {isFiltered ? (
          <SearchX className="h-5 w-5 text-slate-400" />
        ) : (
          <Briefcase className="h-5 w-5 text-blue-400" />
        )}
      </div>
      <p className="mt-4 text-base font-semibold text-slate-200">
        {isFiltered ? 'Κανένα αποτέλεσμα' : 'Δεν υπάρχουν υπηρεσίες'}
      </p>
      <p className="mt-1 text-sm text-slate-400 max-w-sm">
        {isFiltered
          ? 'Δοκιμάστε διαφορετική αναζήτηση ή αφαιρέστε τα φίλτρα.'
          : 'Προσθέστε τις υπηρεσίες που προβάλλονται στην ιστοσελίδα, σε ελληνικά και αγγλικά.'}
      </p>
      {isFiltered ? (
        onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-5 h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Καθαρισμός φίλτρων
          </button>
        )
      ) : (
        onCreate && (
          <button
            onClick={onCreate}
            className="mt-5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Νέα Υπηρεσία
          </button>
        )
      )}
    </div>
  )
}

export function ServicesTable({
  services,
  loading,
  busyId,
  isFiltered,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onCreate,
  onClearFilters,
}: ServicesTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-3 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse h-16 bg-slate-700/40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700">
        <EmptyState isFiltered={isFiltered} onCreate={onCreate} onClearFilters={onClearFilters} />
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
      {/* Mobile */}
      <div className="md:hidden divide-y divide-slate-700/60">
        {services.map((service) => {
          const busy = busyId === service.id

          return (
            <div key={service.id} className={`p-4 ${busy ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <ServiceIcon icon={service.icon} />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-slate-100 truncate">
                    {service.titleGr}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{service.titleEn}</p>
                </div>
                <ActiveToggle
                  service={service}
                  busy={busy}
                  onToggle={() => onToggleActive(service)}
                />
              </div>

              {(service.descriptionGr || service.descriptionEn) && (
                <p className="mt-3 text-sm text-slate-400 line-clamp-2">
                  {service.descriptionGr || service.descriptionEn}
                </p>
              )}

              <div className="mt-3">
                <FeatureChips features={service.features} limit={3} />
              </div>

              {service.pricingGr && (
                <p className="mt-3 text-sm font-semibold text-slate-200">{service.pricingGr}</p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onView(service)}
                  disabled={busy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-slate-700/60 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                  Προβολή
                </button>
                <button
                  onClick={() => onEdit(service)}
                  disabled={busy}
                  aria-label="Επεξεργασία"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-700/60 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(service)}
                  disabled={busy}
                  aria-label="Διαγραφή"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-700/60 text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              {['Υπηρεσία', 'Περιγραφή', 'Χαρακτηριστικά', 'Τιμολόγηση', 'Κατάσταση', ''].map(
                (header, index) => (
                  <th
                    key={header || index}
                    className={`px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider ${
                      index === 5 ? 'text-right' : 'text-left'
                    }`}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {services.map((service) => {
              const busy = busyId === service.id

              return (
                <tr
                  key={service.id}
                  className={`hover:bg-slate-800/60 transition-colors ${busy ? 'opacity-60' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ServiceIcon icon={service.icon} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-100 truncate">
                          {service.titleGr}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{service.titleEn}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <p
                      title={service.descriptionGr || service.descriptionEn || ''}
                      className="text-sm text-slate-400 line-clamp-2"
                    >
                      {service.descriptionGr || service.descriptionEn || '—'}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <FeatureChips features={service.features} />
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-200">{service.pricingGr || '—'}</p>
                    {service.pricingEn && service.pricingEn !== service.pricingGr && (
                      <p className="text-xs text-slate-500 mt-0.5">{service.pricingEn}</p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <ActiveToggle
                      service={service}
                      busy={busy}
                      onToggle={() => onToggleActive(service)}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(service)}
                        disabled={busy}
                        title="Προβολή"
                        aria-label="Προβολή"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(service)}
                        disabled={busy}
                        title="Επεξεργασία"
                        aria-label="Επεξεργασία"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(service)}
                        disabled={busy}
                        title="Διαγραφή"
                        aria-label="Διαγραφή"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/15 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
