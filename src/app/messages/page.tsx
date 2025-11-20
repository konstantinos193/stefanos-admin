'use client'

import { useState, useRef } from 'react'
import { MessagesHeader } from '@/components/messages/MessagesHeader'
import { MessagesTable, MessagesTableRef } from '@/components/messages/MessagesTable'
import { MessagesFilters } from '@/components/messages/MessagesFilters'
import { SendMessageModal } from '@/components/messages/SendMessageModal'

export default function MessagesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [readFilter, setReadFilter] = useState('all')
  const [bookingFilter, setBookingFilter] = useState('')
  const messagesTableRef = useRef<MessagesTableRef>(null)

  const handleNewMessage = () => {
    setIsModalOpen(true)
  }

  const handleMessageSent = async () => {
    setIsModalOpen(false)
    // Small delay to ensure backend has processed the message
    await new Promise(resolve => setTimeout(resolve, 300))
    // Refresh the messages table
    if (messagesTableRef.current) {
      messagesTableRef.current.refresh()
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setReadFilter('all')
    setBookingFilter('')
  }

  return (
    <div className="space-y-6">
      <MessagesHeader onNewMessage={handleNewMessage} />
      <MessagesFilters
        searchQuery={searchQuery}
        readFilter={readFilter}
        bookingFilter={bookingFilter}
        onSearchChange={setSearchQuery}
        onReadChange={setReadFilter}
        onBookingChange={setBookingFilter}
        onClearFilters={handleClearFilters}
      />
      <MessagesTable
        ref={messagesTableRef}
        searchQuery={searchQuery}
        readFilter={readFilter}
        bookingFilter={bookingFilter}
      />
      <SendMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleMessageSent}
      />
    </div>
  )
}
