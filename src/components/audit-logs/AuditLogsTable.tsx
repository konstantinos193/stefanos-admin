'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Calendar, User, Activity } from 'lucide-react';
import { auditApi, AuditLog, AuditLogsQuery, AuditStats } from '@/lib/api/audit';

interface AuditLogsTableProps {
  className?: string;
}

export function AuditLogsTable({ className }: AuditLogsTableProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<AuditLogsQuery>({
    page: 1,
    limit: 50,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Load audit logs and stats
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [logsResponse, statsResponse] = await Promise.all([
        auditApi.getAuditLogs(query),
        auditApi.getAuditStats(),
      ]);
      
      setLogs(logsResponse.data);
      setPagination(logsResponse.pagination);
      setStats(statsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [query]);

  const handleSearch = (search: string) => {
    setQuery(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilter = (filters: Partial<AuditLogsQuery>) => {
    setQuery(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handleExport = async () => {
    try {
      const response = await auditApi.exportAuditLogs(query);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export audit logs');
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-green-600 bg-green-100';
      case 'UPDATE': return 'text-blue-600 bg-blue-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'READ': return 'text-gray-600 bg-gray-100';
      default: return 'text-purple-600 bg-purple-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-600 bg-red-100';
      case 'MANAGER': return 'text-orange-600 bg-orange-100';
      case 'PROPERTY_OWNER': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Σύνολο Καταγραφών</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLogs.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Σήμερα</p>
                <p className="text-2xl font-bold text-gray-900">{stats.logsToday.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Αυτή την Εβδομάδα</p>
                <p className="text-2xl font-bold text-gray-900">{stats.logsThisWeek.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ενεργοί Χρήστες</p>
                <p className="text-2xl font-bold text-gray-900">{stats.topUsers.length}</p>
              </div>
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Αναζήτηση καταγραφών..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleFilter({ action: e.target.value })}
              value={query.action || ''}
            >
              <option value="">Όλες οι Ενέργειες</option>
              <option value="CREATE">Δημιουργία</option>
              <option value="UPDATE">Ενημέρωση</option>
              <option value="DELETE">Διαγραφή</option>
              <option value="READ">Προβολή</option>
            </select>

            <select
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleFilter({ entityType: e.target.value })}
              value={query.entityType || ''}
            >
              <option value="">Όλοι οι Τύποι</option>
              <option value="USER">Χρήστης</option>
              <option value="PROPERTY">Ακίνητο</option>
              <option value="BOOKING">Κράτηση</option>
              <option value="PAYMENT">Πληρωμή</option>
              <option value="ROOM">Δωμάτιο</option>
            </select>

            <button
              onClick={handleExport}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Εξαγωγή</span>
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex gap-2">
          <input
            type="date"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilter({ startDate: e.target.value })}
            value={query.startDate || ''}
          />
          <input
            type="date"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilter({ endDate: e.target.value })}
            value={query.endDate || ''}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ημερομηνία
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Χρήστης
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ενέργεια
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Τύπος
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Λεπτομέρειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.createdAt).toLocaleString('el-GR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {log.user.name || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500">{log.user.email}</span>
                      <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 w-fit ${getRoleColor(log.user.role)}`}>
                        {log.user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.entityType}
                    {log.entityId && (
                      <span className="text-xs text-gray-500 block">ID: {log.entityId}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <button
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => {
                        // Show details modal or expand row
                        console.log('Show details for log:', log);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Λεπτομέρειες</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Εμφάνιση <span className="font-medium">{logs.length}</span> από{' '}
            <span className="font-medium">{pagination.total}</span> αποτελέσματα
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={!pagination.hasPrevPage}
              onClick={() => setQuery(prev => ({ ...prev, page: prev.page! - 1 }))}
            >
              Προηγούμενη
            </button>
            <span className="px-3 py-1">
              Σελίδα {pagination.page} από {pagination.totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={!pagination.hasNextPage}
              onClick={() => setQuery(prev => ({ ...prev, page: prev.page! + 1 }))}
            >
              Επόμενη
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
