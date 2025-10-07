import Link from 'next/link';
import { Sparkles, QrCode, BookOpen, BarChart, Users, Palette, HelpCircle, Star } from 'lucide-react';

export default function DocsHomePage() {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Set up your brand and create your first experience',
      icon: Sparkles,
      links: [
        { title: 'Brand Setup', href: '/docs/brand-setup' },
        { title: 'First Experience', href: '/docs/first-experience' },
        { title: 'Account Settings', href: '/docs/account-settings' },
      ],
    },
    {
      title: 'Creating Experiences',
      description: 'Build interactive product experiences for your customers',
      icon: QrCode,
      links: [
        { title: 'Experience Builder', href: '/docs/experience-builder' },
        { title: 'QR Code Generation', href: '/docs/qr-codes' },
        { title: 'Brand Customization', href: '/docs/brand-customization' },
      ],
    },
    {
      title: 'Tutorials & Content',
      description: 'Create step-by-step tutorials and beauty routines',
      icon: BookOpen,
      links: [
        { title: 'Tutorial Creation', href: '/docs/tutorial-creation' },
        { title: 'Content Management', href: '/docs/content-management' },
        { title: 'Publishing Workflow', href: '/docs/publishing' },
      ],
    },
    {
      title: 'Analytics & Insights',
      description: 'Track performance and understand customer engagement',
      icon: BarChart,
      links: [
        { title: 'Dashboard Overview', href: '/docs/analytics-dashboard' },
        { title: 'Scan Analytics', href: '/docs/scan-analytics' },
        { title: 'Customer Feedback', href: '/docs/customer-feedback' },
      ],
    },
    {
      title: 'Team Management',
      description: 'Collaborate with your team and manage permissions',
      icon: Users,
      links: [
        { title: 'Adding Team Members', href: '/docs/team-management' },
        { title: 'Role Permissions', href: '/docs/permissions' },
        { title: 'Collaboration Tools', href: '/docs/collaboration' },
      ],
    },
    {
      title: 'Brand Customization',
      description: 'Customize colors, themes, and brand appearance',
      icon: Palette,
      links: [
        { title: 'Brand Colors', href: '/docs/brand-colors' },
        { title: 'Logo & Assets', href: '/docs/brand-assets' },
        { title: 'Theme Settings', href: '/docs/theme-settings' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cxperia Help Center</h1>
              <p className="mt-2 text-gray-600">
                Everything you need to create amazing digital experiences for your beauty brand
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to App
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                      >
                        {link.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Getting Started?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you create amazing digital experiences for your beauty brand. 
              Get personalized assistance with setup, customization, and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                Contact Support
              </Link>
              <Link
                href="/docs/first-experience"
                className="px-6 py-3 bg-white text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors font-medium"
              >
                Start Your First Experience
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/docs/first-experience"
            className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
          >
            <h3 className="font-semibold text-pink-900">Create Your First Experience</h3>
            <p className="text-sm text-pink-700 mt-1">Step-by-step guide to get started</p>
          </Link>
          <Link
            href="/docs/qr-codes"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-semibold text-blue-900">QR Code Generation</h3>
            <p className="text-sm text-blue-700 mt-1">Generate and customize QR codes</p>
          </Link>
          <Link
            href="/docs/tutorial-creation"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <h3 className="font-semibold text-purple-900">Tutorial Creation</h3>
            <p className="text-sm text-purple-700 mt-1">Build step-by-step beauty tutorials</p>
          </Link>
          <Link
            href="/docs/analytics-dashboard"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <h3 className="font-semibold text-green-900">Analytics Dashboard</h3>
            <p className="text-sm text-green-700 mt-1">Track customer engagement</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Cxperia. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
              Help Center
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

