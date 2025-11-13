'use client'

import { HelpCircle, Book, MessageCircle, Mail, FileText } from 'lucide-react'

const helpSections = [
  {
    title: 'Getting Started',
    icon: Book,
    color: 'bg-blue-500',
    items: [
      'How to navigate the admin panel',
      'Setting up your account',
      'Understanding the dashboard',
    ],
  },
  {
    title: 'User Management',
    icon: HelpCircle,
    color: 'bg-green-500',
    items: [
      'Adding new users',
      'Managing user permissions',
      'User roles and access levels',
    ],
  },
  {
    title: 'Property Management',
    icon: FileText,
    color: 'bg-purple-500',
    items: [
      'Adding properties',
      'Editing property details',
      'Managing property listings',
    ],
  },
  {
    title: 'Bookings',
    icon: MessageCircle,
    color: 'bg-orange-500',
    items: [
      'Creating bookings',
      'Managing reservations',
      'Booking status updates',
    ],
  },
]

export function HelpContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {helpSections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.title} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`${section.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
              Learn more →
            </button>
          </div>
        )
      })}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <button className="btn btn-primary w-full">Contact Support</button>
      </div>
    </div>
  )
}

