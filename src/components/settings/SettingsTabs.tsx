'use client'

import { useState } from 'react'
import { User, Bell, Shield, Globe, Palette, Plug, Key, CreditCard, Cog, ShieldCheck, Database, Mail, Webhook } from 'lucide-react'
import { GeneralSettings } from './GeneralSettings'
import { NotificationSettings } from './NotificationSettings'
import { SecuritySettings } from './SecuritySettings'
import { AppearanceSettings } from './AppearanceSettings'
import { IntegrationsSettings } from './IntegrationsSettings'
import { ApiKeysSettings } from './ApiKeysSettings'
import { BillingSettings } from './BillingSettings'
import { AdvancedSettings } from './AdvancedSettings'
import { PermissionsSettings } from './PermissionsSettings'
import { DataManagementSettings } from './DataManagementSettings'
import { EmailTemplatesSettings } from './EmailTemplatesSettings'
import { WebhooksSettings } from './WebhooksSettings'

const tabs = [
  { id: 'general', label: 'Γενικά', icon: User },
  { id: 'notifications', label: 'Ειδοποιήσεις', icon: Bell },
  { id: 'security', label: 'Ασφάλεια', icon: Shield },
  { id: 'appearance', label: 'Εμφάνιση', icon: Palette },
  { id: 'integrations', label: 'Ενσωματώσεις', icon: Plug },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'billing', label: 'Χρέωση', icon: CreditCard },
  { id: 'advanced', label: 'Προχωρημένα', icon: Cog },
  { id: 'permissions', label: 'Δικαιώματα', icon: ShieldCheck },
  { id: 'data', label: 'Δεδομένα', icon: Database },
  { id: 'email-templates', label: 'Email Templates', icon: Mail },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
]

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('general')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'security':
        return <SecuritySettings />
      case 'appearance':
        return <AppearanceSettings />
      case 'integrations':
        return <IntegrationsSettings />
      case 'api-keys':
        return <ApiKeysSettings />
      case 'billing':
        return <BillingSettings />
      case 'advanced':
        return <AdvancedSettings />
      case 'permissions':
        return <PermissionsSettings />
      case 'data':
        return <DataManagementSettings />
      case 'email-templates':
        return <EmailTemplatesSettings />
      case 'webhooks':
        return <WebhooksSettings />
      default:
        return <GeneralSettings />
    }
  }

  return (
    <div className="card">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  )
}

