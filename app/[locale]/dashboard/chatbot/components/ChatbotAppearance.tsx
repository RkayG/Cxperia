import { Bot } from "lucide-react"
import React from "react"

interface ChatbotAppearanceProps {
  chatbotConfig: {
    name: string
    brand_color: string
    greeting: string
  }
  setChatbotConfig: (config: any) => void
}

const ChatbotAppearance: React.FC<ChatbotAppearanceProps> = ({ chatbotConfig, setChatbotConfig }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Chatbot Appearance</h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-medium text-gray-900">Color Theme</h3>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={chatbotConfig.brand_color}
                    onChange={(e) => setChatbotConfig({ ...chatbotConfig, brand_color: e.target.value })}
                    className="h-10 w-12 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={chatbotConfig.brand_color}
                    onChange={(e) => setChatbotConfig({ ...chatbotConfig, brand_color: e.target.value })}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Quick Colors</label>
                <div className="flex gap-2">
                  {["#F97316", "#EF4444", "#8B5CF6", "#06B6D4", "#10B981"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setChatbotConfig({ ...chatbotConfig, brand_color: color })}
                      className="h-8 w-8 rounded-lg border-2 border-gray-200 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium text-gray-900">Chat Preview</h3>
            <div className="flex h-80 flex-col rounded-lg bg-gray-50 p-4">
              <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: chatbotConfig.brand_color }}
                >
                  <Bot size={16} />
                </div>
                <span className="font-medium text-gray-900">{chatbotConfig.name}</span>
                <div className="ml-auto h-2 w-2 rounded-full bg-green-400"></div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                <div className="flex gap-2">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
                    style={{ backgroundColor: chatbotConfig.brand_color }}
                  >
                    <Bot size={12} />
                  </div>
                  <div className="max-w-xs rounded-lg bg-white px-3 py-2 shadow-sm">
                    <p className="text-sm text-gray-800">{chatbotConfig.greeting}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <div className="max-w-xs rounded-lg bg-blue-500 px-3 py-2 text-white">
                    <p className="text-sm">What's your return policy?</p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    U
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  disabled
                />
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: chatbotConfig.brand_color }}
                  disabled
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatbotAppearance
