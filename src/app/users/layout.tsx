import { AdminLayout } from '@/components/layout/AdminLayout'

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

