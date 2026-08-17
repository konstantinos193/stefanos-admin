'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import clsx from 'clsx'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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

  const toggleMobile = () => {
    setIsMobileOpen(prev => !prev)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={toggle}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div
        className={clsx(
          'flex-1 flex flex-col transition-[margin-left] duration-300 ease-in-out min-w-0 overflow-hidden',
          // Desktop: apply margin based on collapsed state
          'md:ml-0',
          isCollapsed ? 'md:ml-14' : 'md:ml-64',
          // Mobile: no margin (sidebar is hidden/drawer)
          'ml-0'
        )}
      >
        <Header onMobileMenuToggle={toggleMobile} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  )
}
