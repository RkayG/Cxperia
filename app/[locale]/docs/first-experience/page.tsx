import Link from 'next/link';
import { ArrowLeft, Sparkles, QrCode, BookOpen, BarChart, Users, Palette } from 'lucide-react';

export default function FirstExperiencePage() {
  const steps = [
    {
      number: 1,
      title: 'Set Up Your Brand',
      description: 'Add your brand information, logo, and colors',
      icon: Sparkles,
      details: [
        'Upload your brand logo',
        'Choose your brand colors',
        'Add your brand description',
        'Set up your contact information'
      ]
    },
    {
      number: 2,
      title: 'Create Your First Product Experience',
      description: 'Build an interactive experience for one of your products',
      icon: QrCode,
      details: [
        'Add product information and images',
        'Write a compelling product description',
        'Set up product specifications',
        'Choose which features to enable'
      ]
    },
    {
      number: 3,
      title: 'Generate QR Code',
      description: 'Create a QR code that customers can scan',
      icon: QrCode,
      details: [
        'Generate QR code for your product',
        'Download PNG or PDF format',
        'Add QR code to your product packaging',
        'Test scanning with your phone'
      ]
    },
    {
      number: 4,
      title: 'Create Tutorials (Optional)',
      description: 'Add step-by-step tutorials for your products',
      icon: BookOpen,
      details: [
        'Create step-by-step tutorials',
        'Add images and videos',
        'Include pro tips and warnings',
        'Publish tutorials to your experience'
      ]
    },
    {
      number: 5,
      title: 'Track Performance',
      description: 'Monitor how customers interact with your experience',
      icon: BarChart,
      details: [
        'View scan analytics',
        'Track tutorial completion rates',
        'Read customer feedback',
        'Optimize based on data'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/docs"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help Center
              </Link>
            </div>
            <Link
              href="/dashboard/experience/create"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Create Experience
            </Link>
          </div>
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">Create Your First Experience</h1>
            <p className="mt-2 text-gray-600">
              Follow this step-by-step guide to create your first interactive product experience
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Cxperia!</h2>
          <p className="text-gray-700 mb-4">
            Creating your first experience is easy and takes just a few minutes. This guide will walk you through 
            the entire process, from setting up your brand to generating your first QR code.
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Estimated time: 15-20 minutes
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {/* Step Number */}
                <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 bg-pink-600 text-white rounded-full font-bold text-lg z-10">
                  {step.number}
                </div>
                
                {/* Step Content */}
                <div className="ml-16 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-pink-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start text-sm text-gray-700">
                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-pink-600 rounded-full mt-2 mr-3"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/docs/qr-codes"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900 mb-2">QR Code Best Practices</h4>
              <p className="text-sm text-gray-600">Learn how to optimize your QR codes for maximum scanning success</p>
            </Link>
            <Link
              href="/docs/tutorial-creation"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900 mb-2">Create Amazing Tutorials</h4>
              <p className="text-sm text-gray-600">Build step-by-step tutorials that engage your customers</p>
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need help? Our support team is here for you!</p>
          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
