'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
  value: string
  /** Accessible description, e.g. "Αντιγραφή τηλεφώνου". */
  title: string
  className?: string
}

export function CopyButton({ value, title, className = '' }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      resetTimer.current = setTimeout(() => setIsCopied(false), 1600)
    } catch {
      // Clipboard blocked (insecure context / permissions) — nothing useful to show the user.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={title}
      aria-label={title}
      className={`shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-700/60 hover:text-slate-200 ${className}`}
    >
      {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}
