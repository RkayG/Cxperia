'use client';
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from "react";
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

type WelcomeStep = 
  | 'welcome' 
  | 'product_reveal' 
  | 'product_tagline'
  | 'purchase_status' 
  | 'customer_type' 
  | 'purchase_location'
  | 'feature_selection';

// ==================== CONFIGURATION ====================
// Easy to add/modify questions and flow logic
const FLOW_CONFIG = {
  // Returning customer experience
  returningCustomer: {
    text: "Nice to see you again. What would you like to explore today?",
    directToStep: 'feature_selection' as WelcomeStep,
  },

  // New customer flow steps
  newCustomerFlow: [
    { 
      step: 'welcome' as WelcomeStep, 
      text: "Welcome friend! 👋", 
      autoProceed: true,
      delay: 2000 
    },
    { 
      step: 'product_reveal' as WelcomeStep, 
      text: (product: any) => `You've scanned: ${product?.name || "this amazing product"}`, 
      autoProceed: true,
      delay: 2500 
    },
    { 
      step: 'product_tagline' as WelcomeStep, 
      text: (product: any) => product?.tagline || "Discover something special", 
      autoProceed: true,
      delay: 2000 
    },
    { 
      step: 'purchase_status' as WelcomeStep, 
      text: "Just exploring, or have you already made it yours?",
      autoProceed: false, // Shows buttons
    }
  ],

  // Question configurations
  questions: {
    purchase_status: {
      text: "Just exploring, or have you already made it yours?",
      options: [
        { 
          label: "✅ Yes, I own this product", 
          value: true,
          nextStep: 'customer_type' as WelcomeStep,
          responseText: "Wonderful! Are you a loyal customer or trying this for the first time?"
        },
        { 
          label: "🔍 Just exploring for now", 
          value: false,
          nextStep: 'feature_selection' as WelcomeStep,
          responseText: "No worries! We'll help you discover everything before you decide."
        }
      ]
    },
    customer_type: {
      text: "Wonderful! Are you a loyal customer or trying this for the first time?",
      options: [
        { 
          label: "🆕 First time trying this", 
          value: false,
          nextStep: 'purchase_location' as WelcomeStep,
          responseText: "Great! Did you purchase this online or in-store?"
        },
        { 
          label: "💫 I'm a loyal customer", 
          value: true,
          nextStep: 'feature_selection' as WelcomeStep,
          responseText: "We've prepared some amazing features for you. What interests you most?"
        }
      ]
    },
    purchase_location: {
      text: "Great! Did you purchase this online or in-store?",
      options: [
        { 
          label: "🛒 Purchased Online", 
          value: 'online',
          nextStep: 'feature_selection' as WelcomeStep,
          responseText: "Perfect! We've prepared some amazing features for you. What interests you most?"
        },
        { 
          label: "🏪 Purchased In-Store", 
          value: 'in_store',
          nextStep: 'feature_selection' as WelcomeStep,
          responseText: "Perfect! We've prepared some amazing features for you. What interests you most?"
        }
      ]
    }
  },

  // Feature selection configuration
  features: [
    { id: 'ingredients', label: '🔬 Ingredients', description: 'Discover what makes it special', path: (slug: string) => `/experience/${slug}/ingredients` },
    { id: 'usage', label: '📖 Usage', description: 'How to get the best results', path: (slug: string) => `/experience/${slug}/usage` },
    { id: 'tutorials', label: '🎬 Tutorials & Routines', description: 'Watch it in action', path: (slug: string) => `/experience/${slug}/tutorials` },
    { id: 'benefits', label: '✨ Share Feedback', description: 'Let us know your thoughts', path: (slug: string) => `/experience/${slug}/benefits` },
    { id: 'reviews', label: '⭐ Customer Support', description: 'Get help or contact us', path: (slug: string) => `/experience/${slug}/reviews` },
  ]
};

// ==================== MAIN COMPONENT ====================
const InteractiveWelcome: React.FC = () => {
  const { color, slug, brandLogo, brandName, product} = usePublicExpStore();
  
  const [currentStep, setCurrentStep] = useState<WelcomeStep>('welcome');
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
  const [isReturningCustomer, setIsReturningCustomer] = useState<boolean | null>(null);
  const [purchaseLocation, setPurchaseLocation] = useState<'online' | 'in_store' | null>(null);
  const [currentText, setCurrentText] = useState<string>("");
  const [showButtons, setShowButtons] = useState(false);
  const [customerCheckComplete, setCustomerCheckComplete] = useState(false);
  const [lastCheckedSlug, setLastCheckedSlug] = useState<string | null>(null);
  const autoProceedRef = useRef<NodeJS.Timeout>();

  const router = useRouter();

  // Check if this is a returning customer
  useEffect(() => {
    // Reset customer check if slug has changed
    if (slug && slug !== lastCheckedSlug) {
      console.log("🔄 Slug changed, resetting customer check");
      setCustomerCheckComplete(false);
      setLastCheckedSlug(slug);
    }
    
    if (slug && !customerCheckComplete) {
      console.log("🔍 Checking customer status for slug:", slug);
      
      // Check if this is their first time scanning ANY product
      const hasScannedAnyProduct = localStorage.getItem('has_scanned_any_product');
      const hasScannedThisProduct = localStorage.getItem(`scanned_${slug}`);
      
      console.log("📊 Has scanned any product:", hasScannedAnyProduct);
      console.log("📊 Has scanned this product:", hasScannedThisProduct);
      console.log("🔄 Customer check complete:", customerCheckComplete);
      
      if (hasScannedThisProduct) {
        // They've scanned this specific product before - returning customer
        setIsReturningCustomer(true);
        setCurrentText(FLOW_CONFIG.returningCustomer.text);
        setCurrentStep(FLOW_CONFIG.returningCustomer.directToStep);
        setShowButtons(true);
        setCustomerCheckComplete(true);
        console.log("Returning customer - scanned this product before");
      } else if (hasScannedAnyProduct) {
        // They've scanned other products but not this one - new to this product
        setIsReturningCustomer(false);
        localStorage.setItem(`scanned_${slug}`, 'true');
        setCustomerCheckComplete(true);
        startNewCustomerFlow();
        console.log("New to this product - but has scanned other products");
      } else {
        // First time scanning anything - completely new customer
        setIsReturningCustomer(false);
        localStorage.setItem('has_scanned_any_product', 'true');
        localStorage.setItem(`scanned_${slug}`, 'true');
        setCustomerCheckComplete(true);
        startNewCustomerFlow();
        console.log("Completely new customer - first scan ever");
      }
    } else if (!slug) {
      console.log("❌ No slug provided, skipping customer check");
      return;
    } else {
      console.log("⏭️ Customer check already complete, skipping");
    }
  }, [slug, customerCheckComplete, lastCheckedSlug]);

  // New customer automatic flow
  const startNewCustomerFlow = () => {
    let currentIndex = 0;

    const proceedFlow = () => {
      if (currentIndex < FLOW_CONFIG.newCustomerFlow.length) {
        const flowStep = FLOW_CONFIG.newCustomerFlow[currentIndex];
        
        // Set current text (handle function or string)
        const text = typeof flowStep.text === 'function' 
          ? flowStep.text(product) 
          : flowStep.text;
        setCurrentText(text);

        if (flowStep.autoProceed) {
          // Auto-proceed to next step
          autoProceedRef.current = setTimeout(() => {
            currentIndex++;
            proceedFlow();
          }, flowStep.delay);
        } else {
          // Show buttons for user interaction
          setShowButtons(true);
          setCurrentStep(flowStep.step);
        }
        
        currentIndex++;
      }
    };

    proceedFlow();
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (autoProceedRef.current) {
        clearTimeout(autoProceedRef.current);
      }
    };
  }, []);

  // Generic option handler for all questions
  const handleOptionSelect = (questionType: keyof typeof FLOW_CONFIG.questions, optionValue: any) => {
    const question = FLOW_CONFIG.questions[questionType];
    const selectedOption = question.options.find(opt => opt.value === optionValue);
    
    if (!selectedOption) return;

    // Update state based on question type
    switch (questionType) {
      case 'purchase_status':
        setHasPurchased(optionValue);
        break;
      case 'customer_type':
        setIsReturningCustomer(optionValue);
        break;
      case 'purchase_location':
        setPurchaseLocation(optionValue);
        break;
    }

    // Set response text and proceed
    setCurrentText(selectedOption.responseText);
    setShowButtons(true);
    
    // Auto-proceed to next step after delay
    setTimeout(() => {
      setCurrentStep(selectedOption.nextStep);
    }, 800);
  };

  // Feature selection handler
  const handleFeatureSelect = (featureId: string) => {
    const feature = FLOW_CONFIG.features.find(f => f.id === featureId);
    if (feature && slug) {
      router.push(feature.path(slug));
    }
  };

  // Proceed to next step
  const proceedToNextStep = (nextStep: WelcomeStep, delay: number = 800) => {
    setTimeout(() => {
      setCurrentStep(nextStep);
    }, delay);
  };

  // Get current question configuration
  const getCurrentQuestion = () => {
    return FLOW_CONFIG.questions[currentStep as keyof typeof FLOW_CONFIG.questions];
  };

  // Render question options
  const renderQuestionOptions = (question: any) => {
    return (
      <div className="space-y-4">
        {question.options.map((option: any, index: number) => (
          <motion.button
            key={index}
            initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionSelect(currentStep as keyof typeof FLOW_CONFIG.questions, option.value)}
            className="w-full bg-white/20 backdrop-blur-sm text-white p-4 rounded-xl font-medium border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    );
  };

  // Render feature selection
  const renderFeatureSelection = () => {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 mb-6">
          {FLOW_CONFIG.features.map((feature, index) => (
            <motion.button
              key={feature.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFeatureSelect(feature.id)}
              className="p-4 rounded-xl text-left transition-all duration-300 border-2 bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20"
            >
              <div className="text-white font-medium">{feature.label}</div>
              <div className="text-white/70 text-sm mt-1">{feature.description}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div 
      className="min-h-screen flex flex-col items-center p-0 sm:p-6 transition-colors duration-1000"
      style={{ backgroundColor: color }}
    >
      {/* Fixed Brand Logo at the top */}
      <div className="w-full flex justify-center pt-8 pb-4">
        {brandLogo ? (
          <img
            src={brandLogo}
            alt={brandName || ''}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm object-contain p-2"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-sm">BRAND</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-md flex flex-col items-stretch px-2 sm:px-0 flex-1">
        {/* Text Display */}
        <div className="mb-8 min-h-[120px] flex items-start justify-center" style={{height: '120px'}}>
          <motion.div
            key={currentText} // This ensures re-animation when text changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-2xl font-medium text-white leading-relaxed text-center"
          >
            {currentText}
          </motion.div>
        </div>

        {/* Interactive Elements */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {/* Question Steps */}
              {getCurrentQuestion() && renderQuestionOptions(getCurrentQuestion())}
              
              {/* Feature Selection */}
              {currentStep === 'feature_selection' && renderFeatureSelection()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveWelcome;