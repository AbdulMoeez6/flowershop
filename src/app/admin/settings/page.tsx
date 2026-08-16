import { getSettings } from "@/lib/data"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const initialSettings = await getSettings()

  return <SettingsForm initialSettings={initialSettings} />
}
