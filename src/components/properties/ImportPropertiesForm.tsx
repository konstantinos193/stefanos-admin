'use client'

import { useState, useRef } from 'react'
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import { propertiesApi } from '@/lib/api/properties'
import { Property } from '@/lib/api/types'

// ImportPropertiesForm component for importing properties from CSV

interface ImportPropertiesFormProps {
  onSuccess: () => void
  onCancel: () => void
}

interface ParsedProperty {
  titleGr: string
  titleEn?: string
  type: Property['type']
  status: Property['status']
  city: string
  country: string
  address?: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  area?: number
  basePrice: number
  currency: string
}

export function ImportPropertiesForm({ onSuccess, onCancel }: ImportPropertiesFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedProperties, setParsedProperties] = useState<ParsedProperty[]>([])
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
    setParsedProperties([])
    setImportResults(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseCSV(text)
        setParsedProperties(parsed.properties)
        setErrors(parsed.errors)
      } catch (error: any) {
        setErrors([`Σφάλμα ανάγνωσης αρχείου: ${error.message}`])
      }
    }
    reader.readAsText(selectedFile)
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const parseCSV = (csvText: string): { properties: ParsedProperty[]; errors: string[] } => {
    const lines = csvText.split('\n').filter((line) => line.trim())
    if (lines.length < 2) {
      return { properties: [], errors: ['Το αρχείο πρέπει να περιέχει τουλάχιστον μια επικεφαλίδα και μια γραμμή δεδομένων'] }
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const requiredHeaders = ['titlegr', 'type', 'status', 'city', 'country', 'bedrooms', 'bathrooms', 'maxguests', 'baseprice', 'currency']
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

    if (missingHeaders.length > 0) {
      return {
        properties: [],
        errors: [`Λείπουν οι απαιτούμενες στήλες: ${missingHeaders.join(', ')}`],
      }
    }

    const properties: ParsedProperty[] = []
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

      if (!row.titlegr || !row.type || !row.status || !row.city || !row.country) {
        errors.push(`Γραμμή ${i + 1}: Λείπουν υποχρεωτικά πεδία`)
        continue
      }

      const bedrooms = parseInt(row.bedrooms) || 0
      const bathrooms = parseInt(row.bathrooms) || 0
      const maxGuests = parseInt(row.maxguests) || 1
      const basePrice = parseFloat(row.baseprice) || 0
      const area = row.area ? parseFloat(row.area) : undefined

      if (!['APARTMENT', 'HOUSE', 'ROOM', 'COMMERCIAL', 'STORAGE', 'VACATION_RENTAL', 'LUXURY', 'INVESTMENT'].includes(row.type.toUpperCase())) {
        errors.push(`Γραμμή ${i + 1}: Μη έγκυρος τύπος ακινήτου`)
        continue
      }

      if (!['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'SUSPENDED'].includes(row.status.toUpperCase())) {
        errors.push(`Γραμμή ${i + 1}: Μη έγκυρη κατάσταση`)
        continue
      }

      properties.push({
        titleGr: row.titlegr,
        titleEn: row.titleen || '',
        type: row.type.toUpperCase() as Property['type'],
        status: row.status.toUpperCase() as Property['status'],
        city: row.city,
        country: row.country,
        address: row.address || '',
        bedrooms,
        bathrooms,
        maxGuests,
        area,
        basePrice,
        currency: row.currency || 'EUR',
      })
    }

    return { properties, errors }
  }

  const handleImport = async () => {
    if (parsedProperties.length === 0) {
      setErrors(['Δεν υπάρχουν έγκυρα ακίνητα για εισαγωγή'])
      return
    }

    setImporting(true)
    setErrors([])
    let successCount = 0
    let failedCount = 0

    for (const property of parsedProperties) {
      try {
        await propertiesApi.create(property)
        successCount++
      } catch (error: any) {
        console.error('Error importing property:', error)
        failedCount++
      }
    }

    setImportResults({ success: successCount, failed: failedCount })
    if (successCount > 0) {
      setTimeout(() => {
        onSuccess()
      }, 1000)
    }
    setImporting(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Επιλέξτε CSV Αρχείο
        </label>
        <div className="flex items-center space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Επιλογή Αρχείου</span>
          </button>
          {file && (
            <span className="text-sm text-gray-600">{file.name}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Το αρχείο πρέπει να περιέχει: titleGr, type, status, city, country, bedrooms, bathrooms, maxGuests, basePrice, currency
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-2">Σφάλματα:</h4>
              <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {parsedProperties.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Βρέθηκαν {parsedProperties.length} έγκυρα ακίνητα
              </h4>
              <div className="text-sm text-green-700 max-h-40 overflow-y-auto">
                <ul className="space-y-1">
                  {parsedProperties.slice(0, 10).map((property, index) => (
                    <li key={index}>• {property.titleGr} - {property.city}</li>
                  ))}
                  {parsedProperties.length > 10 && (
                    <li>... και {parsedProperties.length - 10} ακόμα</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {importResults && (
        <div className={`border rounded-lg p-4 ${importResults.failed > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
          <div className="text-sm">
            <p className="font-medium">Εισαγωγή ολοκληρώθηκε:</p>
            <p className="text-green-700">Επιτυχημένα: {importResults.success}</p>
            {importResults.failed > 0 && (
              <p className="text-red-700">Αποτυχημένα: {importResults.failed}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={importing}
        >
          Ακύρωση
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={parsedProperties.length === 0 || importing}
          className="btn btn-primary"
        >
          {importing ? 'Εισαγωγή...' : `Εισαγωγή ${parsedProperties.length} Ακινήτων`}
        </button>
      </div>
    </div>
  )
}

