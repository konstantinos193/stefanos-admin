'use client'

import { CheckCircle, Circle } from 'lucide-react'
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { messagesApi, Message } from '@/lib/api/messages'
import { matchesSearch } from '@/lib/utils/textNormalization'

export interface MessagesTableRef {
  refresh: () => void
}

interface MessagesTableProps {
  searchQuery?: string
  readFilter?: string
  bookingFilter?: string
}

export const MessagesTable = forwardRef<MessagesTableRef, MessagesTableProps>(({ searchQuery = '', readFilter = 'all', bookingFilter = '' }, ref) => {
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchMessages = async (pageToFetch: number = page) => {
    try {
      setLoading(true)
      const params: any = { page: pageToFetch, limit: 10 }
      if (bookingFilter) params.bookingId = bookingFilter
      if (readFilter === 'read') params.isRead = true
      if (readFilter === 'unread') params.isRead = false

      const response = await messagesApi.getAll(params)
      const fetchedMessages = response.data?.messages || []
      setAllMessages(fetchedMessages)
      setMessages(fetchedMessages)
      setTotalPages(response.data?.pagination?.totalPages || 1)
      setTotal(response.data?.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching messages:', error)
      setAllMessages([])
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch all messages when filters are active
  const fetchAllMessages = async () => {
    try {
      setLoading(true)
      const allMessagesList: Message[] = []
      let currentPage = 1
      let hasMore = true

      while (hasMore) {
        const params: any = { page: currentPage, limit: 100 }
        if (bookingFilter) params.bookingId = bookingFilter
        if (readFilter === 'read') params.isRead = true
        if (readFilter === 'unread') params.isRead = false

        const response = await messagesApi.getAll(params)
        const pageMessages = response.data?.messages || []
        allMessagesList.push(...pageMessages)

        hasMore = pageMessages.length === 100 && currentPage < (response.data?.pagination?.totalPages || 1)
        currentPage++
      }

      setAllMessages(allMessagesList)
      return allMessagesList
    } catch (error) {
      console.error('Error fetching all messages:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Apply filters to messages
  const applyFilters = (messagesToFilter: Message[]) => {
    let filtered = [...messagesToFilter]

    // Search filter (accent-insensitive and case-insensitive)
    if (searchQuery.trim()) {
      filtered = filtered.filter((message) => {
        return (
          matchesSearch(message.content || '', searchQuery) ||
          matchesSearch(message.sender?.name || '', searchQuery) ||
          matchesSearch(message.sender?.email || '', searchQuery) ||
          matchesSearch(message.booking?.guestName || '', searchQuery) ||
          matchesSearch(message.id, searchQuery)
        )
      })
    }

    return filtered
  }

  // Store filtered messages for pagination
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Check if filters are active
  const hasFilters = searchQuery.trim() || bookingFilter !== ''

  // Initial load
  useEffect(() => {
    if (!hasFilters) {
      fetchMessages(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply filters when they change
  useEffect(() => {
    if (hasFilters) {
      setIsFiltering(true)
      fetchAllMessages().then((allMessagesList) => {
        const filtered = applyFilters(allMessagesList)
        setFilteredMessages(filtered)
        setTotal(filtered.length)
        setTotalPages(Math.ceil(filtered.length / 10))
        setPage(1)
        setIsFiltering(false)
      }).catch(() => {
        setIsFiltering(false)
      })
    } else {
      setIsFiltering(false)
      setFilteredMessages([])
      setPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, bookingFilter])

  // Handle read filter and booking filter changes
  useEffect(() => {
    if (!hasFilters) {
      fetchMessages(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readFilter, bookingFilter])

  // Handle data display - either filtered or paginated
  useEffect(() => {
    if (hasFilters) {
      if (filteredMessages.length > 0 && !isFiltering) {
        const startIndex = (page - 1) * 10
        const endIndex = startIndex + 10
        const paginatedMessages = filteredMessages.slice(startIndex, endIndex)
        setMessages(paginatedMessages)
      } else if (filteredMessages.length === 0 && !isFiltering) {
        setMessages([])
      }
    } else {
      if (!isFiltering) {
        fetchMessages(page)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filteredMessages, hasFilters, isFiltering, readFilter, bookingFilter])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      setPage(1)
      fetchMessages(1)
    }
  }))

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messagesApi.markAsRead(messageId)
      // Refresh the table
      if (hasFilters) {
        fetchAllMessages().then((allMessagesList) => {
          const filtered = applyFilters(allMessagesList)
          setFilteredMessages(filtered)
          setTotal(filtered.length)
          setTotalPages(Math.ceil(filtered.length / 10))
          const startIndex = (page - 1) * 10
          const endIndex = startIndex + 10
          setMessages(filtered.slice(startIndex, endIndex))
        })
      } else {
        fetchMessages(page)
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return '🖼️'
      case 'FILE':
        return '📎'
      case 'SYSTEM':
        return '⚙️'
      default:
        return '💬'
    }
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-600">Φόρτωση μηνυμάτων...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΑΠΟΣΤΟΛΕΑΣ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΚΡΑΤΗΣΗ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΠΕΡΙΕΧΟΜΕΝΟ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΤΥΠΟΣ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΗΜΕΡΟΜΗΝΙΑ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΚΑΤΑΣΤΑΣΗ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Δεν βρέθηκαν μηνύματα
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className={`hover:bg-gray-50 transition-colors ${!message.isRead ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {message.sender?.name ? message.sender.name.charAt(0).toUpperCase() : message.sender?.email?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{message.sender?.name || message.sender?.email || 'Άγνωστος'}</div>
                        <div className="text-sm text-gray-500">{message.sender?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {message.booking?.guestName || `Κράτηση ${message.bookingId.slice(-6)}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {message.booking?.checkIn && message.booking?.checkOut
                        ? `${new Date(message.booking.checkIn).toLocaleDateString('el-GR')} - ${new Date(message.booking.checkOut).toLocaleDateString('el-GR')}`
                        : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">
                      {message.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg">{getTypeIcon(message.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="flex items-center space-x-2 text-sm"
                      title={message.isRead ? 'Σημειωμένο ως διαβασμένο' : 'Σημείωσε ως διαβασμένο'}
                    >
                      {message.isRead ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-blue-500" />
                      )}
                      <span className={message.isRead ? 'text-green-700' : 'text-blue-700'}>
                        {message.isRead ? 'Διαβασμένο' : 'Μη διαβασμένο'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Εμφάνιση <span className="font-medium">{(page - 1) * 10 + 1}</span> έως{' '}
          <span className="font-medium">{Math.min(page * 10, total)}</span> από{' '}
          <span className="font-medium">{total}</span> αποτελέσματα
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Προηγούμενο
          </button>
          <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">
            {page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Επόμενο
          </button>
        </div>
      </div>
    </div>
  )
})

MessagesTable.displayName = 'MessagesTable'

