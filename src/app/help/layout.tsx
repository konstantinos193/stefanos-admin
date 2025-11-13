import { AdminLayout } from '@/components/layout/AdminLayout'

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

