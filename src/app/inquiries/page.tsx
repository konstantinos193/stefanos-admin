'use client';

import { useState, useEffect } from 'react';
import { inquiriesApi, Inquiry } from '@/lib/api/inquiries';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    assignedTo: '',
  });

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiriesApi.getAll(filter);
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    try {
      const updated = await inquiriesApi.update(id, updates);
      setInquiries(prev => prev.map(i => i.id === id ? updated : i));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(updated);
      }
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESPONDED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'SPAM': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Inquiries</h1>
        <p className="text-gray-600">Manage and respond to property inquiries from potential guests</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESPONDED">Responded</option>
              <option value="CLOSED">Closed</option>
              <option value="SPAM">Spam</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
            <select
              value={filter.assignedTo}
              onChange={(e) => setFilter(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unassigned</option>
              {/* Add assigned users here */}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Inquiries ({inquiries.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading...</div>
              ) : inquiries.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No inquiries found</div>
              ) : (
                inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedInquiry?.id === inquiry.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(inquiry.priority)}`}>
                            {inquiry.priority}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                        {inquiry.phone && (
                          <p className="text-sm text-gray-600">{inquiry.phone}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                        <p>{new Date(inquiry.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Property: {inquiry.property.titleEn}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Inquiry Details */}
        <div className="lg:col-span-1">
          {selectedInquiry ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Inquiry Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => updateInquiry(selectedInquiry.id, { status: e.target.value as any })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NEW">New</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESPONDED">Responded</option>
                      <option value="CLOSED">Closed</option>
                      <option value="SPAM">Spam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={selectedInquiry.priority}
                      onChange={(e) => updateInquiry(selectedInquiry.id, { priority: e.target.value as any })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Response</label>
                    <textarea
                      value={selectedInquiry.response || ''}
                      onChange={(e) => updateInquiry(selectedInquiry.id, { response: e.target.value })}
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your response..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                    <textarea
                      value={selectedInquiry.adminNotes || ''}
                      onChange={(e) => updateInquiry(selectedInquiry.id, { adminNotes: e.target.value })}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Internal notes..."
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedInquiry.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedInquiry.email}</p>
                      {selectedInquiry.phone && (
                        <p><span className="font-medium">Phone:</span> {selectedInquiry.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Property</h3>
                    <p className="text-sm text-gray-600">{selectedInquiry.property.titleEn}</p>
                    <p className="text-xs text-gray-500">Owner: {selectedInquiry.property.owner.name}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select an inquiry to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
