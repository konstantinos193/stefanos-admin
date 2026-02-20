'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, User, Calendar, Building, Check, CheckCheck, Filter, Search } from 'lucide-react'
import { messagesApi, Message, MessagesResponse } from '@/lib/api/messages'
import { formatDistanceToNow } from 'date-fns'
import { el } from 'date-fns/locale'

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBooking, setFilterBooking] = useState('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchMessages()
  }, [pagination.page, filterBooking, showUnreadOnly])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      }
      
      if (filterBooking) params.bookingId = filterBooking
      if (showUnreadOnly) params.isRead = false

      const response: MessagesResponse = await messagesApi.getAll(params)
      setMessages(response.data.messages)
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messagesApi.markAsRead(messageId)
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ))
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null)
      }
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

  const filteredMessages = messages.filter(message => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        message.content.toLowerCase().includes(searchLower) ||
        message.sender?.name?.toLowerCase().includes(searchLower) ||
        message.booking?.guestName.toLowerCase().includes(searchLower) ||
        message.bookingId.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  if (loading && messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Μηνύματα</h1>
            <p className="text-gray-600 mt-1">Διαχείριση μηνυμάτων και επικοινωνίας</p>
          </div>
        </div>
        <div className="card">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Φόρτωση μηνυμάτων...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Μηνύματα</h1>
            <p className="text-gray-600 mt-1">Διαχείριση μηνυμάτων και επικοινωνίας</p>
          </div>
        </div>
        <div className="card">
          <div className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <MessageSquare className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-red-600 font-semibold">Σφάλμα κατά τη φόρτωση των μηνυμάτων</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchMessages}
              className="btn btn-primary mt-4"
            >
              Προσπάθεια ξανά
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Μηνύματα</h1>
          <p className="text-gray-600 mt-1">Διαχείριση μηνυμάτων και επικοινωνίας</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {messages.filter(m => !m.isRead).length} μη αναγνωσμένα
          </span>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Αναζήτηση μηνυμάτων..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showUnreadOnly 
                    ? 'bg-blue-100 text-blue-700 border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                } border`}
              >
                <Filter className="h-4 w-4 inline mr-1" />
                Μη αναγνωσμένα
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Δεν βρέθηκαν μηνύματα</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !message.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(message)
                  if (!message.isRead) {
                    handleMarkAsRead(message.id)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex items-center space-x-1">
                        {message.isRead ? (
                          <CheckCheck className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          !message.isRead ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {message.sender?.name || 'Άγνωστος χρήστης'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.createdAt), { 
                          addSuffix: true, 
                          locale: el 
                        })}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.type === 'TEXT' ? 'bg-gray-100 text-gray-700' :
                        message.type === 'IMAGE' ? 'bg-green-100 text-green-700' :
                        message.type === 'FILE' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {message.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-2 line-clamp-2">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {message.booking && (
                        <div className="flex items-center space-x-1">
                          <Building className="h-3 w-3" />
                          <span>{message.booking.guestName}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Booking ID: {message.bookingId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Εμφάνιση {messages.length} από {pagination.total} μηνυμάτων
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Προηγούμενο
                </button>
                <span className="text-sm text-gray-500">
                  Σελίδα {pagination.page} από {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Επόμενο
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Λεπτομέρειες μηνύματος</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(selectedMessage.createdAt), { 
                        addSuffix: true, 
                        locale: el 
                      })}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedMessage.type === 'TEXT' ? 'bg-gray-100 text-gray-700' :
                      selectedMessage.type === 'IMAGE' ? 'bg-green-100 text-green-700' :
                      selectedMessage.type === 'FILE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {selectedMessage.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {selectedMessage.sender?.name || 'Άγνωστος χρήστης'}
                  </span>
                  {selectedMessage.sender?.email && (
                    <span className="text-sm text-gray-500">
                      ({selectedMessage.sender.email})
                    </span>
                  )}
                </div>
                
                {selectedMessage.booking && (
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>Επισκέπτης: {selectedMessage.booking.guestName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Check-in: {new Date(selectedMessage.booking.checkIn).toLocaleDateString('el-GR')}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Booking ID: {selectedMessage.bookingId}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>
              
              {!selectedMessage.isRead && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id)
                      setSelectedMessage(null)
                    }}
                    className="btn btn-primary"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Σήμανση ως αναγνωσμένο
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

