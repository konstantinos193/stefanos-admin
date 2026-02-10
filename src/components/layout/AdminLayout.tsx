'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#0f172a' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-72">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

