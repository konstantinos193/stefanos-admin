import { AdminLayout } from '@/components/layout/AdminLayout'

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

