// app/admin/brands/new/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import InputField from '@/components/input-field';
import { showToast } from '@/lib/toast';

export default function NewBrandPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    first_name: '',
    last_name: '',
    contact_phone: '',
    plan_tier: 'enterprise',
    monthly_volume: '',
    contract_value: '',
    sales_rep: '',
    notes: ''
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        sales_rep: 'Current Sales Rep'
      })
    });

    if (response.ok) {
      const result = await response.json();

      showToast.success(`Brand created successfully! Invitation sent to ${formData.contact_email}`);
      router.push(`/admin/brands/${result.brandId}`);
    } else {
      let errorMsg = 'Failed to create brand';
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData === 'object') {
          const err = errorData as any;
          if (err.code === '23505' && err.message?.includes('brands_email_unique')) {
            errorMsg = 'A brand with this contact email already exists.';
          } else if (err.code === '23505' && err.message?.includes('brands_brand_slug_key')) {
            errorMsg = 'A brand with this brand name already exists.';
          } else if (typeof err.error === 'string') {
            errorMsg = 'Error creating brand. Please try again.';
          }
        }
      } catch {}
      showToast.error(String(errorMsg));
    }
  } catch (error) {
    console.error('Error creating brand:', error);
    showToast.error('Error creating brand. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      <Toaster />
    
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Onboard New Brand</h1>
        <p className="text-gray-600 mt-2">Create a new brand account after contract signing</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          {/* Brand Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <InputField
                  id='brand_name'
                  type="text" 
                  required
                  value={formData.name}
                  label='Brand Name *'

                  onChange={(val) => setFormData({...formData, name: val})}
                  placeholder=""

                />
              </div>

              <div> 
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Tier *
                </label>
                <select
                  value={formData.plan_tier}
                  onChange={(e) => setFormData({...formData, plan_tier: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <InputField
                  id="first_name"
                  type="text"
                  label="First Name *"
                  placeholder=""
                  value={formData.first_name}
                  onChange={(val) => setFormData({ ...formData, first_name: val })}
                  required
                />
              </div>
              <div>
                <InputField
                  id="last_name"
                  type="text"
                  label="Last Name *"
                  placeholder=""
                  value={formData.last_name}
                  onChange={(val) => setFormData({ ...formData, last_name: val })}
                  required
                />
              </div>
              <div>
                <InputField
                  id="contact_email"
                  type="email"
                  label="Contact Email *"
                  placeholder=""
                  value={formData.contact_email}
                  onChange={(val) => setFormData({ ...formData, contact_email: val })}
                  required
                />
              </div>
              <div>
                <InputField
                  id="contact_phone"
                  type="tel"
                  label=""
                  placeholder="+33"
                  value={formData.contact_phone}
                  onChange={(val) => setFormData({ ...formData, contact_phone: val })}
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Monthly Volume
                </label>
                <select
                  value={formData.monthly_volume}
                  onChange={(e) => setFormData({...formData, monthly_volume: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select volume</option>
                  <option value="1-500">1-500 units</option>
                  <option value="501-5000">501-5,000 units</option>
                  <option value="5001-50000">5,001-50,000 units</option>
                  <option value="50000+">50,000+ units</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Value (€)
                </label>
                <input
                  type="number"
                  value={formData.contract_value}
                  onChange={(e) => setFormData({...formData, contract_value: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes & Special Requirements
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Any special requirements or notes about this brand..."
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Brand...' : 'Create Brand Account'}
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  );
}