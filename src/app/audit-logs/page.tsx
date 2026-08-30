import { AuditLogsTable } from '@/components/audit-logs/AuditLogsTable';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Αρχείο Ελέγχου</h1>
          <p className="text-slate-400 mt-1 text-sm">Ιστορικό ενεργειών και αλλαγών</p>
        </div>
      </div>
      
      <AuditLogsTable />
    </div>
  )
}

