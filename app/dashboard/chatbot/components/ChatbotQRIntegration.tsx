import { Download } from "lucide-react"
import React from "react"

interface ChatbotQRIntegrationProps {
  chatbotConfig: { name: string }
}

const ChatbotQRIntegration: React.FC<ChatbotQRIntegrationProps> = ({ chatbotConfig }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">QR Code Integration</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium text-gray-900">QR Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Landing Page URL</label>
                <input
                  type="url"
                  value="https://yourbeauty.com/support/chat"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
                  readOnly
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">QR Code Size</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500">
                  <option>Small (200x200)</option>
                  <option>Medium (400x400)</option>
                  <option>Large (600x600)</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Include Logo</label>
                <div className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-gray-700">Add brand logo to QR code center</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium text-gray-900">Integration Instructions</h3>
            <div className="prose text-sm text-gray-600">
              <ol className="list-inside list-decimal space-y-2">
                <li>Download the generated QR code</li>
                <li>Print on product packaging, receipts, or marketing materials</li>
                <li>Customers scan to access instant support</li>
                <li>Monitor engagement through analytics</li>
              </ol>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600">
                <Download size={18} />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-medium text-gray-900">QR Code Preview</h3>
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-gray-200 bg-white">
              <div
                className="h-40 w-40 bg-black"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='qr' width='10' height='10' patternUnits='userSpaceOnUse'%3e%3crect width='5' height='5' fill='black'/%3e%3crect x='5' y='5' width='5' height='5' fill='black'/%3e%3c/pattern%3e%3c/defs%3e%3crerect width='100' height='100' fill='url(%23qr)'/%3e%3c/svg%3e")`,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">Scan to access {chatbotConfig.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatbotQRIntegration
