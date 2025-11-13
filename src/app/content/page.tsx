import { FileEdit, Plus } from 'lucide-react'

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Διαχείριση Περιεχομένου</h1>
          <p className="text-gray-600 mt-1">Διαχείριση περιεχομένου και εκδόσεων</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Νέο Περιεχόμενο</span>
        </button>
      </div>
      <div className="card">
        <div className="p-6 text-center text-gray-500">
          <FileEdit className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Διαθέσιμο σύντομα</p>
        </div>
      </div>
    </div>
  )
}

