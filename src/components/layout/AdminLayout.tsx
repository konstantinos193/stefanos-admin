'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import clsx from 'clsx'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') setIsCollapsed(true)
  }, [])

  const toggle = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#0f172a' }}>
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
      <div
        className={clsx(
          'flex-1 flex flex-col transition-[margin-left] duration-300 ease-in-out min-w-0',
          isCollapsed ? 'ml-14' : 'ml-64',
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
