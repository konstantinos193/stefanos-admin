import { UsersHeader } from '@/components/users/UsersHeader'
import { UsersTable } from '@/components/users/UsersTable'
import { UsersFilters } from '@/components/users/UsersFilters'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersFilters />
      <UsersTable />
    </div>
  )
}

