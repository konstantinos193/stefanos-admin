import { AdminLayout } from '@/components/layout/AdminLayout'

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

