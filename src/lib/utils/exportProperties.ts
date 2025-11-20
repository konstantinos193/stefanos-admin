import { Property } from '@/lib/api/types'

export function propertiesToCSV(properties: Property[]): string {
  const headers = [
    'ID',
    'Τίτλος (GR)',
    'Τίτλος (EN)',
    'Τύπος',
    'Κατάσταση',
    'Διεύθυνση',
    'Πόλη',
    'Χώρα',
    'Υπνοδωμάτια',
    'Μπάνια',
    'Περιοχή (m²)',
    'Βασική Τιμή',
    'Νόμισμα',
    'Μέγιστοι Επισκέπτες',
    'Ημερομηνία Δημιουργίας'
  ]

  const rows = properties.map((property) => [
    property.id,
    property.titleGr || '',
    property.titleEn || '',
    property.type,
    property.status,
    property.address || '',
    property.city || '',
    property.country || '',
    property.bedrooms?.toString() || '0',
    property.bathrooms?.toString() || '0',
    property.area?.toString() || '',
    property.basePrice?.toString() || '0',
    property.currency || 'EUR',
    property.maxGuests?.toString() || '0',
    new Date(property.createdAt).toLocaleDateString('el-GR')
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  return csvContent
}

export function downloadPropertiesCSV(properties: Property[], filename: string = 'properties.csv') {
  const csv = propertiesToCSV(properties)
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

