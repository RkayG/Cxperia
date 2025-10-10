import Link from 'next/link';
import { ArrowLeft, BookOpen, Edit3, Play, Upload, Users, Calendar, Clock, Plus, Minus, Save, Eye, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

export default function TutorialCreationPage() {
  const tutorialSteps = [
    {
      number: 1,
      title: 'Tutorial Overview',
      description: 'Set up basic information about your tutorial',
      icon: BookOpen,
      details: [
        'Enter tutorial title and description',
        'Select category (Skincare, Makeup, Haircare, etc.)',
        'Set total duration',
        'Upload featured image',
        'Add video URL (optional)',
        'Select suitable skin types',
        'Choose perfect occasions'
      ]
    },
    {
      number: 2,
      title: 'Create Steps',
      description: 'Build step-by-step instructions for your tutorial',
      icon: Play,
      details: [
        'Add step title and description',
        'Set duration for each step',
        'Include detailed instructions',
        'Add pro tips for each step',
        'Upload step images (optional)',
        'Add products used in each step'
      ]
    },
    {
      number: 3,
      title: 'Preview & Publish',
      description: 'Review your tutorial and make it live',
      icon: Eye,
      details: [
        'Preview how your tutorial will look',
        'Check all steps and content',
        'Publish your tutorial',
        'Enable tutorials feature in experiences'
      ]
    }
  ];

  const categories = [
    'Skincare', 'Makeup', 'Haircare', 'Evening Look', 'Day Look',
    'Special Occasion', 'Anti-Aging', 'Acne Care', 'Hydration',
    'Cleansing', 'Brightening', 'Contouring', 'Fragrance'
  ];

  const skinTypes = [
    'Normal', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Mature'
  ];

  const occasions = [
    'Daily', 'Work', 'Evening', 'Party', 'Wedding', 'Date Night',
    'Travel', 'Summer', 'Winter', 'Special Event'
  ];

  const bestPractices = [
    {
      title: 'Clear Step Instructions',
      description: 'Write detailed, easy-to-follow instructions for each step',
      icon: CheckCircle,
      tips: [
        'Use simple, clear language',
        'Include specific techniques',
        'Mention timing and pressure',
        'Add safety warnings when needed'
      ]
    },
    {
      title: 'High-Quality Visuals',
      description: 'Use clear, well-lit images and videos',
      icon: CheckCircle,
      tips: [
        'Use good lighting for photos',
        'Show before and after results',
        'Include close-up shots of techniques',
        'Keep videos under 2 minutes per step'
      ]
    },
    {
      title: 'Helpful Pro Tips',
      description: 'Add expert tips to help users succeed',
      icon: Lightbulb,
      tips: [
        'Share professional techniques',
        'Include troubleshooting advice',
        'Suggest alternative methods',
        'Add product application tips'
      ]
    },
    {
      title: 'Product Information',
      description: 'Include detailed product information',
      icon: AlertCircle,
      tips: [
        'Specify exact product names',
        'Include shade/color information',
        'Mention where to purchase',
        'Add amount recommendations'
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
              href="/dashboard/content/tutorial"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Create Tutorial
            </Link>
          </div>
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">Tutorial Creation Guide</h1>
            <p className="mt-2 text-gray-600">
              Learn how to create engaging step-by-step tutorials and beauty routines for your customers
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Create Amazing Tutorials</h2>
              <p className="text-gray-700 mb-4">
                Tutorials help your customers get the most out of your products. Create step-by-step guides 
                that showcase your products and build customer confidence.
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Average creation time: 30-45 minutes
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Creation Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Create a Tutorial</h2>
          <div className="space-y-8">
            {tutorialSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {/* Step Number */}
                  <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full font-bold text-lg z-10">
                    {step.number}
                  </div>
                  
                  {/* Step Content */}
                  <div className="ml-16 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-purple-600" />
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
                              <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-3"></span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < tutorialSteps.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tutorial Form Fields */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tutorial Form Fields</h2>
          
          {/* Overview Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Edit3 className="w-5 h-5 mr-2 text-purple-600" />
              Overview Section
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tutorial Title *</h4>
                <p className="text-sm text-gray-600 mb-2">Choose a descriptive title that clearly explains what your tutorial covers.</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">Example: "Ultimate Skincare Routine for Glowing Skin"</code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 mb-2">Provide a brief overview of what customers will learn.</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">Example: "Learn the perfect 5-step skincare routine using our premium products for radiant, healthy skin."</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                <p className="text-sm text-gray-600 mb-2">Select the most appropriate category for your tutorial.</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <span key={category} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    +{categories.length - 6} more
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Total Duration</h4>
                <p className="text-sm text-gray-600 mb-2">Estimate how long the entire tutorial takes to complete.</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">Example: "15 minutes", "30 minutes", "1 hour"</code>
                </div>
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Play className="w-5 h-5 mr-2 text-purple-600" />
              Steps Section
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Step Title</h4>
                <p className="text-sm text-gray-600 mb-2">Give each step a clear, action-oriented title.</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">Example: "Apply cleanser with gentle circular motions"</code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Step Description</h4>
                <p className="text-sm text-gray-600 mb-2">Provide detailed instructions for each step.</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">Example: "Start with a small amount of cleanser. Wet your face with lukewarm water, then massage the cleanser in gentle circular motions for 30 seconds. Rinse thoroughly with water."</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                <p className="text-sm text-gray-600 mb-2">Specify how long each step should take.</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">Example: "2 minutes", "30 seconds", "5 minutes"</code>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pro Tips</h4>
                <p className="text-sm text-gray-600 mb-2">Add helpful tips and tricks for each step.</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm text-gray-700">Example: "Use lukewarm water - too hot can strip natural oils, too cold won't effectively remove dirt."</code>
                </div>
              </div>
            </div>
          </div>

          {/* Targeting Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Targeting & Categorization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Skin Types</h4>
                <p className="text-sm text-gray-600 mb-3">Select which skin types this tutorial is suitable for.</p>
                <div className="flex flex-wrap gap-2">
                  {skinTypes.map((type) => (
                    <span key={type} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Occasions</h4>
                <p className="text-sm text-gray-600 mb-3">Choose when this tutorial is perfect to use.</p>
                <div className="flex flex-wrap gap-2">
                  {occasions.slice(0, 6).map((occasion) => (
                    <span key={occasion} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {occasion}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    +{occasions.length - 6} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {practice.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {practice.description}
                      </p>
                      <ul className="space-y-2">
                        {practice.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start text-sm text-gray-700">
                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Mistakes to Avoid</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Vague Instructions</h4>
                  <p className="text-sm text-red-700">Avoid generic instructions like "apply product" - be specific about technique, amount, and timing.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Poor Image Quality</h4>
                  <p className="text-sm text-red-700">Use clear, well-lit photos that show the technique or result clearly.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Missing Product Information</h4>
                  <p className="text-sm text-red-700">Always include specific product names, shades, and where to purchase them.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Too Many Steps</h4>
                  <p className="text-sm text-red-700">Keep tutorials focused - 3-7 steps work best for most beauty routines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Create Your Tutorial?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard/content/tutorial"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium text-center"
            >
              Start Creating Tutorial
            </Link>
            <Link
              href="/docs/qr-codes"
              className="px-6 py-3 bg-white text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors font-medium text-center"
            >
              Learn About QR Codes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
