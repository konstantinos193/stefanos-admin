const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreateInquiryData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface Inquiry {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESPONDED' | 'CLOSED' | 'SPAM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  respondedAt?: string;
  respondedBy?: string;
  response?: string;
  adminNotes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    titleGr: string;
    titleEn: string;
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
}

export const inquiriesApi = {
  async create(data: CreateInquiryData): Promise<Inquiry> {
    const response = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit inquiry');
    }

    return response.json();
  },

  async getAll(params?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
  }): Promise<Inquiry[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.assignedTo) searchParams.append('assignedTo', params.assignedTo);

    const response = await fetch(`${API_BASE}/inquiries?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inquiries');
    }

    return response.json();
  },

  async getById(id: string): Promise<Inquiry> {
    const response = await fetch(`${API_BASE}/inquiries/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inquiry');
    }

    return response.json();
  },

  async update(id: string, data: Partial<Inquiry>): Promise<Inquiry> {
    const response = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update inquiry');
    }

    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE}/inquiries/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inquiry stats');
    }

    return response.json();
  },
};
