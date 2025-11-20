import { User } from '../api/types'

/**
 * Converts users array to CSV format
 */
export function usersToCSV(users: User[]): string {
  if (users.length === 0) {
    return ''
  }

  // CSV Headers
  const headers = [
    'Email',
    'Name',
    'Phone',
    'Role',
    'Status',
    'Registration Date',
  ]

  // Convert users to CSV rows
  const rows = users.map((user) => {
    return [
      user.email || '',
      user.name || '',
      user.phone || '',
      user.role || '',
      user.isActive ? 'Active' : 'Inactive',
      user.createdAt ? new Date(user.createdAt).toLocaleDateString('el-GR') : '',
    ].map((field) => {
      // Escape fields that contain commas, quotes, or newlines
      const stringField = String(field)
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`
      }
      return stringField
    })
  })

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  return csvContent
}

/**
 * Downloads users as CSV file
 */
export function downloadUsersCSV(users: User[], filename: string = 'users.csv') {
  const csvContent = usersToCSV(users)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

