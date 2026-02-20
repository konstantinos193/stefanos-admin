// User Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'USER' | 'ADMIN' | 'PROPERTY_OWNER' | 'MANAGER';
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    properties?: number;
    bookings?: number;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationMeta;
  };
}

// Property Types
export interface Property {
  id: string;
  titleGr: string;
  titleEn: string;
  descriptionGr: string | null;
  descriptionEn: string | null;
  type: 'APARTMENT' | 'HOUSE' | 'ROOM' | 'COMMERCIAL' | 'STORAGE' | 'VACATION_RENTAL' | 'LUXURY' | 'INVESTMENT';
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'SUSPENDED';
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  basePrice: number;
  currency: string;
  cleaningFee: number | null;
  serviceFee: number | null;
  serviceFeePercentage?: number | null;
  taxes: number | null;
  taxRate?: number | null;
  images: string[];
  videos: string[];
  ownerId: string;
  owner?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  averageRating?: number;
  reviewCount?: number;
  cancellationPolicy?: 'FLEXIBLE' | 'MODERATE' | 'STRICT' | 'SUPER_STRICT';
  createdAt: string;
  updatedAt: string;
}

export interface PropertiesResponse {
  success: boolean;
  data: {
    properties: Property[];
    pagination: PaginationMeta;
  };
}

// Booking Types
export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  basePrice: number;
  cleaningFee: number | null;
  serviceFee: number | null;
  taxes: number | null;
  currency: string;
  ownerRevenue: number | null; // Revenue after platform fees
  platformFee: number | null; // Platform fee amount
  source?: string;
  roomId: string | null;
  roomName: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  specialRequests: string | null;
  property?: {
    id: string;
    titleGr: string;
    titleEn: string;
    images: string[];
    address: string;
    city: string;
  };
  guest?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  success: boolean;
  data: {
    bookings: Booking[];
    pagination: PaginationMeta;
  };
}

// Stats Types
export interface PlatformStats {
  properties: number;
  happyGuests: number;
  cities: number;
}

export interface StatsResponse {
  success: boolean;
  data: PlatformStats;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  usersChange: number;
  propertiesChange: number;
  bookingsChange: number;
  revenueChange: number;
}

// Admin Dashboard Stats (from GET /admin/dashboard)
export interface AdminDashboardOverview {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
}

export interface AdminRecentBooking {
  id: string;
  status: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guestName: string;
  createdAt: string;
  property?: {
    titleEn: string;
    titleGr: string;
  };
  guest?: {
    name: string;
    email: string;
  };
}

export interface AdminRecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminDashboardResponse {
  overview: AdminDashboardOverview;
  recentBookings: AdminRecentBooking[];
  recentUsers: AdminRecentUser[];
}

