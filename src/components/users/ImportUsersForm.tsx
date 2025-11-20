'use client'

import { useState, useRef } from 'react'
import { Upload, FileCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { usersApi } from '@/lib/api/users'
import { User } from '@/lib/api/types'

interface ImportUsersFormProps {
  onSuccess: () => void
  onCancel: () => void
}

interface ParsedUser {
  email: string
  name: string
  phone?: string
  role: 'USER' | 'ADMIN' | 'PROPERTY_OWNER' | 'MANAGER'
  password: string
}

export function ImportUsersForm({ onSuccess, onCancel }: ImportUsersFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Το αρχείο πρέπει να είναι CSV'])
      return
    }

    setFile(selectedFile)
    setErrors([])
    setParsedUsers([])
    setImportResults(null)

    // Parse CSV file
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseCSV(text)
        setParsedUsers(parsed.users)
        setErrors(parsed.errors)
      } catch (error: any) {
        setErrors([`Σφάλμα ανάγνωσης αρχείου: ${error.message}`])
      }
    }
    reader.readAsText(selectedFile)
  }

  const parseCSV = (csvText: string): { users: ParsedUser[]; errors: string[] } => {
    const lines = csvText.split('\n').filter((line) => line.trim())
    if (lines.length < 2) {
      return { users: [], errors: ['Το αρχείο πρέπει να περιέχει τουλάχιστον μια επικεφαλίδα και μια γραμμή δεδομένων'] }
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const requiredHeaders = ['email', 'name', 'password']
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

    if (missingHeaders.length > 0) {
      return {
        users: [],
        errors: [`Λείπουν οι απαιτούμενες στήλες: ${missingHeaders.join(', ')}`],
      }
    }

    const users: ParsedUser[] = []
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const values = parseCSVLine(line)
      
      if (values.length !== headers.length) {
        errors.push(`Γραμμή ${i + 1}: Αριθμός στηλών δεν ταιριάζει`)
        continue
      }

      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || ''
      })

      // Validate required fields
      if (!row.email || !row.name || !row.password) {
        errors.push(`Γραμμή ${i + 1}: Λείπουν υποχρεωτικά πεδία`)
        continue
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(row.email)) {
        errors.push(`Γραμμή ${i + 1}: Μη έγκυρο email (${row.email})`)
        continue
      }

      // Validate password
      if (row.password.length < 8) {
        errors.push(`Γραμμή ${i + 1}: Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες`)
        continue
      }

      // Validate role
      const validRoles = ['USER', 'ADMIN', 'PROPERTY_OWNER', 'MANAGER']
      const role = (row.role || 'USER').toUpperCase()
      if (!validRoles.includes(role)) {
        errors.push(`Γραμμή ${i + 1}: Μη έγκυρος ρόλος (${row.role}). Χρησιμοποιείται USER`)
      }

      users.push({
        email: row.email,
        name: row.name,
        phone: row.phone || undefined,
        role: (validRoles.includes(role) ? role : 'USER') as ParsedUser['role'],
        password: row.password,
      })
    }

    return { users, errors }
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)
    return result
  }

  const handleImport = async () => {
    if (parsedUsers.length === 0) {
      setErrors(['Δεν υπάρχουν έγκυροι χρήστες για εισαγωγή'])
      return
    }

    setImporting(true)
    setErrors([])
    let successCount = 0
    let failedCount = 0

    for (const user of parsedUsers) {
      try {
        await usersApi.create(user)
        successCount++
      } catch (error: any) {
        failedCount++
        setErrors((prev) => [...prev, `Σφάλμα δημιουργίας ${user.email}: ${error.message}`])
      }
    }

    setImportResults({ success: successCount, failed: failedCount })
    setImporting(false)

    if (successCount > 0) {
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Επιλέξτε CSV Αρχείο
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {file ? file.name : 'Κάντε κλικ για επιλογή CSV αρχείου'}
          </p>
        </div>
      </div>

      {/* Preview */}
      {parsedUsers.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileCheck className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">
              Βρέθηκαν {parsedUsers.length} έγκυροι χρήστες
            </span>
          </div>
          <div className="text-sm text-green-700">
            <p>Email: {parsedUsers[0].email}, Name: {parsedUsers[0].name}, Role: {parsedUsers[0].role}</p>
            {parsedUsers.length > 1 && <p className="mt-1">... και {parsedUsers.length - 1} ακόμη</p>}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">Σφάλματα</span>
          </div>
          <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Import Results */}
      {importResults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Αποτελέσματα Εισαγωγής</span>
          </div>
          <div className="text-sm text-blue-700">
            <p>Επιτυχημένα: {importResults.success}</p>
            {importResults.failed > 0 && <p>Αποτυχημένα: {importResults.failed}</p>}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={importing}
        >
          Ακύρωση
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={parsedUsers.length === 0 || importing}
          className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Εισαγωγή...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Εισαγωγή {parsedUsers.length} Χρηστών</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

