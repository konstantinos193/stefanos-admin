'use client'

import { CreditCard, Download, Receipt } from 'lucide-react'

export function BillingSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Χρέωση</h2>
        <p className="text-gray-600 mb-6">Διαχείριση πληρωμών και συνδρομών</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Τρέχουσα Συνδρομή</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Πλάνο:</span>
                <span className="font-semibold text-gray-900">Professional</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Κόστος:</span>
                <span className="font-semibold text-gray-900">€99/μήνα</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Επόμενη χρέωση:</span>
                <span className="font-semibold text-gray-900">15 Φεβρουαρίου 2024</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Receipt className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Τελευταίες Χρεώσεις</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">15 Ιανουαρίου 2024</span>
                <span className="font-semibold text-gray-900">€99.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">15 Δεκεμβρίου 2023</span>
                <span className="font-semibold text-gray-900">€99.00</span>
              </div>
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>Εξαγωγή λογαριασμών</span>
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Μέθοδος Πληρωμής</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">**** **** **** 4242</span>
              <span className="text-sm text-gray-500">Expires 12/25</span>
            </div>
            <button className="btn btn-secondary">Αλλαγή</button>
          </div>
        </div>
      </div>
    </div>
  )
}

