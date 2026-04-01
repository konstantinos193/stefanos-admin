// Enhanced Calendar Types and Utilities

export interface BookingSlot {
  id: string
  roomId: string | null
  roomName: string | null
  guestName: string
  guestEmail?: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  totalPrice: number
  currency: string
  source?: string
  guests: number
  property?: {
    id: string
    titleGr: string
  }
  aiPriority?: Priority
  aiInsight?: string
  predictedRevenue?: number
  riskScore?: number
  satisfactionPrediction?: number
}

export interface RoomRow {
  id: string
  name: string
  status: RoomStatus
  occupancy?: number
  revenue?: number
  aiOptimization?: string
  maintenanceSchedule?: MaintenanceSlot[]
  performance?: RoomPerformance
}

export interface AIInsight {
  type: InsightType
  title: string
  description: string
  urgency: Priority
  actionable: boolean
  impact?: number
  confidence?: number
  recommendations?: string[]
}

export interface RealTimeUpdate {
  type: UpdateType
  timestamp: string
  data: any
  userId?: string
}

export interface MaintenanceSlot {
  id: string
  roomId: string
  startDate: string
  endDate: string
  type: 'cleaning' | 'repair' | 'inspection'
  priority: Priority
  assignedTo?: string
  status: 'scheduled' | 'in_progress' | 'completed'
}

export interface RoomPerformance {
  occupancyRate: number
  revenuePerNight: number
  guestSatisfaction: number
  turnoverTime: number
  maintenanceScore: number
}

export interface CalendarAnalytics {
  totalRevenue: number
  occupancyRate: number
  averageDailyRate: number
  revenuePerAvailableRoom: number
  bookingConversionRate: number
  cancellationRate: number
  guestSatisfactionScore: number
  predictiveAccuracy: number
}

// Type definitions
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
export type RoomStatus = 'available' | 'maintenance' | 'occupied' | 'cleaning'
export type Priority = 'high' | 'medium' | 'low'
export type InsightType = 'revenue' | 'occupancy' | 'pricing' | 'maintenance' | 'guest_experience' | 'operational'
export type UpdateType = 'booking_created' | 'booking_cancelled' | 'booking_modified' | 'room_status_change' | 'price_change'
export type CalendarView = 'month' | 'week' | 'day' | 'timeline'
export type DragState = 'idle' | 'dragging' | 'dropping'

// Color schemes and styling
export const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string; border: string; icon: string }> = {
  PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '⏳' },
  CONFIRMED: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', icon: '✅' },
  CHECKED_IN: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '🏠' },
  COMPLETED: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', icon: '✓' },
  CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '❌' },
  NO_SHOW: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: '🚫' },
}

export const PRIORITY_COLORS: Record<Priority, { bg: string; border: string; text: string }> = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  low: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
}

export const INSIGHT_ICONS: Record<InsightType, string> = {
  revenue: '📈',
  occupancy: '🏢',
  pricing: '💰',
  maintenance: '🔧',
  guest_experience: '😊',
  operational: '⚙️'
}

// Utility functions
export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('el-GR', { 
    style: 'currency', 
    currency: currency, 
    minimumFractionDigits: 0 
  }).format(amount)
}

export function formatDate(date: string | Date, locale = 'el-GR'): string {
  return new Date(date).toLocaleDateString(locale)
}

export function formatTime(date: string | Date, locale = 'el-GR'): string {
  return new Date(date).toLocaleTimeString(locale, { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export function calculateNights(checkIn: string, checkOut: string): number {
  return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
}

export function getBookingDuration(booking: BookingSlot): number {
  return calculateNights(booking.checkIn, booking.checkOut)
}

export function getBookingValue(booking: BookingSlot): number {
  return booking.predictedRevenue || booking.totalPrice
}

export function isOverlapping(booking1: BookingSlot, booking2: BookingSlot): boolean {
  const start1 = new Date(booking1.checkIn)
  const end1 = new Date(booking1.checkOut)
  const start2 = new Date(booking2.checkIn)
  const end2 = new Date(booking2.checkOut)
  
  return start1 < end2 && start2 < end1
}

export function hasBookingConflict(booking: BookingSlot, existingBookings: BookingSlot[]): boolean {
  return existingBookings.some(existing => 
    existing.id !== booking.id &&
    existing.roomId === booking.roomId &&
    isOverlapping(booking, existing) &&
    !['CANCELLED', 'NO_SHOW'].includes(existing.status)
  )
}

export function generateBookingTooltip(booking: BookingSlot): string {
  const nights = getBookingDuration(booking)
  const value = getBookingValue(booking)
  
  return `${booking.guestName} — ${booking.status}
${formatDate(booking.checkIn)} → ${formatDate(booking.checkOut)} (${nights} nights)
${booking.guests} guests • ${formatCurrency(value)}
${booking.source ? `Via ${booking.source}` : ''}
${booking.aiInsight ? `💡 ${booking.aiInsight}` : ''}
${booking.riskScore ? `⚠️ Risk Score: ${booking.riskScore}%` : ''}`
}

export function generateAIInsight(booking: BookingSlot): string {
  const insights: string[] = []
  
  if (booking.totalPrice > 1000) {
    insights.push("High-value booking - Priority service recommended")
  }
  if (booking.guests > 4) {
    insights.push("Group booking - Consider upselling services")
  }
  if (booking.status === 'PENDING') {
    insights.push("Follow-up needed for confirmation")
  }
  if (booking.riskScore && booking.riskScore > 70) {
    insights.push("High cancellation risk - Proactive outreach advised")
  }
  if (booking.satisfactionPrediction && booking.satisfactionPrediction < 70) {
    insights.push("Potential satisfaction issues - Extra attention needed")
  }
  
  return insights[0] || ""
}

export function calculateRoomPerformance(room: RoomRow, bookings: BookingSlot[]): RoomPerformance {
  const roomBookings = bookings.filter(b => b.roomId === room.id)
  const totalNights = roomBookings.reduce((sum, b) => sum + getBookingDuration(b), 0)
  const totalRevenue = roomBookings.reduce((sum, b) => sum + getBookingValue(b), 0)
  
  // This would normally be calculated based on actual time periods
  const availableNights = 30 // Example: 30 days in month
  const occupancyRate = (totalNights / availableNights) * 100
  const averageDailyRate = totalNights > 0 ? totalRevenue / totalNights : 0
  
  return {
    occupancyRate: Math.round(occupancyRate),
    revenuePerNight: Math.round(averageDailyRate),
    guestSatisfaction: 85, // Would come from guest feedback data
    turnoverTime: 2.5, // Hours between check-out and next check-in
    maintenanceScore: 90 // Would come from maintenance records
  }
}

export function calculateCalendarAnalytics(bookings: BookingSlot[], rooms: RoomRow[]): CalendarAnalytics {
  const totalRevenue = bookings.reduce((sum, b) => sum + getBookingValue(b), 0)
  const totalNights = bookings.reduce((sum, b) => sum + getBookingDuration(b), 0)
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED')
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED')
  
  // This would normally be calculated based on actual time periods and room counts
  const availableNights = rooms.length * 30 // Example: 30 days
  const occupancyRate = availableNights > 0 ? (totalNights / availableNights) * 100 : 0
  const averageDailyRate = totalNights > 0 ? totalRevenue / totalNights : 0
  const revenuePerAvailableRoom = availableNights > 0 ? totalRevenue / availableNights : 0
  
  return {
    totalRevenue: Math.round(totalRevenue),
    occupancyRate: Math.round(occupancyRate),
    averageDailyRate: Math.round(averageDailyRate),
    revenuePerAvailableRoom: Math.round(revenuePerAvailableRoom),
    bookingConversionRate: 85, // Would come from booking funnel data
    cancellationRate: bookings.length > 0 ? (cancelledBookings.length / bookings.length) * 100 : 0,
    guestSatisfactionScore: 87, // Would come from guest feedback
    predictiveAccuracy: 92 // AI model accuracy
  }
}

export function validateBookingDates(checkIn: string, checkOut: string): { valid: boolean; error?: string } {
  const now = new Date()
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  
  if (checkInDate >= checkOutDate) {
    return { valid: false, error: "Check-out date must be after check-in date" }
  }
  
  if (checkInDate < now) {
    return { valid: false, error: "Check-in date cannot be in the past" }
  }
  
  const nights = calculateNights(checkIn, checkOut)
  if (nights > 30) {
    return { valid: false, error: "Maximum stay is 30 nights" }
  }
  
  return { valid: true }
}

export function optimizeRoomAssignment(
  booking: BookingSlot, 
  availableRooms: RoomRow[], 
  existingBookings: BookingSlot[]
): RoomRow | null {
  const suitableRooms = availableRooms.filter(room => {
    if (room.status !== 'available') return false
    
    // Check for conflicts
    const hasConflict = existingBookings.some(existing => 
      existing.roomId === room.id &&
      isOverlapping(booking, existing) &&
      !['CANCELLED', 'NO_SHOW'].includes(existing.status)
    )
    
    return !hasConflict
  })
  
  // Sort by AI optimization score if available, otherwise by performance
  return suitableRooms.sort((a, b) => {
    const scoreA = a.performance?.occupancyRate || 0
    const scoreB = b.performance?.occupancyRate || 0
    return scoreB - scoreA
  })[0] || null
}

export function generateRevenueForecast(bookings: BookingSlot[], days: number): number {
  // Simple linear regression for demo - in production would use ML models
  const dailyRevenues = bookings.map(booking => {
    const nights = getBookingDuration(booking)
    return getBookingValue(booking) / nights
  })
  
  const averageDailyRevenue = dailyRevenues.reduce((sum, revenue) => sum + revenue, 0) / dailyRevenues.length
  const growthFactor = 1.05 // 5% growth assumption
  
  return Math.round(averageDailyRevenue * days * growthFactor)
}

export function detectAnomalies(bookings: BookingSlot[]): string[] {
  const anomalies: string[] = []
  
  // Detect unusual cancellation patterns
  const recentCancellations = bookings.filter(b => 
    b.status === 'CANCELLED' && 
    new Date(b.checkIn).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  )
  
  if (recentCancellations.length > 3) {
    anomalies.push("High cancellation rate detected in the last 7 days")
  }
  
  // Detect pricing anomalies
  const prices = bookings.map(b => b.totalPrice / calculateNights(b.checkIn, b.checkOut))
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const outlierThreshold = averagePrice * 2
  
  if (prices.some(price => price > outlierThreshold)) {
    anomalies.push("Unusual pricing patterns detected - review rate strategy")
  }
  
  return anomalies
}

// Mobile-specific utilities
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function getMobileOptimalColumns(): number {
  if (typeof window === 'undefined') return 7
  const width = window.innerWidth
  if (width < 640) return 3
  if (width < 768) return 5
  return 7
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
