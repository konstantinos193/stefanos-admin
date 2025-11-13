import { SettingsHeader } from '@/components/settings/SettingsHeader'
import { SettingsTabs } from '@/components/settings/SettingsTabs'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader />
      <SettingsTabs />
    </div>
  )
}

