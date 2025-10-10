import Link from 'next/link';
import { ArrowLeft, QrCode, Download, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

export default function QRCodesPage() {
  const bestPractices = [
    {
      title: 'Size Matters',
      description: 'Make sure your QR code is large enough to scan easily',
      icon: CheckCircle,
      details: [
        'Minimum size: 2cm x 2cm (0.8" x 0.8")',
        'Recommended size: 3cm x 3cm (1.2" x 1.2")',
        'Larger is better for scanning from a distance'
      ]
    },
    {
      title: 'High Contrast',
      description: 'Ensure good contrast between the QR code and background',
      icon: CheckCircle,
      details: [
        'Use dark QR codes on light backgrounds',
        'Avoid busy or patterned backgrounds',
        'Test scanning in different lighting conditions'
      ]
    },
    {
      title: 'Clear Space',
      description: 'Leave enough white space around your QR code',
      icon: CheckCircle,
      details: [
        'Minimum clear space: QR code width',
        'Avoid placing text or graphics too close',
        'Keep the QR code unobstructed'
      ]
    },
    {
      title: 'Test Before Printing',
      description: 'Always test your QR code before mass production',
      icon: AlertCircle,
      details: [
        'Test with different phones and QR scanners',
        'Try scanning from various distances',
        'Test in different lighting conditions'
      ]
    }
  ];

  const placementIdeas = [
    {
      title: 'Product Packaging',
      description: 'Place QR codes on product boxes, bottles, or containers',
      icon: '📦',
      tips: [
        'Front of packaging for easy visibility',
        'Side panels for additional space',
        'Back of packaging for detailed information'
      ]
    },
    {
      title: 'Marketing Materials',
      description: 'Include QR codes in brochures, flyers, and advertisements',
      icon: '📄',
      tips: [
        'Business cards for quick access',
        'Posters and banners for events',
        'Email signatures for digital sharing'
      ]
    },
    {
      title: 'Point of Sale',
      description: 'Display QR codes at retail locations and counters',
      icon: '🏪',
      tips: [
        'Counter displays for customer engagement',
        'Shelf talkers for product information',
        'Receipts for post-purchase experience'
      ]
    },
    {
      title: 'Digital Channels',
      description: 'Share QR codes through digital marketing channels',
      icon: '📱',
      tips: [
        'Social media posts and stories',
        'Website banners and sidebars',
        'Email newsletters and campaigns'
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
              Generate QR Code
            </Link>
          </div>
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">QR Code Best Practices</h1>
            <p className="mt-2 text-gray-600">
              Learn how to create and use QR codes effectively for your beauty brand
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">QR Code Essentials</h2>
              <p className="text-gray-700 mb-4">
                QR codes are the gateway to your digital experiences. Follow these best practices to ensure 
                your customers can easily scan and access your content.
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <Smartphone className="w-4 h-4 mr-2" />
                Compatible with all modern smartphones
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        practice.icon === CheckCircle ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          practice.icon === CheckCircle ? 'text-green-600' : 'text-yellow-600'
                        }`} />
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
                        {practice.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start text-sm text-gray-700">
                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3"></span>
                            {detail}
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

        {/* Placement Ideas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Where to Place Your QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placementIdeas.map((idea, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{idea.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {idea.description}
                    </p>
                    <ul className="space-y-2">
                      {idea.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start text-sm text-gray-700">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-pink-600 rounded-full mt-2 mr-3"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Download Formats</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Download className="w-6 h-6 text-gray-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PNG Format</h3>
                  <p className="text-gray-600 mb-3">
                    Perfect for digital use, web, and high-quality printing
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• High resolution (300 DPI)</li>
                    <li>• Transparent background</li>
                    <li>• Scalable without quality loss</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <Download className="w-6 h-6 text-gray-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Format</h3>
                  <p className="text-gray-600 mb-3">
                    Ideal for professional printing and sharing
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Print-ready format</li>
                    <li>• Multiple sizes included</li>
                    <li>• Easy to share via email</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">QR Code Not Scanning?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Common Issues:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• QR code is too small</li>
                    <li>• Poor contrast with background</li>
                    <li>• Damaged or wrinkled surface</li>
                    <li>• Insufficient lighting</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Solutions:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Increase QR code size</li>
                    <li>• Improve contrast</li>
                    <li>• Use flat, smooth surfaces</li>
                    <li>• Ensure good lighting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Create Your QR Code?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard/experience/create"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium text-center"
            >
              Create Your First Experience
            </Link>
            <Link
              href="/docs/tutorial-creation"
              className="px-6 py-3 bg-white text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors font-medium text-center"
            >
              Learn About Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
