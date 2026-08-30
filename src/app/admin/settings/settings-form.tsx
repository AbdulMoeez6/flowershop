"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateSettings } from "@/app/actions/settings"
import { SiteSettings } from "@/lib/data"
import { Save } from "lucide-react"

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const result = await updateSettings(settings as any) // Typecast for string index

    if (result.success) {
      setMessage({ text: "Settings saved successfully!", type: "success" })
    } else {
      setMessage({ text: result.error || "Failed to save settings.", type: "error" })
    }
    
    setIsSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-foreground">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your global settings, contact numbers, and social links.
        </p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Store Preferences</h2>
            
            <div className="space-y-2 pb-4">
              <label htmlFor="hide_prices" className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                <input
                  id="hide_prices"
                  type="checkbox"
                  className="w-4 h-4 text-primary rounded border-input"
                  checked={settings.hide_prices}
                  onChange={(e) => setSettings({ ...settings, hide_prices: e.target.checked })}
                />
                <span>Hide Product Prices & Disable Cart</span>
              </label>
              <p className="text-xs text-muted-foreground pl-6">
                If checked, all product prices and checkout functionality will be hidden from the website. Customers can still order via WhatsApp.
              </p>
            </div>

            <div className="space-y-2 pb-4">
              <label htmlFor="hide_phone_number" className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                <input
                  id="hide_phone_number"
                  type="checkbox"
                  className="w-4 h-4 text-primary rounded border-input"
                  checked={settings.hide_phone_number}
                  onChange={(e) => setSettings({ ...settings, hide_phone_number: e.target.checked })}
                />
                <span>Hide Phone Number</span>
              </label>
              <p className="text-xs text-muted-foreground pl-6">
                If checked, the phone number and WhatsApp button will be hidden from the website.
              </p>
            </div>

            <h2 className="text-lg font-medium pt-4 border-t">Contact & Social</h2>
            
            <div className="space-y-2">
              <label htmlFor="whatsapp_number" className="text-sm font-medium">
                WhatsApp Number
              </label>
              <input
                id="whatsapp_number"
                type="text"
                required
                className="input-premium"
                placeholder="e.g., 923055244465"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Include country code without the plus sign (e.g., 923001234567).
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="facebook_url" className="text-sm font-medium">
                Facebook URL
              </label>
              <input
                id="facebook_url"
                type="url"
                className="input-premium"
                placeholder="https://facebook.com/..."
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="instagram_url" className="text-sm font-medium">
                Instagram URL
              </label>
              <input
                id="instagram_url"
                type="url"
                className="input-premium"
                placeholder="https://instagram.com/..."
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            {message ? (
              <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-rose"}`}>
                {message.text}
              </p>
            ) : (
              <div />
            )}
            
            <Button type="submit" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
