//'use client';
//
//import { AnimatePresence, motion } from "framer-motion";
//import React, { useEffect, useRef, useState } from "react";
//import { Skeleton } from "@/components/ui/skeleton";
//
//type WelcomeStep = 
//  | 'welcome' 
//  | 'product_reveal' 
//  | 'product_tagline'
//  | 'purchase_status' 
//  | 'customer_type' 
//  | 'purchase_location'
//  | 'feature_selection';
//
//const FLOW_CONFIG = {
//  returningCustomer: {
//    text: "Nice to see you again. What would you like to explore today?",
//    directToStep: 'feature_selection' as WelcomeStep,
//  },
//
//  newCustomerFlow: [
//    { step: 'welcome' as WelcomeStep, text: "Welcome friend! 👋", autoProceed: true, delay: 2000 },
//    { step: 'product_reveal' as WelcomeStep, text: (product: any) => `You've scanned: ${product?.name || "this amazing product"}`, autoProceed: true, delay: 2500 },
//    { step: 'product_tagline' as WelcomeStep, text: (product: any) => product?.tagline || "Discover something special", autoProceed: true, delay: 2000 },
//    { step: 'purchase_status' as WelcomeStep, text: "Just exploring, or have you already made it yours?", autoProceed: false },
//  ],
//
//  questions: {
//    purchase_status: {
//      text: "Just exploring, or have you already made it yours?",
//      options: [
//        { label: "✅ Yes, I own this product", value: true, nextStep: 'customer_type' as WelcomeStep, responseText: "Wonderful! Are you a loyal customer or trying this for the first time?" },
//        { label: "🔍 Just exploring for now", value: false, nextStep: 'feature_selection' as WelcomeStep, responseText: "No worries! We'll help you discover everything before you decide." }
//      ]
//    },
//    customer_type: {
//      text: "Wonderful! Are you a loyal customer or trying this for the first time?",
//      options: [
//        { label: "🆕 First time trying this", value: false, nextStep: 'purchase_location' as WelcomeStep, responseText: "Great! Did you purchase this online or in-store?" },
//        { label: "💫 I'm a loyal customer", value: true, nextStep: 'feature_selection' as WelcomeStep, responseText: "We've prepared some amazing features for you. What interests you most?" }
//      ]
//    },
//    purchase_location: {
//      text: "Great! Did you purchase this online or in-store?",
//      options: [
//        { label: "🛒 Purchased Online", value: 'online', nextStep: 'feature_selection' as WelcomeStep, responseText: "Perfect! We've prepared some amazing features for you. What interests you most?" },
//        { label: "🏪 Purchased In-Store", value: 'in_store', nextStep: 'feature_selection' as WelcomeStep, responseText: "Perfect! We've prepared some amazing features for you. What interests you most?" }
//      ]
//    }
//  },
//
//  features: [
//    { id: 'tutorials', label: '📚 Tutorials & Routines', description: 'Step-by-step guides' },
//    { id: 'ingredients', label: '🧪 Ingredient Insights', description: "What's inside explained" },
//    { id: 'loyalty', label: '🎁 Loyalty Rewards', description: 'Earn points & rewards' },
//    { id: 'skin', label: '✨ Skin Recommendations', description: 'Personalized advice' },
//    { id: 'chatbot', label: '💬 Ask Questions', description: 'Get instant answers' }
//  ]
//};
//
//interface WelcomeFlowProps {
//  product: any;
//  brandLogo?: string;
//  brandName?: string;
//  color: string;
//  isReturningCustomer: boolean | null;
//  onFeatureSelect: (featureId: string) => void;
//  isLoading?: boolean;
//}
//
//const WelcomeFlow: React.FC<WelcomeFlowProps> = ({
//  product,
//  brandLogo,
//  brandName,
//  color,
//  isReturningCustomer,
//  onFeatureSelect,
//  isLoading = false
//}) => {
//  const [currentStep, setCurrentStep] = useState<WelcomeStep>('welcome');
//  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
//  const [purchaseLocation, setPurchaseLocation] = useState<'online' | 'in_store' | null>(null);
//  const [currentText, setCurrentText] = useState<string>("");
//  const [showButtons, setShowButtons] = useState(false);
//
//  const autoProceedRef = useRef<NodeJS.Timeout>();
//  const currentIndexRef = useRef(0);
//
//  // New customer automatic flow
//  const startNewCustomerFlow = () => {
//    const proceedFlow = () => {
//      const flowStep = FLOW_CONFIG.newCustomerFlow[currentIndexRef.current];
//      if (!flowStep) return;
//
//      const text = typeof flowStep.text === 'function'
//        ? flowStep.text(product)
//        : flowStep.text;
//
//      setCurrentText(text);
//      setCurrentStep(flowStep.step);
//
//      if (flowStep.autoProceed) {
//        setShowButtons(false);
//
//        // Clear previous timer
//        if (autoProceedRef.current) {
//          clearTimeout(autoProceedRef.current);
//        }
//
//        autoProceedRef.current = setTimeout(() => {
//          currentIndexRef.current += 1;
//          proceedFlow();
//        }, flowStep.delay);
//      } else {
//        setShowButtons(true);
//      }
//
//      // Advance index only once (fix for double-step bug)
//      if (flowStep.autoProceed) {
//        currentIndexRef.current += 1;
//      }
//    };
//
//    proceedFlow();
//  };
//
//  useEffect(() => {
//    if (isReturningCustomer === true) {
//      setCurrentText(FLOW_CONFIG.returningCustomer.text);
//      setCurrentStep(FLOW_CONFIG.returningCustomer.directToStep);
//      setShowButtons(true);
//    } else if (isReturningCustomer === false) {
//      currentIndexRef.current = 0; // Reset flow index
//      startNewCustomerFlow();
//    }
//  }, [isReturningCustomer]);
//
//  useEffect(() => {
//    return () => {
//      if (autoProceedRef.current) {
//        clearTimeout(autoProceedRef.current);
//      }
//    };
//  }, []);
//
//  const handleOptionSelect = (questionType: keyof typeof FLOW_CONFIG.questions, optionValue: any) => {
//    const question = FLOW_CONFIG.questions[questionType];
//    const selectedOption = question.options.find(opt => opt.value === optionValue);
//    if (!selectedOption) return;
//
//    if (questionType === 'purchase_status') {
//      setHasPurchased(optionValue);
//    } else if (questionType === 'purchase_location') {
//      setPurchaseLocation(optionValue);
//    }
//
//    setCurrentText(selectedOption.responseText);
//    setShowButtons(false);
//
//    setTimeout(() => {
//      setCurrentStep(selectedOption.nextStep);
//      if (selectedOption.nextStep === 'feature_selection') {
//        setShowButtons(true);
//      } else {
//        const nextQuestion = FLOW_CONFIG.questions[selectedOption.nextStep];
//        if (!nextQuestion) return;
//        setCurrentText(nextQuestion.text);
//        setShowButtons(true);
//      }
//    }, 1500);
//  };
//
//  const getCurrentQuestion = () => {
//    return FLOW_CONFIG.questions[currentStep as keyof typeof FLOW_CONFIG.questions];
//  };
//
//  const renderQuestionOptions = (question: any) => (
//    <div className="space-y-4">
//      {question.options.map((option: any, index: number) => (
//        <motion.button
//          key={index}
//          initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
//          animate={{ x: 0, opacity: 1 }}
//          transition={{ delay: index * 0.1 }}
//          whileHover={{ scale: 1.02 }}
//          whileTap={{ scale: 0.98 }}
//          onClick={() => handleOptionSelect(currentStep as keyof typeof FLOW_CONFIG.questions, option.value)}
//          className="w-full bg-white/20 backdrop-blur-sm text-white p-4 rounded-xl font-medium border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
//        >
//          {option.label}
//        </motion.button>
//      ))}
//    </div>
//  );
//
//  const renderFeatureSelection = () => (
//    <div className="space-y-3">
//      <div className="grid grid-cols-1 gap-3 mb-6">
//        {FLOW_CONFIG.features.map((feature, index) => (
//          <motion.button
//            key={feature.id}
//            initial={{ y: 20, opacity: 0 }}
//            animate={{ y: 0, opacity: 1 }}
//            transition={{ delay: index * 0.1 }}
//            whileHover={{ scale: 1.02 }}
//            whileTap={{ scale: 0.98 }}
//            onClick={() => onFeatureSelect(feature.id)}
//            className="p-4 rounded-xl text-left transition-all duration-300 border-2 bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20"
//          >
//            <div className="text-white font-medium">{feature.label}</div>
//            <div className="text-white/70 text-sm mt-1">{feature.description}</div>
//          </motion.button>
//        ))}
//      </div>
//    </div>
//  );
//
//  const renderSkeleton = () => (
//    <div className="min-h-screen flex flex-col max-w-xl mx-auto items-center p-0 sm:p-6 transition-colors duration-1000" style={{ backgroundColor: color }}>
//      <div className="w-full flex justify-center pt-8 pb-4">
//        <Skeleton className="w-20 h-20 rounded-full bg-white/20" />
//      </div>
//      <div className="w-full max-w-md flex flex-col items-stretch px-2 sm:px-0 flex-1">
//        <div className="mb-8 min-h-[120px] flex items-start justify-center" style={{ height: '120px' }}>
//          <div className="text-center space-y-2">
//            <Skeleton className="h-8 w-64 bg-white/20 mx-auto" />
//            <Skeleton className="h-6 w-48 bg-white/20 mx-auto" />
//          </div>
//        </div>
//        <div className="w-full space-y-4">
//          <Skeleton className="h-16 w-full bg-white/20 rounded-xl" />
//          <Skeleton className="h-16 w-full bg-white/20 rounded-xl" />
//        </div>
//      </div>
//    </div>
//  );
//
//  if (isLoading) return renderSkeleton();
//
//  return (
//    <div className="min-h-screen flex flex-col max-w-xl mx-auto items-center p-0 sm:p-6 transition-colors duration-1000" style={{ backgroundColor: color }}>
//      {/* Logo */}
//      <div className="w-full flex justify-center pt-8 pb-4">
//        {brandLogo ? (
//          <img src={brandLogo} alt={brandName || ''} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm object-contain p-2" />
//        ) : (
//          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
//            <span className="text-white font-bold text-sm">BRAND</span>
//          </div>
//        )}
//      </div>
//
//      <div className="w-full max-w-md flex flex-col items-stretch px-2 sm:px-0 flex-1">
//        {/* Text display with animation */}
//        <div className="mb-8 min-h-[120px] flex items-start justify-center" style={{ height: '120px' }}>
//          <AnimatePresence mode="wait">
//            <motion.div
//              key={currentStep}
//              initial={{ opacity: 0, y: 10 }}
//              animate={{ opacity: 1, y: 0 }}
//              exit={{ opacity: 0, y: -10 }}
//              transition={{ duration: 0.5, ease: "easeOut" }}
//              className="text-2xl font-medium text-white leading-relaxed text-center"
//            >
//              {currentText}
//            </motion.div>
//          </AnimatePresence>
//        </div>
//
//        <AnimatePresence>
//          {showButtons && (
//            <motion.div
//              key="buttons"
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              exit={{ opacity: 0, y: -20 }}
//              className="w-full"
//            >
//              {getCurrentQuestion() && renderQuestionOptions(getCurrentQuestion())}
//              {currentStep === 'feature_selection' && renderFeatureSelection()}
//            </motion.div>
//          )}
//        </AnimatePresence>
//      </div>
//    </div>
//  );
//};
//
//export default WelcomeFlow;
//