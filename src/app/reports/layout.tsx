import { AdminLayout } from '@/components/layout/AdminLayout'

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

