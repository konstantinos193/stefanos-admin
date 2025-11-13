'use client'

export function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Γενικές Πληροφορίες</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Πλήρες Όνομα
            </label>
            <input type="text" className="input" defaultValue="Διαχειριστής" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input type="email" className="input" defaultValue="admin@stefanos.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Τηλέφωνο
            </label>
            <input type="tel" className="input" defaultValue="+30 123 456 7890" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ζώνη Ώρας
            </label>
            <select className="input">
              <option>Europe/Athens (GMT+2)</option>
              <option>UTC (GMT+0)</option>
            </select>
          </div>
          <button className="btn btn-primary">Αποθήκευση Αλλαγών</button>
        </div>
      </div>
    </div>
  )
}

