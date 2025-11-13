import { PaymentsHeader } from '@/components/payments/PaymentsHeader'
import { PaymentsTable } from '@/components/payments/PaymentsTable'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PaymentsHeader />
      <PaymentsTable />
    </div>
  )
}

