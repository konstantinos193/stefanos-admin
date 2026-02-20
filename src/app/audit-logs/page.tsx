import { AuditLogsTable } from '@/components/audit-logs/AuditLogsTable';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Αρχείο Ελέγχου</h1>
          <p className="text-gray-600 mt-1">Ιστορικό ενεργειών και αλλαγών</p>
        </div>
      </div>
      
      <AuditLogsTable />
    </div>
  )
}

