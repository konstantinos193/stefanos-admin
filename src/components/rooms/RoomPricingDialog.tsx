'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Plus, Trash2, Pencil, Check, AlertCircle, ChevronLeft, ChevronRight, Calendar, Settings, Info, Sparkles } from 'lucide-react'
import { roomsApi, PricingRule, Room } from '@/lib/api/rooms'
import '@/styles/calendar-animations.css'

interface RoomPricingDialogProps {
  room: Room
  isOpen: boolean
  onClose: () => void
}

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDateDisplay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('el-GR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateInput(dateStr: string): string {
  return dateStr ? dateStr.slice(0, 10) : ''
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function ruleForDate(dateStr: string, rules: PricingRule[]): PricingRule | null {
  for (const r of rules) {
    const start = r.startDate.slice(0, 10)
    const end = r.endDate.slice(0, 10)
    if (dateStr >= start && dateStr <= end) return r
  }
  return null
}

// ─── MonthGrid ───────────────────────────────────────────────────────────────

const MONTH_NAMES_SHORT = [
  'Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαι', 'Ιουν',
  'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ',
]
const DAY_LABELS = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ']

interface HoveredDay { dateStr: string; rule: PricingRule | null; x: number; y: number }

interface MonthGridProps {
  year: number
  month: number
  rules: PricingRule[]
  onHover: (h: HoveredDay | null) => void
}

function MonthGrid({ year, month, rules, onHover }: MonthGridProps) {
  const totalDays = daysInMonth(year, month)
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7

  const cells: Array<{ day: number | null; dateStr: string | null }> = []
  for (let i = 0; i < firstDow; i++) cells.push({ day: null, dateStr: null })
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, dateStr })
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, dateStr: null })

  return (
    <div className="select-none calendar-transition">
      <p className="text-[11px] font-bold text-slate-300 text-center mb-2 tracking-widest uppercase">
        {MONTH_NAMES_SHORT[month]}
      </p>
      <div className="grid grid-cols-7 gap-[2px]">
        {DAY_LABELS.map((l) => (
          <div key={l} className="text-[8px] text-slate-600 text-center pb-1 font-semibold">{l}</div>
        ))}
        {cells.map((cell, i) => {
          if (!cell.day || !cell.dateStr) {
            return <div key={i} className="w-full aspect-square" />
          }
          const rule = ruleForDate(cell.dateStr, rules)
          const isToday = new Date().toDateString() === new Date(cell.dateStr).toDateString()

          let bg = 'bg-slate-700/50 hover:bg-slate-600/70 calendar-transition'
          let textColor = 'text-slate-500'
          let extraClasses = ''
          
          if (rule) {
            if (!rule.isAvailable) {
              bg = 'bg-red-500/60 hover:bg-red-500/80 calendar-transition'
              textColor = 'text-red-100'
              extraClasses = 'status-indicator'
            } else if (rule.priceOverride != null) {
              bg = 'bg-amber-500/55 hover:bg-amber-500/75 calendar-transition'
              textColor = 'text-amber-100'
              extraClasses = 'calendar-hover-lift'
            } else {
              bg = 'bg-emerald-600/40 hover:bg-emerald-600/60 calendar-transition'
              textColor = 'text-emerald-200'
              extraClasses = 'calendar-hover-lift'
            }
          }
          
          if (isToday) {
            bg += ' ring-2 ring-indigo-400/30'
            extraClasses += ' status-indicator'
          }

          return (
            <div
              key={i}
              className={`w-full aspect-square rounded-[3px] flex items-center justify-center cursor-default transition-all ${bg} ${extraClasses}`}
              onMouseEnter={() => onHover({ dateStr: cell.dateStr!, rule, x: 0, y: 0 })}
              onMouseLeave={() => onHover(null)}
              style={{
                animationDelay: `${i * 20}ms`,
                animation: 'fadeIn 0.3s ease-out forwards'
              }}
            >
              <span className={`text-[9px] font-semibold leading-none ${textColor}`}>
                {cell.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Floating tooltip ─────────────────────────────────────────────────────────

function DayTooltip({ data, basePrice }: { data: HoveredDay; basePrice: number }) {
  const { dateStr, rule, x, y } = data
  const d = new Date(dateStr + 'T00:00:00')
  const label = d.toLocaleDateString('el-GR', { weekday: 'short', day: 'numeric', month: 'long' })

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ left: x, top: y - 8, transform: 'translate(-50%, -100%)' }}
    >
      <div className="bg-slate-800 border border-slate-600 rounded-xl px-3 py-2.5 shadow-2xl text-xs whitespace-nowrap">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {!rule && <p className="text-slate-400">Βασική τιμή: <span className="text-amber-400 font-bold">€{basePrice}</span>/βράδυ</p>}
        {rule && !rule.isAvailable && (
          <p className="text-red-400 font-semibold">
            Κλειστό{rule.reason ? <span className="text-red-300 font-normal"> — {rule.reason}</span> : ''}
          </p>
        )}
        {rule && rule.isAvailable && (
          <>
            <p className="text-slate-300">
              {rule.priceOverride != null
                ? <><span className="text-amber-400 font-bold">€{rule.priceOverride}</span>/βράδυ</>
                : <>Βασική: <span className="text-amber-400 font-bold">€{basePrice}</span>/βράδυ</>
              }
            </p>
            {rule.reason && <p className="text-slate-500 mt-0.5">{rule.reason}</p>}
          </>
        )}
      </div>
    </div>
  )
}

// ─── SeasonView ───────────────────────────────────────────────────────────────

const SEASON_MONTHS = [3, 4, 5, 6, 7, 8, 9] // Apr–Oct

function SeasonView({ year, rules, basePrice }: { year: number; rules: PricingRule[]; basePrice: number }) {
  const [hovered, setHovered] = useState<HoveredDay | null>(null)

  return (
    <div>
      {/* 4 + 3 layout */}
      <div className="grid grid-cols-4 gap-5 mb-5">
        {SEASON_MONTHS.slice(0, 4).map((m) => (
          <MonthGrid key={m} year={year} month={m} rules={rules} onHover={setHovered} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {SEASON_MONTHS.slice(4).map((m) => (
          <MonthGrid key={m} year={year} month={m} rules={rules} onHover={setHovered} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-700/40 flex-wrap">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Υπόμνημα:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-slate-700/50" />
          <span className="text-[10px] text-slate-500">Βασική €{basePrice}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-amber-500/55" />
          <span className="text-[10px] text-slate-500">Ειδική τιμή</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-emerald-600/40" />
          <span className="text-[10px] text-slate-500">Ορισμένη βασική</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-red-500/60" />
          <span className="text-[10px] text-slate-500">Κλειστό</span>
        </div>
      </div>

      {/* Portal tooltip */}
      {hovered && <DayTooltip data={hovered} basePrice={basePrice} />}
    </div>
  )
}

// ─── Month preset buttons ─────────────────────────────────────────────────────

function getMonthPresets(year: number) {
  return [
    { label: 'Απρ', start: `${year}-04-01`, end: `${year}-04-30` },
    { label: 'Μαι', start: `${year}-05-01`, end: `${year}-05-31` },
    { label: 'Ιουν', start: `${year}-06-01`, end: `${year}-06-30` },
    { label: 'Ιουλ', start: `${year}-07-01`, end: `${year}-07-31` },
    { label: 'Αυγ', start: `${year}-08-01`, end: `${year}-08-31` },
    { label: 'Σεπ', start: `${year}-09-01`, end: `${year}-09-30` },
    { label: 'Οκτ', start: `${year}-10-01`, end: `${year}-10-31` },
  ]
}

// ─── Rule form state ──────────────────────────────────────────────────────────

interface RuleForm {
  startDate: string
  endDate: string
  priceOverride: string
  isAvailable: boolean
  reason: string
}

const EMPTY_FORM: RuleForm = {
  startDate: '',
  endDate: '',
  priceOverride: '',
  isAvailable: true,
  reason: '',
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

export function RoomPricingDialog({ room, isOpen, onClose }: RoomPricingDialogProps) {
  const [rules, setRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())

  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null)
  const [form, setForm] = useState<RuleForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchRules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await roomsApi.getPricingRules(room.id)
      if (res.success) setRules(res.data)
    } catch {
      setError('Αποτυχία φόρτωσης περιόδων τιμών')
    } finally {
      setLoading(false)
    }
  }, [room.id])

  useEffect(() => {
    if (isOpen) fetchRules()
  }, [isOpen, fetchRules])

  if (!isOpen) return null

  const PRESETS = getMonthPresets(calendarYear)

  const openCreate = () => {
    setEditingRule(null)
    setForm(EMPTY_FORM)
    setError(null)
    setShowForm(true)
  }

  const openEdit = (rule: PricingRule) => {
    setEditingRule(rule)
    setForm({
      startDate: formatDateInput(rule.startDate),
      endDate: formatDateInput(rule.endDate),
      priceOverride: rule.priceOverride != null ? String(rule.priceOverride) : '',
      isAvailable: rule.isAvailable,
      reason: rule.reason || '',
    })
    setError(null)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.startDate || !form.endDate) {
      setError('Παρακαλώ συμπληρώστε ημερομηνία έναρξης και λήξης')
      return
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError('Η ημερομηνία λήξης πρέπει να είναι μετά την έναρξη')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload = {
        startDate: form.startDate,
        endDate: form.endDate,
        priceOverride: form.priceOverride !== '' ? Number(form.priceOverride) : null,
        isAvailable: form.isAvailable,
        reason: form.reason || undefined,
      }
      if (editingRule) {
        await roomsApi.updatePricingRule(room.id, editingRule.id, payload)
      } else {
        await roomsApi.createPricingRule(room.id, payload)
      }
      await fetchRules()
      setShowForm(false)
      setEditingRule(null)
      setForm(EMPTY_FORM)
    } catch {
      setError('Αποτυχία αποθήκευσης')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Διαγραφή αυτής της περιόδου;')) return
    setDeletingId(ruleId)
    try {
      await roomsApi.deletePricingRule(room.id, ruleId)
      await fetchRules()
    } catch {
      setError('Αποτυχία διαγραφής')
    } finally {
      setDeletingId(null)
    }
  }

  const roomDisplayName = room.nameGr || room.nameEn || room.name

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col mx-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white">Τιμές Περιόδων</h2>
            <p className="text-sm text-slate-400 mt-0.5">{roomDisplayName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Visual calendar ── */}
          <div className="px-6 py-5 border-b border-slate-700/60">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Εποχιακή Επισκόπηση</p>
              <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setCalendarYear(y => y - 1)}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="px-3 text-sm font-bold text-white min-w-[52px] text-center">{calendarYear}</span>
                <button
                  onClick={() => setCalendarYear(y => y + 1)}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="h-32 flex items-center justify-center text-slate-500 text-sm">Φόρτωση...</div>
            ) : (
              <SeasonView year={calendarYear} rules={rules} basePrice={room.basePrice} />
            )}
          </div>

          {/* ── Add / edit form ── */}
          <div className="px-6 py-4 border-b border-slate-700/60">
            {showForm ? (
              <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-white text-sm">
                  {editingRule ? 'Επεξεργασία Περιόδου' : 'Νέα Περίοδος'}
                </h3>

                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Month quick-pick */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Γρήγορη επιλογή μήνα {calendarYear}:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((p) => {
                      const active = form.startDate === p.start && form.endDate === p.end
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, startDate: p.start, endDate: p.end }))}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                            active ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                          }`}
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Από</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Έως (συμπεριλαμβανομένης)</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Available toggle */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer" onClick={() => setForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}>
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${form.isAvailable ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isAvailable ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-slate-300">Διαθέσιμο για κράτηση</span>
                  </label>
                  {!form.isAvailable && (
                    <span className="text-xs px-2.5 py-0.5 bg-red-500/15 text-red-400 rounded-full font-semibold border border-red-500/20">
                      Κλειστό
                    </span>
                  )}
                </div>

                {/* Price */}
                {form.isAvailable && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Τιμή / βράδυ (€)
                      <span className="text-slate-600 ml-1">— αφήστε κενό για βασική τιμή €{room.basePrice}</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">€</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.priceOverride}
                        onChange={(e) => setForm(prev => ({ ...prev, priceOverride: e.target.value }))}
                        placeholder={String(room.basePrice)}
                        className="w-full pl-7 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                      />
                    </div>
                  </div>
                )}

                {/* Label */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Ετικέτα (προαιρετικό)</label>
                  <input
                    type="text"
                    value={form.reason}
                    onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="π.χ. Καλοκαίρι 2025, Πάσχα, Ανακαίνιση..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingRule(null); setError(null) }}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Ακύρωση
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-indigo-400 border border-dashed border-indigo-500/40 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                Προσθήκη Νέας Περιόδου
              </button>
            )}
          </div>

          {/* ── Rules list ── */}
          <div className="px-6 py-4">
            {error && !showForm && (
              <div className="flex items-center gap-2 px-4 py-3 mb-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {loading ? (
              <p className="text-sm text-slate-400 text-center py-4">Φόρτωση...</p>
            ) : rules.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500">Δεν υπάρχουν ορισμένες περίοδοι.</p>
                <p className="text-xs text-slate-600 mt-1">Εφαρμόζεται πάντα η βασική τιμή €{room.basePrice}/βράδυ.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  {rules.length} Ορισμένες Περίοδοι
                </p>
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`group flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                      !rule.isAvailable
                        ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                        : rule.priceOverride != null
                        ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10'
                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                        !rule.isAvailable ? 'bg-red-500' : rule.priceOverride != null ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-slate-200">
                            {formatDateDisplay(rule.startDate)}
                          </span>
                          <span className="text-slate-600 text-xs">→</span>
                          <span className="text-sm font-semibold text-slate-200">
                            {formatDateDisplay(rule.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {!rule.isAvailable && (
                            <span className="text-xs font-semibold text-red-400">Κλειστό</span>
                          )}
                          {rule.isAvailable && rule.priceOverride != null && (
                            <span className="text-xs font-bold text-amber-400">€{rule.priceOverride}/βράδυ</span>
                          )}
                          {rule.isAvailable && rule.priceOverride == null && (
                            <span className="text-xs text-slate-500">βασική τιμή €{room.basePrice}</span>
                          )}
                          {rule.reason && (
                            <span className="text-xs text-slate-500">· {rule.reason}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(rule)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/15 rounded-lg transition-colors"
                        title="Επεξεργασία"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        disabled={deletingId === rule.id}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition-colors disabled:opacity-50"
                        title="Διαγραφή"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Βασική τιμή: <span className="text-amber-400 font-bold">€{room.basePrice}/βράδυ</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  )
}
