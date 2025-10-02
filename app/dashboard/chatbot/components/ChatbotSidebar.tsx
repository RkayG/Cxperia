import { BarChart3, Bot, Clock, MessageCircle, Palette, QrCode, Users } from "lucide-react"
import React from "react"

interface ChatbotSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  faqsCount: number
  productsCount: number
  experiencesCount: number
}

const TabButton = ({
  id,
  label,
  icon: Icon,
  activeTab,
  setActiveTab,
}: {
  id: string
  label: string
  icon: any
  activeTab: string
  setActiveTab: (tab: string) => void
}) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
      activeTab === id
        ? "border border-orange-200 bg-orange-100 text-orange-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
)

const ChatbotSidebar: React.FC<ChatbotSidebarProps> = ({
  activeTab,
  setActiveTab,
  faqsCount,
  productsCount,
  experiencesCount,
}) => (
  <div className="min-h-screen w-64 border-r border-gray-200 bg-white p-4">
    <div className="space-y-2">
      <TabButton id="chatbot" label="Chatbot Settings" icon={Bot} activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabButton
        id="faqs"
        label="FAQ Management"
        icon={MessageCircle}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <TabButton id="appearance" label="Appearance" icon={Palette} activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabButton id="qr" label="QR Integration" icon={QrCode} activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabButton id="analytics" label="Analytics" icon={BarChart3} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
    {/* Quick Stats */}
    <div className="mt-8 rounded-lg bg-gray-50 p-4">
      <h3 className="mb-3 font-medium text-gray-900">Quick Stats</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total FAQs</span>
          <span className="font-medium">{faqsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Products</span>
          <span className="font-medium">{productsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Experiences</span>
          <span className="font-medium">{experiencesCount}</span>
        </div>
      </div>
    </div>
  </div>
)

export default ChatbotSidebar
