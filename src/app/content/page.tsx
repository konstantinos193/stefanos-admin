'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Plus,
  X,
  FileEdit,
  Search,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { ContentEditorDialog, CONTENT_TYPES } from '@/components/content/ContentEditorDialog'
import { contentApi, type ContentItem } from '@/lib/api/content'

const PAGE_LABELS: Record<string, string> = {
  home: 'Αρχική',
  homepage: 'Αρχική',
  about: 'Σχετικά',
  contact: 'Επικοινωνία',
  dining: 'Εστιατόριο',
  facilities: 'Εγκαταστάσεις',
  rooms: 'Δωμάτια',
  privacy: 'Πολιτική Απορρήτου',
  terms: 'Όροι Χρήσης',
  gallery: 'Γκαλερί',
}

const FETCH_LIMIT = 300

function pageLabel(page: string) {
  return PAGE_LABELS[page] || page
}

function typeLabel(type: string) {
  return CONTENT_TYPES.find((t) => t.value === type)?.label ?? type
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ContentItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  const [pendingDelete, setPendingDelete] = useState<ContentItem | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filterPage, setFilterPage] = useState('')

  /**
   * Everything is fetched once and filtered in the browser. Filtering by page on
   * the server shrank the very list the page dropdown was built from, so after
   * picking a page you could no longer switch to a different one.
   */
  const fetchContent = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await contentApi.getAll({ take: FETCH_LIMIT, skip: 0 })
      setItems(response?.data ?? [])
      setPageError(null)
    } catch (error) {
      console.error('Error fetching content:', error)
      setPageError(errorMessage(error, 'Αποτυχία φόρτωσης περιεχομένου.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const pages = useMemo(
    () => Array.from(new Set(items.map((item) => item.page))).sort(),
    [items],
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      if (filterPage && item.page !== filterPage) return false
      if (!query) return true

      return [item.key, item.section, item.page, item.contentGr, item.contentEn].some((field) =>
        field?.toLowerCase().includes(query),
      )
    })
  }, [items, search, filterPage])

  const handleSubmit = async (data: Partial<ContentItem>) => {
    setSaving(true)
    setDialogError(null)
    try {
      if (editing) {
        await contentApi.update(editing.id, data)
      } else {
        await contentApi.create(data)
      }
      setDialogOpen(false)
      setEditing(null)
      await fetchContent({ silent: true })
    } catch (error) {
      console.error('Error saving content:', error)
      setDialogError(errorMessage(error, 'Η αποθήκευση απέτυχε.'))
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (item: ContentItem) => {
    setBusyId(item.id)
    try {
      await contentApi.update(item.id, { active: !item.active })
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i)),
      )
    } catch (error) {
      console.error('Error toggling content:', error)
      // Previously swallowed to the console — the badge silently stayed put.
      setPageError(errorMessage(error, 'Η αλλαγή κατάστασης απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const target = pendingDelete
    setBusyId(target.id)
    setPendingDelete(null)
    try {
      await contentApi.delete(target.id)
      setItems((prev) => prev.filter((i) => i.id !== target.id))
    } catch (error) {
      console.error('Error deleting content:', error)
      setPageError(errorMessage(error, 'Η διαγραφή απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const isFiltered = Boolean(search.trim()) || Boolean(filterPage)
  const controlClass =
    'h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Διαχείριση Περιεχομένου</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {items.length > 0
              ? isFiltered
                ? `${filtered.length} από ${items.length} καταχωρήσεις`
                : `${items.length} καταχωρήσεις κειμένου`
              : 'Επεξεργασία κειμένων και περιεχομένου σελίδων'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchContent({ silent: true })}
            disabled={refreshing}
            title="Ανανέωση"
            aria-label="Ανανέωση"
            className="flex items-center justify-center h-11 w-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditing(null)
              setDialogError(null)
              setDialogOpen(true)
            }}
            className="flex items-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Νέο Περιεχόμενο</span>
            <span className="sm:hidden">Νέο</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση σε κλειδιά και κείμενα..."
            className={`${controlClass} w-full pl-10 pr-10`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Καθαρισμός αναζήτησης"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={filterPage}
          onChange={(e) => setFilterPage(e.target.value)}
          className={`${controlClass} sm:w-56 [&>option]:bg-slate-800`}
        >
          <option value="">Όλες οι σελίδες</option>
          {pages.map((page) => (
            <option key={page} value={page}>
              {pageLabel(page)}
            </option>
          ))}
        </select>
      </div>

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-red-200">{pageError}</p>
          <button
            onClick={() => setPageError(null)}
            aria-label="Κλείσιμο"
            className="text-red-300 hover:text-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse h-14 bg-slate-700/40 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileEdit className="h-8 w-8 mx-auto text-slate-600" />
            <p className="mt-3 text-base font-semibold text-slate-200">
              {isFiltered ? 'Κανένα αποτέλεσμα' : 'Δεν υπάρχει περιεχόμενο'}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {isFiltered
                ? 'Δοκιμάστε διαφορετική αναζήτηση ή σελίδα.'
                : 'Προσθέστε την πρώτη καταχώρηση κειμένου.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  {['Σελίδα / Ενότητα / Κλειδί', 'Ελληνικά', 'English', 'Κατάσταση', ''].map(
                    (header, index) => (
                      <th
                        key={header || index}
                        className={`px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider ${
                          index === 4 ? 'text-right' : index === 3 ? 'text-center' : 'text-left'
                        } ${index === 1 ? 'hidden md:table-cell' : ''} ${
                          index === 2 ? 'hidden lg:table-cell' : ''
                        }`}
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filtered.map((item) => {
                  const busy = busyId === item.id

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/60 transition-colors ${
                        busy ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-100">
                            {pageLabel(item.page)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 border border-slate-600/50 text-slate-400">
                            {typeLabel(item.type)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">
                          {item.section} › {item.key}
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell max-w-[240px]">
                        <p
                          title={item.contentGr || ''}
                          className="text-xs text-slate-300 truncate"
                        >
                          {item.contentGr || '—'}
                        </p>
                      </td>

                      <td className="px-4 py-3 hidden lg:table-cell max-w-[240px]">
                        <p
                          title={item.contentEn || ''}
                          className="text-xs text-slate-300 truncate"
                        >
                          {item.contentEn || '—'}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActive(item)}
                          disabled={busy}
                          title={item.active ? 'Κλικ για απενεργοποίηση' : 'Κλικ για ενεργοποίηση'}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                            item.active
                              ? 'bg-green-500/15 text-green-300 border border-green-500/30 hover:bg-green-500/25'
                              : 'bg-slate-600/30 text-slate-400 border border-slate-600/40 hover:bg-slate-600/50'
                          }`}
                        >
                          {item.active ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" />
                          )}
                          {item.active ? 'Ενεργό' : 'Ανενεργό'}
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditing(item)
                              setDialogError(null)
                              setDialogOpen(true)
                            }}
                            disabled={busy}
                            title="Επεξεργασία"
                            aria-label="Επεξεργασία"
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                          >
                            <FileEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setPendingDelete(item)}
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
        )}
      </div>

      <ContentEditorDialog
        isOpen={dialogOpen}
        item={editing}
        loading={saving}
        error={dialogError}
        onClose={() => {
          setDialogOpen(false)
          setEditing(null)
          setDialogError(null)
        }}
        onSubmit={handleSubmit}
      />

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPendingDelete(null)
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-300" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-100">Διαγραφή καταχώρησης;</h3>
                <p className="mt-1 text-sm text-slate-400 break-words">
                  Η καταχώρηση{' '}
                  <span className="font-semibold text-slate-200 font-mono">
                    {pendingDelete.section} › {pendingDelete.key}
                  </span>{' '}
                  θα διαγραφεί οριστικά και θα πάψει να εμφανίζεται στην ιστοσελίδα.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="h-10 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
              >
                Διαγραφή
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
