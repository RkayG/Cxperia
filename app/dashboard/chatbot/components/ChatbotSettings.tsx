import React from "react"
import { Users, Clock } from "lucide-react"

interface ChatbotSettingsProps {
  chatbotConfig: any
  setChatbotConfig: (config: any) => void
}

const ChatbotSettings: React.FC<ChatbotSettingsProps> = ({ chatbotConfig, setChatbotConfig }) => (
  
    <div className="space-y-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Chatbot Configuration</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">↗ 3% from last week</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.3s</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600">↘ 0.5s slower</span>
          </div>
        </div>
      </div>

      {/* Chatbot Settings Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Chatbot Name</label>
            <input
              type="text"
              value={chatbotConfig.name}
              onChange={(e) => setChatbotConfig({ ...chatbotConfig, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
              placeholder="Enter chatbot name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={chatbotConfig.is_active}
                onChange={(e) => setChatbotConfig({ ...chatbotConfig, is_active: e.target.checked })}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">{chatbotConfig.is_active ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Welcome Greeting</label>
            <textarea
              value={chatbotConfig.greeting}
              onChange={(e) => setChatbotConfig({ ...chatbotConfig, greeting: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
              placeholder="Enter welcome message"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Fallback Message</label>
            <textarea
              value={chatbotConfig.fallback_message}
              onChange={(e) => setChatbotConfig({ ...chatbotConfig, fallback_message: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500"
              placeholder="Message when chatbot can't answer"
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-medium text-gray-900">Popular Questions</h3>
          <div className="space-y-4">
            {[
              { question: "Foundation shade matching", count: 143, percentage: 35 },
              { question: "Return policy", count: 98, percentage: 24 },
              { question: "Shipping information", count: 76, percentage: 19 },
              { question: "Product ingredients", count: 52, percentage: 13 },
              { question: "Application tips", count: 37, percentage: 9 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.question}</p>
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-sm text-gray-600">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-medium text-gray-900">User Satisfaction</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-sm opacity-90">Satisfied</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">4.7</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
                <div className="mt-1 flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">892</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Recent Activity</h3>
          <button className="text-sm text-orange-600 hover:text-orange-700">View All</button>
        </div>

        <div className="space-y-3">
          {[
            { user: "Sarah M.", question: "Best foundation for oily skin?", time: "2 min ago", resolved: true },
            { user: "Emma K.", question: "Shipping to Canada", time: "5 min ago", resolved: true },
            { user: "Lisa P.", question: "Return without receipt", time: "8 min ago", resolved: false },
            { user: "Maria G.", question: "Shade 240 availability", time: "12 min ago", resolved: true },
            { user: "Anna T.", question: "Cruelty-free certification", time: "15 min ago", resolved: true },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-sm font-medium text-white">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.question}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{activity.time}</span>
                <div className={`h-2 w-2 rounded-full ${activity.resolved ? "bg-green-400" : "bg-yellow-400"}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
)

export default ChatbotSettings
