// app/public/experience/[slug]/chatbot/page.tsx
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { chatbotService } from '@/lib/chatbotService';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function PublicChatbot() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [botData, setBotData] = useState<any>(null);

  useEffect(() => {
    initializeBot();
  }, [slug]);

  const initializeBot = async () => {
    try {
      setIsLoading(true);
      const data = await chatbotService.getContextualFAQBot(slug);
      setBotData(data);
      
      // Record the scan
      await chatbotService.incrementScanCount(slug);
      
      // Add welcome message with product context
      const welcomeMessage = data.context.product 
        ? `Hi! You're looking at ${data.context.product.name}. ${data.chatbotConfig?.greeting || 'How can I help you today?'}`
        : data.chatbotConfig?.greeting || 'Hi! How can I help you today?';
      
      setMessages([{
        id: '1',
        type: 'bot',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: 'Sorry, this experience is not available.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !botData) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simple keyword matching - you'd replace this with proper NLP
      const searchResults = await chatbotService.searchFAQs(slug, input);
      
      let response = botData.chatbotConfig?.fallback_message || "I don't have information about that.";
      
      if (searchResults.length > 0) {
        response = searchResults[0].answer;
        // Record successful answer
        await chatbotService.recordInteraction(
          botData.experience.id,
          botData.experience.product_id,
          input,
          true
        );
      } else {
        // Record unanswered question
        await chatbotService.recordInteraction(
          botData.experience.id,
          botData.experience.product_id,
          input,
          false
        );
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white"
          style={{ 
            background: botData?.chatbotConfig?.brand_color 
              ? `linear-gradient(135deg, ${botData.chatbotConfig.brand_color}99, ${botData.chatbotConfig.brand_color})`
              : undefined 
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h1 className="font-semibold">
                {botData?.chatbotConfig?.name || 'Support Assistant'}
              </h1>
              {botData?.context?.product && (
                <p className="text-sm opacity-90">
                  {botData.context.product.name}
                </p>
              )}
            </div>
            <div className="ml-auto w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ 
                backgroundColor: botData?.chatbotConfig?.brand_color || '#3b82f6'
              }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}