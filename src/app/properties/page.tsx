import { PropertiesHeader } from '@/components/properties/PropertiesHeader'
import { PropertiesGrid } from '@/components/properties/PropertiesGrid'
import { PropertiesFilters } from '@/components/properties/PropertiesFilters'

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <PropertiesHeader />
      <PropertiesFilters />
      <PropertiesGrid />
    </div>
  )
}

