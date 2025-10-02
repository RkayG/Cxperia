'use client';
import { useEffect, useState } from 'react';
import ChatbotAnalytics from '@/app/dashboard/chatbot/components/ChatbotAnalytics';
import ChatbotAppearance from '@/app/dashboard/chatbot/components/ChatbotAppearance';
import ChatbotFAQManager from '@/app/dashboard/chatbot/components/ChatbotFAQManager';
import ChatbotHeader from '@/app/dashboard/chatbot/components/ChatbotHeader';
import ChatbotQRIntegration from '@/app/dashboard/chatbot/components/ChatbotQRIntegration';
import ChatbotSettings from '@/app/dashboard/chatbot/components/ChatbotSettings';
import ChatbotSidebar from '@/app/dashboard/chatbot/components/ChatbotSidebar';
import { type Brand, type ChatbotConfig, chatbotService, type Experience, type FAQItem, type Product } from '@/lib/chatbotService';

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
      <ChatbotHeader onSave={saveChatbotConfig} />
      <div className="flex">
        <ChatbotSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          faqsCount={faqs.length}
          productsCount={products.length}
          experiencesCount={experiences.length}
        />
        <div className="flex-1 p-6">
          {activeTab === 'chatbot' && (
            <ChatbotSettings chatbotConfig={chatbotConfig} setChatbotConfig={setChatbotConfig} />
          )}
          {activeTab === 'faqs' && (
            <ChatbotFAQManager />
          )}
          {activeTab === 'appearance' && (
            <ChatbotAppearance />
          )}
          {activeTab === 'qr' && (
            <ChatbotQRIntegration />
          )}
          {activeTab === 'analytics' && (
            <ChatbotAnalytics />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotDashboard;