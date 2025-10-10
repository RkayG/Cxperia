import { ChevronDown, ChevronRight, Edit3, Plus, Search, Trash2 } from "lucide-react"
import React from "react"
import { type FAQItem } from '@/lib/chatbotService'

interface ChatbotFAQManagerProps {
  faqs: FAQItem[]
  filteredFAQs: FAQItem[]
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  addNewFAQ: () => void
  expandedFAQ: string | null
  setExpandedFAQ: (id: string | null) => void
  isEditingFAQ: boolean
  setIsEditingFAQ: (val: boolean) => void
  updateFAQ: (id: string, updates: Partial<FAQItem>) => void
  deleteFAQ: (id: string) => void
}

const ChatbotFAQManager: React.FC<ChatbotFAQManagerProps> = ({
  faqs,
  filteredFAQs,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  addNewFAQ,
  expandedFAQ,
  setExpandedFAQ,
  isEditingFAQ,
  setIsEditingFAQ,
  updateFAQ,
  deleteFAQ,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">FAQ Management</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {faqs.filter((f) => f.product_id).length} product-specific ·{faqs.filter((f) => !f.product_id).length}{" "}
              brand-wide
            </span>
            <button
              onClick={addNewFAQ}
              className="flex items-center gap-2 rounded-lg bg-blue-700  px-4 py-2 text-white transition-colors hover:bg-orange-600"
            >
              <Plus size={18} />
              Add FAQ
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 ">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border text-black border-gray-300 py-2 pr-3 pl-10 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => {
                // Filter by product scope
                const value = e.target.value
                // Implementation for product filtering
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Scopes</option>
              <option value="brand">Brand-wide</option>
              <option value="product">Product-specific</option>
            </select>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="rounded-lg border border-gray-200 bg-white ">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-3">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedFAQ === faq.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      <div className="mt-1 flex items-center gap-4">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                          {faq.category_id || "Uncategorized"}
                        </span>
                        {faq.product_id && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                            Product-specific
                          </span>
                        )}
                        <span className="text-xs text-gray-500">Priority: {faq.priority}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setExpandedFAQ(faq.id)
                        setIsEditingFAQ(true)
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-500"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteFAQ(faq.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {expandedFAQ === faq.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    {isEditingFAQ ? (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFAQ(faq.id, { question: e.target.value })}
                            className="w-full rounded-lg text-black border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Answer</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFAQ(faq.id, { answer: e.target.value })}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Scope</label>
                            <select
                              value={faq.product_id ? "product" : "brand"}
                              onChange={(e) => {
                                const scope = e.target.value
                                if (scope === "brand") {
                                  updateFAQ(faq.id, { product_id: null })
                                } else {
                                  // You would show a product selector here
                                  updateFAQ(faq.id, { product_id: "some-product-id" })
                                }
                              }}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="brand">Brand-wide</option>
                              <option value="product">Product-specific</option>
                            </select>
                          </div>
                          <div className="w-32">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
                            <select
                              value={faq.priority}
                              onChange={(e) => updateFAQ(faq.id, { priority: parseInt(e.target.value) })}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                            >
                              <option value={1}>High</option>
                              <option value={2}>Medium</option>
                              <option value={3}>Low</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditingFAQ(false)}
                            className="rounded-lg bg-purple-800 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingFAQ(false)
                              setExpandedFAQ(null)
                            }}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                        {faq.product_id && (
                          <p className="mt-2 text-sm text-green-600">✓ This FAQ is specific to a product</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatbotFAQManager
