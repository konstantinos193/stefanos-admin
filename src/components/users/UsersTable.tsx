'use client'

import { MoreVertical, Edit, Trash2, Mail, Phone } from 'lucide-react'
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { usersApi } from '@/lib/api/users'
import { User } from '@/lib/api/types'
import { UserActionsMenu } from './UserActionsMenu'
import { matchesSearch } from '@/lib/utils/textNormalization'

export interface UsersTableRef {
  refresh: () => void
}

interface UsersTableProps {
  searchQuery?: string
  roleFilter?: string
  statusFilter?: string
  onEditUser?: (user: User) => void
  onDeleteUser?: (user: User) => void
}

export const UsersTable = forwardRef<UsersTableRef, UsersTableProps>(({ searchQuery = '', roleFilter = 'all', statusFilter = 'all', onEditUser, onDeleteUser }, ref) => {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const fetchUsers = async (pageToFetch: number = page) => {
    try {
      setLoading(true)
      const response = await usersApi.getAll(pageToFetch, 10)
      const fetchedUsers = response.data?.users || []
      setAllUsers(fetchedUsers)
      setUsers(fetchedUsers)
      setTotalPages(response.data?.pagination?.totalPages || 1)
      setTotal(response.data?.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
      setAllUsers([])
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch all users when filters are active
  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const allUsersList = await usersApi.getAllForExport()
      setAllUsers(allUsersList)
      return allUsersList
    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Apply filters to users
  const applyFilters = (usersToFilter: User[]) => {
    let filtered = [...usersToFilter]

    // Search filter (accent-insensitive and case-insensitive)
    if (searchQuery.trim()) {
      filtered = filtered.filter((user) => {
        return (
          matchesSearch(user.name || '', searchQuery) ||
          matchesSearch(user.email, searchQuery) ||
          matchesSearch(user.phone || '', searchQuery)
        )
      })
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter((user) => user.isActive === true)
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter((user) => {
          const matches = user.isActive === false
          return matches
        })
      }
    }

    console.log('Filtering users:', {
      totalUsers: usersToFilter.length,
      statusFilter,
      filteredCount: filtered.length,
      sampleUser: filtered[0] ? { email: filtered[0].email, isActive: filtered[0].isActive } : null
    })

    return filtered
  }

  // Store filtered users for pagination
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Check if filters are active
  const hasFilters = searchQuery.trim() || roleFilter !== 'all' || statusFilter !== 'all'

  // Initial load
  useEffect(() => {
    if (!hasFilters) {
      fetchUsers(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply filters when they change
  useEffect(() => {
    if (hasFilters) {
      setIsFiltering(true)
      // When filters are active, fetch all users and filter client-side
      fetchAllUsers().then((allUsersList) => {
        const filtered = applyFilters(allUsersList)
        setFilteredUsers(filtered)
        setTotal(filtered.length)
        setTotalPages(Math.ceil(filtered.length / 10))
        setPage(1) // Reset to first page when filters change
        setIsFiltering(false)
      }).catch(() => {
        setIsFiltering(false)
      })
    } else {
      // No filters, use paginated data
      setIsFiltering(false)
      setFilteredUsers([])
      setPage(1) // Reset to first page when clearing filters
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, roleFilter, statusFilter])

  // Handle data display - either filtered or paginated
  useEffect(() => {
    if (hasFilters) {
      // Use filtered results with pagination
      if (filteredUsers.length > 0 && !isFiltering) {
        const startIndex = (page - 1) * 10
        const endIndex = startIndex + 10
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
        setUsers(paginatedUsers)
        console.log('Setting filtered users:', {
          page,
          startIndex,
          endIndex,
          totalFiltered: filteredUsers.length,
          showing: paginatedUsers.length,
          statusFilter,
          firstUserStatus: paginatedUsers[0]?.isActive
        })
      } else if (filteredUsers.length === 0 && !isFiltering) {
        // No results after filtering
        setUsers([])
      }
    } else {
      // Use server-side pagination
      if (!isFiltering) {
        fetchUsers(page)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filteredUsers, hasFilters, isFiltering])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      console.log('Refreshing users table...')
      // Always reset to page 1 and fetch
      setPage(1)
      // Force immediate fetch to ensure we get the latest data
      fetchUsers(1)
    }
  }))

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'USER':
        return 'bg-blue-100 text-blue-800'
      case 'PROPERTY_OWNER':
        return 'bg-orange-100 text-orange-800'
      case 'MANAGER':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Ενεργός' : 'Ανενεργός'
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Διαχειριστής'
      case 'USER':
        return 'Χρήστης'
      case 'PROPERTY_OWNER':
        return 'Ιδιοκτήτης'
      case 'MANAGER':
        return 'Διαχειριστής'
      default:
        return role
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR')
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-600">Φόρτωση χρηστών...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΧΡΗΣΤΗΣ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΕΠΙΚΟΙΝΩΝΙΑ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΡΟΛΟΣ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΚΑΤΑΣΤΑΣΗ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΗΜΕΡΟΜΗΝΙΑ ΕΓΓΡΑΦΗΣ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΕΝΕΡΓΕΙΕΣ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Δεν βρέθηκαν χρήστες
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {getInitials(user.name, user.email)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || 'Χωρίς όνομα'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center space-x-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span>{user.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                      {getStatusLabel(user.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditUser?.(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Επεξεργασία"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser?.(user)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Διαγραφή"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <UserActionsMenu
                        user={user}
                        onEdit={() => onEditUser?.(user)}
                        onDelete={() => onDeleteUser?.(user)}
                        onUpdate={() => {}}
                        onRefresh={() => {
                          if (ref && 'current' in ref && ref.current) {
                            ref.current.refresh()
                          }
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Εμφάνιση <span className="font-medium">{(page - 1) * 10 + 1}</span> έως{' '}
          <span className="font-medium">{Math.min(page * 10, total)}</span> από{' '}
          <span className="font-medium">{total}</span> αποτελέσματα
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Προηγούμενο
          </button>
          <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
            {page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Επόμενο
          </button>
        </div>
      </div>
    </div>
  )
})

UsersTable.displayName = 'UsersTable'

