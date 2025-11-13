'use client'

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Theme</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
            <div className="h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-2"></div>
            <p className="text-sm font-medium text-center">Light</p>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
            <div className="h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg mb-2"></div>
            <p className="text-sm font-medium text-center">Dark</p>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
            <div className="h-20 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-lg mb-2"></div>
            <p className="text-sm font-medium text-center">Auto</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Language</h2>
        <select className="input">
          <option>English</option>
          <option>Greek (Ελληνικά)</option>
        </select>
      </div>
      <button className="btn btn-primary">Save Changes</button>
    </div>
  )
}

