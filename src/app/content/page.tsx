'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Save, X, FileEdit, Search, Globe, Eye, EyeOff } from 'lucide-react'
import { apiRequest } from '@/lib/api/config'

interface ContentItem {
  id: string
  page: string
  section: string
  key: string
  type: string
  valueGr: string | null
  valueEn: string | null
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

interface EditState {
  item: ContentItem
  valueGr: string
  valueEn: string
  active: boolean
}

const PAGE_LABELS: Record<string, string> = {
  home: 'Αρχική',
  about: 'Σχετικά',
  contact: 'Επικοινωνία',
  dining: 'Εστιατόριο',
  facilities: 'Εγκαταστάσεις',
  rooms: 'Δωμάτια',
  privacy: 'Πολιτική Απορρήτου',
  terms: 'Όροι Χρήσης',
  gallery: 'Γκαλερί',
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterPage, setFilterPage] = useState('')
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ take: '200', skip: '0' })
      if (filterPage) params.set('page', filterPage)
      const res = await apiRequest<{ success: boolean; data: ContentItem[] }>(`/content?${params}`)
      setItems(res.data || [])
    } catch (e: any) {
      setError(e?.message || 'Αποτυχία φόρτωσης')
    } finally {
      setLoading(false)
    }
  }, [filterPage])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const filtered = items.filter((item) => {
    const q = search.toLowerCase()
    return (
      !q ||
      item.key.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      (item.valueGr || '').toLowerCase().includes(q) ||
      (item.valueEn || '').toLowerCase().includes(q)
    )
  })

  const pages = [...new Set(items.map((i) => i.page))].sort()

  const startEdit = (item: ContentItem) => {
    setEditing({ item, valueGr: item.valueGr || '', valueEn: item.valueEn || '', active: item.active })
    setSaveError(null)
  }

  const cancelEdit = () => {
    setEditing(null)
    setSaveError(null)
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    setSaveError(null)
    try {
      await apiRequest<any>(`/content/${editing.item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          valueGr: editing.valueGr,
          valueEn: editing.valueEn,
          active: editing.active,
        }),
      })
      setItems((prev) =>
        prev.map((i) =>
          i.id === editing.item.id
            ? { ...i, valueGr: editing.valueGr, valueEn: editing.valueEn, active: editing.active }
            : i,
        ),
      )
      setEditing(null)
    } catch (e: any) {
      setSaveError(e?.message || 'Αποτυχία αποθήκευσης')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (item: ContentItem) => {
    try {
      await apiRequest<any>(`/content/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !item.active }),
      })
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i)),
      )
    } catch (e: any) {
      console.error('Toggle active failed:', e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Διαχείριση Περιεχομένου</h1>
          <p className="text-slate-400 mt-1">Επεξεργασία κειμένων και περιεχομένου σελίδων</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση..."
            className="input pl-10"
          />
        </div>
        <select
          value={filterPage}
          onChange={(e) => setFilterPage(e.target.value)}
          className="input max-w-[200px]"
        >
          <option value="">Όλες οι σελίδες</option>
          {pages.map((p) => (
            <option key={p} value={p}>
              {PAGE_LABELS[p] || p}
            </option>
          ))}
        </select>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-100">Επεξεργασία Περιεχομένου</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editing.item.page} / {editing.item.section} / {editing.item.key}
                </p>
              </div>
              <button onClick={cancelEdit} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> Ελληνικά
                </label>
                <textarea
                  rows={4}
                  value={editing.valueGr}
                  onChange={(e) => setEditing({ ...editing, valueGr: e.target.value })}
                  className="input w-full resize-y font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> English
                </label>
                <textarea
                  rows={4}
                  value={editing.valueEn}
                  onChange={(e) => setEditing({ ...editing, valueEn: e.target.value })}
                  className="input w-full resize-y font-mono text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">Ενεργό</span>
              </label>
              {saveError && <p className="text-sm text-red-400">{saveError}</p>}
            </div>
            <div className="p-5 border-t border-slate-700 flex justify-end gap-3">
              <button onClick={cancelEdit} className="btn btn-secondary">
                Ακύρωση
              </button>
              <button onClick={saveEdit} disabled={saving} className="btn btn-primary flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Φόρτωση...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <FileEdit className="h-10 w-10 mx-auto mb-3 text-slate-600" />
            Δεν βρέθηκε περιεχόμενο
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Σελίδα / Section / Key</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Ελληνικά</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">English</th>
                <th className="text-center px-4 py-3 text-slate-400 font-medium">Κατάσταση</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-200 text-xs">
                      {PAGE_LABELS[item.page] || item.page}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {item.section} › {item.key}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-[200px]">
                    <p className="text-slate-300 text-xs truncate">{item.valueGr || '—'}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell max-w-[200px]">
                    <p className="text-slate-300 text-xs truncate">{item.valueEn || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(item)}
                      title={item.active ? 'Κλικ για απενεργοποίηση' : 'Κλικ για ενεργοποίηση'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        item.active
                          ? 'bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {item.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {item.active ? 'Ενεργό' : 'Ανενεργό'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(item)}
                      className="btn btn-secondary text-xs py-1 px-2 flex items-center gap-1 ml-auto"
                    >
                      <FileEdit className="h-3.5 w-3.5" />
                      Επεξεργασία
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
