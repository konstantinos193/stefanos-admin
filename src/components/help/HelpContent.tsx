'use client'

import { useState, useEffect } from 'react'
import { HelpCircle, Book, MessageCircle, Mail, FileText } from 'lucide-react'

interface HelpSection {
  id: string
  title: string
  description: string
  icon: string
  color: string
  items: string[]
  content: {
    overview: string
    sections: Array<{
      title: string
      content: string
    }>
  }
}

export function HelpContent() {
  const [helpSections, setHelpSections] = useState<HelpSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHelpContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/help`)
        if (response.ok) {
          const data = await response.json()
          setHelpSections(data.data.helpSections)
        } else {
          // Fallback to static content if API fails
          setHelpSections([
            {
              id: 'getting-started',
              title: 'Getting Started',
              description: 'Learn the basics of using the admin panel',
              icon: 'Book',
              color: 'bg-blue-500',
              items: [
                'How to navigate the admin panel',
                'Setting up your account',
                'Understanding the dashboard',
              ],
              content: {
                overview: 'Welcome to the SMH Holdings Admin Panel.',
                sections: []
              }
            },
            {
              id: 'user-management',
              title: 'User Management',
              description: 'Manage users and their permissions',
              icon: 'HelpCircle',
              color: 'bg-green-500',
              items: [
                'Adding new users',
                'Managing user permissions',
                'User roles and access levels',
              ],
              content: {
                overview: 'User management allows you to control access.',
                sections: []
              }
            },
            {
              id: 'property-management',
              title: 'Property Management',
              description: 'Manage your properties and listings',
              icon: 'FileText',
              color: 'bg-purple-500',
              items: [
                'Adding properties',
                'Editing property details',
                'Managing property listings',
              ],
              content: {
                overview: 'Property management is the core of your business.',
                sections: []
              }
            },
            {
              id: 'bookings',
              title: 'Bookings',
              description: 'Manage reservations and bookings',
              icon: 'MessageCircle',
              color: 'bg-orange-500',
              items: [
                'Creating bookings',
                'Managing reservations',
                'Booking status updates',
              ],
              content: {
                overview: 'Booking management helps you track reservations.',
                sections: []
              }
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch help content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHelpContent()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Book': return Book
      case 'HelpCircle': return HelpCircle
      case 'FileText': return FileText
      case 'MessageCircle': return MessageCircle
      default: return HelpCircle
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {helpSections.map((section) => {
        const Icon = getIcon(section.icon)
        return (
          <div key={section.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`${section.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
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

