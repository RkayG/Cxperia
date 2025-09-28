"use client"
import {
  Bot,
  Plus,
  Edit3,
  Trash2,
  Save,
  Eye,
  MessageCircle,
  Palette,
  QrCode,
  BarChart3,
  Users,
  Clock,
  ChevronDown,
  ChevronRight,
  Search,
  Download,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  chatbotService,
  type FAQItem,
  type Experience,
  type ChatbotConfig,
  type Product,
  type Brand,
} from "@/lib/chatbotService"
import ChatbotQRIntegration from "./components/ChatbotQRIntegration"
import { C } from "@upstash/redis/zmscore-DWj9Vh1g"
import ChatbotAnalytics from "./components/ChatbotAnalytics"
import ChatbotAppearance from "./components/ChatbotAppearance"
import ChatbotHeader from "./components/ChatbotHeader"
import ChatbotSidebar from "./components/ChatbotSidebar"
import ChatbotFAQManager from "./components/ChatbotFAQManager"
import ChatbotSettings from "./components/ChatbotSettings"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  priority: number
  product_id?: string
}

interface DashboardProps {
  brandId: string
}

const ChatbotDashboard = ({ brandId }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("chatbot")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditingFAQ, setIsEditingFAQ] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>({
    id: "",
    brand_id: brandId,
    name: "Beauty Assistant",
    greeting: "Hi! I'm here to help with your beauty questions. How can I assist you today?",
    fallback_message:
      "I'm sorry, I don't have information about that. Please contact our support team for further assistance.",
    brand_color: "#F97316",
    avatar_type: "bot",
    is_active: true,
    created_at: "",
    updated_at: "",
  })

  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const categories = [
    "all",
    "Product Selection",
    "Returns",
    "Brand Values",
    "Shipping",
    "Ingredients",
    "Application Tips",
  ]

  useEffect(() => {
    loadDashboardData()
  }, [brandId])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const dashboardData = await chatbotService.getBrandDashboard(brandId)
      setFaqs(dashboardData.faqItems as FAQItem[])
      setExperiences(dashboardData.experiences as Experience[])
      // You might need to load products separately
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category_id === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addNewFAQ = () => {
    const newFAQ: FAQItem = {
      id: "temp-" + Date.now(),
      brand_id: brandId,
      category_id: null,
      product_id: null,
      question: "",
      answer: "",
      priority: 3,
      is_active: true,
      search_keywords: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setFaqs([...faqs, newFAQ])
    setIsEditingFAQ(true)
    setExpandedFAQ(newFAQ.id)
  }

  // Update FAQ locally for instant typing
  const updateFAQ = (id: string, updates: Partial<FAQItem>) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((faq) =>
        faq.id === id ? { ...faq, ...updates } : faq
      )
    );
  };

  // Save FAQ to server (call this on Save button click)
  const saveFAQ = async (id: string) => {
    const faq = faqs.find((f) => f.id === id);
    if (!faq) return;
    try {
      if (id.startsWith("temp-")) {
        // Create new FAQ
        const newFAQ = await chatbotService.createFAQItem({
          brand_id: brandId,
          product_id: faq.product_id || null,
          category_id: faq.category_id || null,
          question: faq.question || "",
          answer: faq.answer || "",
          priority: faq.priority || 3,
          is_active: true,
          search_keywords: faq.search_keywords || [],
        });
        setFaqs((prevFaqs) => prevFaqs.map((f) => (f.id === id ? newFAQ : f)));
      } else {
        // Update existing FAQ
        const updatedFAQ = await chatbotService.updateFAQItem(id, faq);
        setFaqs((prevFaqs) => prevFaqs.map((f) => (f.id === id ? updatedFAQ : f)));
      }
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      if (!id.startsWith("temp-")) {
        await chatbotService.deleteFAQItem(id)
      }
      setFaqs(faqs.filter((faq) => faq.id !== id))
    } catch (error) {
      console.error("Failed to delete FAQ:", error)
    }
  }

  const saveChatbotConfig = async () => {
    try {
      const updatedConfig = await chatbotService.updateChatbotConfig(chatbotConfig.id, chatbotConfig);
      setChatbotConfig(updatedConfig);
      console.log("Chatbot config saved successfully.");
    } catch (error) {
      console.error("Failed to save chatbot config:", error);
    }
  }

  const generateQRCode = async (experienceId: string) => {
    try {
      // Implementation for QR code generation
      console.log("Generating QR for experience:", experienceId)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
    }
  }

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ChatbotHeader onSave={saveChatbotConfig} />

      <div className="flex">
        {/* Sidebar Navigation */}
        <ChatbotSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          faqsCount={faqs.length}
          productsCount={products.length}
          experiencesCount={experiences.length}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "chatbot" && (
            <ChatbotSettings chatbotConfig={chatbotConfig} setChatbotConfig={setChatbotConfig} />
          )}

          {activeTab === "faqs" && (
            <ChatbotFAQManager
              faqs={faqs}
              filteredFAQs={filteredFAQs}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              addNewFAQ={addNewFAQ}
              expandedFAQ={expandedFAQ}
              setExpandedFAQ={setExpandedFAQ}
              isEditingFAQ={isEditingFAQ}
              setIsEditingFAQ={setIsEditingFAQ}
              updateFAQ={updateFAQ}
              saveFAQ={saveFAQ}
              deleteFAQ={deleteFAQ}
            />
          )}

          {activeTab === "appearance" && (
            <ChatbotAppearance chatbotConfig={chatbotConfig} setChatbotConfig={setChatbotConfig} />
          )}

          {activeTab === "qr" && <ChatbotQRIntegration chatbotConfig={chatbotConfig} />}

          {activeTab === "analytics" && <ChatbotAnalytics />}
        </div>
      </div>
    </div>
  )
}

export default ChatbotDashboard
