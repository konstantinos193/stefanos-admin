'use client'

import { useState } from 'react'
import { HelpContent, HelpSearch } from '@/components/help/HelpContent'

export default function HelpPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Βοήθεια</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Οδηγίες για τη χρήση του πίνακα διαχείρισης
        </p>
      </div>

      <HelpSearch value={search} onChange={setSearch} />
      <HelpContent search={search} />
    </div>
  )
}
