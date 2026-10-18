import { getOrCreateDefaultFamily } from "@/lib/data"
import { SettingsView } from "@/components/settings/settings-view"

export default async function SettingsPage() {
  const family = await getOrCreateDefaultFamily()
  const user = family.users[0] || {
    name: "Alex Morgan",
    email: "user@example.com",
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Settings & Preferences
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage your account, household settings, and local database environment.
        </p>
      </div>

      <SettingsView
        familyName={family.name}
        currency={family.currency}
        userName={user.name}
        userEmail={user.email}
      />
    </div>
  )
}
