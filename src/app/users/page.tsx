'use client'

import { useState, useRef } from 'react'
import { UsersHeader } from '@/components/users/UsersHeader'
import { UsersTable, UsersTableRef } from '@/components/users/UsersTable'
import { UsersFilters } from '@/components/users/UsersFilters'
import { AddUserModal } from '@/components/users/AddUserModal'
import { ImportUsersModal } from '@/components/users/ImportUsersModal'
import { EditUserModal } from '@/components/users/EditUserModal'
import { DeleteUserModal } from '@/components/users/DeleteUserModal'
import { usersApi } from '@/lib/api/users'
import { downloadUsersCSV } from '@/lib/utils/exportUsers'
import { User } from '@/lib/api/types'

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const usersTableRef = useRef<UsersTableRef>(null)

  const handleAddUser = () => {
    setIsModalOpen(true)
  }

  const handleUserCreated = async () => {
    setIsModalOpen(false)
    // Small delay to ensure backend has processed the creation
    await new Promise(resolve => setTimeout(resolve, 300))
    // Refresh the users table and reset to page 1
    if (usersTableRef.current) {
      usersTableRef.current.refresh()
    }
  }

  const handleExport = async () => {
    try {
      const users = await usersApi.getAllForExport()
      const timestamp = new Date().toISOString().split('T')[0]
      downloadUsersCSV(users, `users_${timestamp}.csv`)
    } catch (error: any) {
      console.error('Error exporting users:', error)
      alert(`Σφάλμα εξαγωγής: ${error.message}`)
    }
  }

  const handleImport = () => {
    setIsImportModalOpen(true)
  }

  const handleImportSuccess = async () => {
    setIsImportModalOpen(false)
    // Small delay to ensure backend has processed the imports
    await new Promise(resolve => setTimeout(resolve, 500))
    // Refresh the users table and reset to page 1
    if (usersTableRef.current) {
      usersTableRef.current.refresh()
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setRoleFilter('all')
    setStatusFilter('all')
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleUserUpdated = async () => {
    setIsEditModalOpen(false)
    setSelectedUser(null)
    await new Promise(resolve => setTimeout(resolve, 300))
    if (usersTableRef.current) {
      usersTableRef.current.refresh()
    }
  }

  const handleUserDeleted = async () => {
    if (!selectedUser) return
    
    setDeleteLoading(true)
    try {
      await usersApi.delete(selectedUser.id)
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      await new Promise(resolve => setTimeout(resolve, 300))
      if (usersTableRef.current) {
        usersTableRef.current.refresh()
      }
    } catch (error: any) {
      console.error('Error deleting user:', error)
      alert(`Σφάλμα διαγραφής: ${error.message}`)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <UsersHeader 
        onAddUser={handleAddUser}
        onExport={handleExport}
        onImport={handleImport}
      />
      <UsersFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onRoleChange={setRoleFilter}
        onStatusChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />
      <UsersTable
        ref={usersTableRef}
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUserCreated}
      />
      <ImportUsersModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSuccess={handleUserUpdated}
        user={selectedUser}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleUserDeleted}
        user={selectedUser}
        loading={deleteLoading}
      />
    </div>
  )
}

