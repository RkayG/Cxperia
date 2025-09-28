'use client';
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
  Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { chatbotService, type FAQItem, type Experience, type ChatbotConfig, type Product, type Brand } from '@/lib/chatbotService';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  priority: number;
  product_id?: string;
}

interface DashboardProps {
  brandId: string;
}

const ChatbotDashboard = ({ brandId }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingFAQ, setIsEditingFAQ] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>({
    id: '',
    brand_id: brandId,
    name: 'Beauty Assistant',
    greeting: 'Hi! I\'m here to help with your beauty questions. How can I assist you today?',
    fallback_message: 'I\'m sorry, I don\'t have information about that. Please contact our support team for further assistance.',
    brand_color: '#F97316',
    avatar_type: 'bot',
    is_active: true,
    created_at: '',
    updated_at: ''
  });

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const categories = ['all', 'Product Selection', 'Returns', 'Brand Values', 'Shipping', 'Ingredients', 'Application Tips'];

  useEffect(() => {
    loadDashboardData();
  }, [brandId]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const dashboardData = await chatbotService.getBrandDashboard(brandId);
      setFaqs(dashboardData.faqItems as FAQItem[]);
      setExperiences(dashboardData.experiences as Experience[]);
      // You might need to load products separately
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category_id === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addNewFAQ = () => {
    const newFAQ: FAQItem = {
      id: 'temp-' + Date.now(),
      brand_id: brandId,
      category_id: null,
      product_id: null,
      question: '',
      answer: '',
      priority: 3,
      is_active: true,
      search_keywords: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFaqs([...faqs, newFAQ]);
    setIsEditingFAQ(true);
    setExpandedFAQ(newFAQ.id);
  };

  const updateFAQ = async (id: string, updates: Partial<FAQItem>) => {
    try {
      if (id.startsWith('temp-')) {
        // Create new FAQ
        const { product_id, category_id, ...faqData } = updates;
        const newFAQ = await chatbotService.createFAQItem({
          brand_id: brandId,
          product_id: product_id || null,
          category_id: category_id || null,
          question: updates.question || '',
          answer: updates.answer || '',
          priority: updates.priority || 3,
          is_active: true,
          search_keywords: updates.search_keywords || []
        });
        
        setFaqs(faqs.map(faq => faq.id === id ? newFAQ : faq));
      } else {
        // Update existing FAQ
        const updatedFAQ = await chatbotService.updateFAQItem(id, updates);
        setFaqs(faqs.map(faq => faq.id === id ? updatedFAQ : faq));
      }
    } catch (error) {
      console.error('Failed to update FAQ:', error);
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      if (!id.startsWith('temp-')) {
        await chatbotService.deleteFAQItem(id);
      }
      setFaqs(faqs.filter(faq => faq.id !== id));
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    }
  };

  const saveChatbotConfig = async () => {
    try {
      // Implementation for saving chatbot config
      console.log('Saving chatbot config:', chatbotConfig);
    } catch (error) {
      console.error('Failed to save chatbot config:', error);
    }
  };

  const generateQRCode = async (experienceId: string) => {
    try {
      // Implementation for QR code generation
      console.log('Generating QR for experience:', experienceId);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-orange-100 text-orange-700 border border-orange-200'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hybrid FAQ Chatbot Manager</h1>
            <p className="text-gray-600 mt-1">Configure your product-aware customer support bot</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Eye size={18} />
              Preview
            </button>
            <button 
              onClick={saveChatbotConfig}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="space-y-2">
            <TabButton id="chatbot" label="Chatbot Settings" icon={Bot} />
            <TabButton id="faqs" label="FAQ Management" icon={MessageCircle} />
            <TabButton id="appearance" label="Appearance" icon={Palette} />
            <TabButton id="qr" label="QR Integration" icon={QrCode} />
            <TabButton id="analytics" label="Analytics" icon={BarChart3} />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total FAQs</span>
                <span className="font-medium">{faqs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Products</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experiences</span>
                <span className="font-medium">{experiences.length}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'chatbot' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chatbot Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                      <p className="text-2xl font-bold text-gray-900">94%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="text-green-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-green-600">↗ 3% from last week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">2.3s</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Clock className="text-orange-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-red-600">↘ 0.5s slower</span>
                  </div>
                </div>
              </div>

              {/* Chatbot Settings Form */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chatbot Name
                    </label>
                    <input
                      type="text"
                      value={chatbotConfig.name}
                      onChange={(e) => setChatbotConfig({...chatbotConfig, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter chatbot name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={chatbotConfig.isActive}
                        onChange={(e) => setChatbotConfig({...chatbotConfig, isActive: e.target.checked})}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {chatbotConfig.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Welcome Greeting
                    </label>
                    <textarea
                      value={chatbotConfig.greeting}
                      onChange={(e) => setChatbotConfig({...chatbotConfig, greeting: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter welcome message"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fallback Message
                    </label>
                    <textarea
                      value={chatbotConfig.fallbackMessage}
                      onChange={(e) => setChatbotConfig({...chatbotConfig, fallbackMessage: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Message when chatbot can't answer"
                    />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Popular Questions</h3>
                  <div className="space-y-4">
                    {[
                      { question: "Foundation shade matching", count: 143, percentage: 35 },
                      { question: "Return policy", count: 98, percentage: 24 },
                      { question: "Shipping information", count: 76, percentage: 19 },
                      { question: "Product ingredients", count: 52, percentage: 13 },
                      { question: "Application tips", count: 37, percentage: 9 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.question}</p>
                          <div className="mt-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4 text-sm text-gray-600">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">User Satisfaction</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white">
                        <div className="text-center">
                          <div className="text-2xl font-bold">94%</div>
                          <div className="text-sm opacity-90">Satisfied</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">4.7</div>
                        <div className="text-sm text-gray-600">Avg Rating</div>
                        <div className="flex justify-center mt-1">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className="text-yellow-400">★</span>
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Recent Activity</h3>
                  <button className="text-sm text-orange-600 hover:text-orange-700">View All</button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { user: "Sarah M.", question: "Best foundation for oily skin?", time: "2 min ago", resolved: true },
                    { user: "Emma K.", question: "Shipping to Canada", time: "5 min ago", resolved: true },
                    { user: "Lisa P.", question: "Return without receipt", time: "8 min ago", resolved: false },
                    { user: "Maria G.", question: "Shade 240 availability", time: "12 min ago", resolved: true },
                    { user: "Anna T.", question: "Cruelty-free certification", time: "15 min ago", resolved: true }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                          <p className="text-sm text-gray-600">{activity.question}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <div className={`w-2 h-2 rounded-full ${activity.resolved ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

       {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Hybrid FAQ Management</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {faqs.filter(f => f.product_id).length} product-specific · 
                    {faqs.filter(f => !f.product_id).length} brand-wide
                  </span>
                  <button
                    onClick={addNewFAQ}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={18} />
                    Add FAQ
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                  <select
                    onChange={(e) => {
                      // Filter by product scope
                      const value = e.target.value;
                      // Implementation for product filtering
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedFAQ === faq.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{faq.question}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {faq.category_id || 'Uncategorized'}
                              </span>
                              {faq.product_id && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                  Product-specific
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                Priority: {faq.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setExpandedFAQ(faq.id);
                              setIsEditingFAQ(true);
                            }}
                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteFAQ(faq.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {expandedFAQ === faq.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {isEditingFAQ ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  value={faq.question}
                                  onChange={(e) => updateFAQ(faq.id, { question: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Answer
                                </label>
                                <textarea
                                  value={faq.answer}
                                  onChange={(e) => updateFAQ(faq.id, { answer: e.target.value })}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                              </div>
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Scope
                                  </label>
                                  <select
                                    value={faq.product_id ? 'product' : 'brand'}
                                    onChange={(e) => {
                                      const scope = e.target.value;
                                      if (scope === 'brand') {
                                        updateFAQ(faq.id, { product_id: null });
                                      } else {
                                        // You would show a product selector here
                                        updateFAQ(faq.id, { product_id: 'some-product-id' });
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  >
                                    <option value="brand">Brand-wide</option>
                                    <option value="product">Product-specific</option>
                                  </select>
                                </div>
                                <div className="w-32">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                  </label>
                                  <select
                                    value={faq.priority}
                                    onChange={(e) => updateFAQ(faq.id, { priority: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setIsEditingFAQ(false);
                                    setExpandedFAQ(null);
                                  }}
                                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                              {faq.product_id && (
                                <p className="text-sm text-green-600 mt-2">
                                  ✓ This FAQ is specific to a product
                                </p>
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
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Chatbot Appearance</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Color Theme</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={chatbotConfig.brandColor}
                          onChange={(e) => setChatbotConfig({...chatbotConfig, brandColor: e.target.value})}
                          className="w-12 h-10 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={chatbotConfig.brandColor}
                          onChange={(e) => setChatbotConfig({...chatbotConfig, brandColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quick Colors
                      </label>
                      <div className="flex gap-2">
                        {['#F97316', '#EF4444', '#8B5CF6', '#06B6D4', '#10B981'].map(color => (
                          <button
                            key={color}
                            onClick={() => setChatbotConfig({...chatbotConfig, brandColor: color})}
                            className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400"
                            style={{backgroundColor: color}}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Chat Preview</h3>
                  <div className="bg-gray-50 rounded-lg p-4 h-80 flex flex-col">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{backgroundColor: chatbotConfig.brandColor}}
                      >
                        <Bot size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{chatbotConfig.name}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
                    </div>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto">
                      <div className="flex gap-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                          style={{backgroundColor: chatbotConfig.brandColor}}
                        >
                          <Bot size={12} />
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm">
                          <p className="text-sm text-gray-800">{chatbotConfig.greeting}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <div className="bg-blue-500 text-white rounded-lg px-3 py-2 max-w-xs">
                          <p className="text-sm">What's your return policy?</p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                          U
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled
                      />
                      <button 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{backgroundColor: chatbotConfig.brandColor}}
                        disabled
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">QR Code Integration</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-medium text-gray-900 mb-4">QR Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Landing Page URL
                        </label>
                        <input
                          type="url"
                          value="https://yourbeauty.com/support/chat"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          QR Code Size
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                          <option>Small (200x200)</option>
                          <option>Medium (400x400)</option>
                          <option>Large (600x600)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Include Logo
                        </label>
                        <div className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                          <span className="ml-2 text-sm text-gray-700">Add brand logo to QR code center</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Integration Instructions</h3>
                    <div className="prose text-sm text-gray-600">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Download the generated QR code</li>
                        <li>Print on product packaging, receipts, or marketing materials</li>
                        <li>Customers scan to access instant support</li>
                        <li>Monitor engagement through analytics</li>
                      </ol>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        <Download size={18} />
                        Download QR Code
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">QR Code Preview</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <div className="w-40 h-40 bg-black" style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='qr' width='10' height='10' patternUnits='userSpaceOnUse'%3e%3crect width='5' height='5' fill='black'/%3e%3crect x='5' y='5' width='5' height='5' fill='black'/%3e%3c/pattern%3e%3c/defs%3e%3crerect width='100' height='100' fill='url(%23qr)'/%3e%3c/svg%3e")`,
                        backgroundSize: 'cover'
                      }}></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Scan to access {chatbotConfig.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MessageCircle className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-green-600">↗ 12% from last week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                      <p className="text-2xl font-bold text-gray-900">94%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <BarChart3 className="text-green-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-green-600">↗ 3% from last week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">2.3s</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Clock className="text-orange-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-red-600">↘ 0.5s slower</span>
                  </div>
                </div>
              </div>

              {/* Charts and Graphs Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Conversation Trends</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Conversation chart visualization would appear here</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Top Categories</h3>
                  <div className="space-y-4">
                    {[
                      { category: "Product Selection", count: 356, percentage: 42 },
                      { category: "Returns", count: 198, percentage: 24 },
                      { category: "Shipping", count: 145, percentage: 17 },
                      { category: "Ingredients", count: 89, percentage: 11 },
                      { category: "Application Tips", count: 59, percentage: 7 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.category}</p>
                          <div className="mt-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4 text-sm text-gray-600">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">User Satisfaction</h3>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">94%</div>
                        <div className="text-sm opacity-90">Satisfied</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">4.7</div>
                        <div className="text-sm text-gray-600">Avg Rating</div>
                        <div className="flex justify-center mt-1">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className="text-yellow-400">★</span>
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Export Analytics</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <Download size={18} />
                    Export Report
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Download comprehensive analytics reports in CSV or PDF format for further analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotDashboard;