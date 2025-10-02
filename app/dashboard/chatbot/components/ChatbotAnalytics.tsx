import { BarChart3, Clock, Download, MessageCircle } from "lucide-react"
import React from "react"

const ChatbotAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <MessageCircle className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">↗ 12% from last week</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <BarChart3 className="text-green-600" size={24} />
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

        {/* Charts and Graphs Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-medium text-gray-900">Conversation Trends</h3>
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
            <p className="text-gray-500">Conversation chart visualization would appear here</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-medium text-gray-900">Top Categories</h3>
            <div className="space-y-4">
              {[
                { category: "Product Selection", count: 356, percentage: 42 },
                { category: "Returns", count: 198, percentage: 24 },
                { category: "Shipping", count: 145, percentage: 17 },
                { category: "Ingredients", count: 89, percentage: 11 },
                { category: "Application Tips", count: 59, percentage: 7 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.category}</p>
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
            <div className="text-center">
              <div className="mb-4 inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-sm opacity-90">Satisfied</div>
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

        {/* Export Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Export Analytics</h3>
            <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600">
              <Download size={18} />
              Export Report
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Download comprehensive analytics reports in CSV or PDF format for further analysis.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatbotAnalytics
