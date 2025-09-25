'use client';

import { SignupData } from '../page';

interface WelcomeStepProps {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function WelcomeStep({ nextStep }: WelcomeStepProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/cxperia.png" alt="Cxperia Logo" className="h-16 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Welcome to BeautyConnect
          </h1>
        </div>
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
        <p className="text-gray-600 mb-8 leading-relaxed text-center">
          Create your brand's digital experience in minutes. 
          Showcase products, share tutorials, and connect with your customers like never before.
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">✓</span>
            <span>Create beautiful product experiences</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">✓</span>
            <span>Share tutorials and beauty tips</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">✓</span>
            <span>Engage with your community</span>
          </div>
        </div>
        <button
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}