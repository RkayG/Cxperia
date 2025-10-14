// app/get-demo/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Footer } from '@/components/footer';
import InputField from '@/components/input-field';
import { buttonVariants } from "@/components/ui/button";
import logo from '../../assets/logo.png';

export default function GetDemoPage() {
  const [formData, setFormData] = useState({
    brandName: '',
    contactName: '',
    email: '',
    phone: '',
    brandSize: '',
    monthlyProducts: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Send to your CRM/sales system
    await fetch('/api/contact-sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Merci!</h1>
          <p className="text-gray-600 mb-6">
            Notre équipe de ventes vous contactera bientôt pour planifier votre démo personnalisée.
          </p>

        </div>
      </div>
    );
  }

  return (
    <>
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#e9c0e9]">
      {/* Left: Benefits Section */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-[#e9c0e9] p-10">
        <div className="text-left w-full max-w-md text-[#502274]">
          <h1 className="font-black text-4xl bricolage-grotesque leading-tight mb-6">Planifier votre démo</h1>
            <p className="mb-4 bricolage-grotesque-light">Un pas de plus vers la transformation de vos produits en parcours numériques.</p>
        </div>
      </div>

      {/* Right: Form Section */}
      <div className="flex flex-col bg-white gap-4 p-6 md:p-10">
         <Link href="/" legacyBehavior>
            <Image src={logo} alt="Cxperia Logo" className="h-16  w-36 flex justify-self-center mx-auto " />
        </Link>
        <div className="flex flex-1 items-center justify-center">
         
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  id="brandName"
                  type="text"
                  label="Nom de la marque *"
                  placeholder="Votre marque de beauté"
                  value={formData.brandName}
                  onChange={(val) => handleChange('brandName', val)}
                />
                <InputField
                  id="contactName"
                  type="text"
                  label="Votre nom *"
                  placeholder="Votre nom complet"
                  value={formData.contactName}
                  onChange={(val) => handleChange('contactName', val)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  id="email"
                  type="email"
                  label="Email professionnel *"
                  placeholder="vous@marque.com"
                  value={formData.email}
                  onChange={(val) => handleChange('email', val)}
                />
                <InputField
                  id="phone"
                  type="tel"
                  label="Numéro de téléphone"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.phone}
                  onChange={(val) => handleChange('phone', val)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block bricolage-grotesque-light text-sm font-medium text-gray-700 mb-2">
                    Taille de la marque
                  </label>
                  <select
                    value={formData.brandSize}
                    onChange={(e) => handleChange('brandSize', e.target.value)}
                    className="w-full bricolage-grotesque-light px-4 py-3 bg-gray-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="startup">Startup (1-10 employés)</option>
                    <option value="small">Petite entreprise (11-50 employés)</option>
                    <option value="medium">Entreprise moyenne (51-200 employés)</option>
                    <option value="enterprise">Entreprise (200+ employés)</option>
                  </select>
                </div>

                <div>
                  <label className="block bricolage-grotesque-light text-sm font-medium text-gray-700 mb-2">
                      Produits mensuels expédiés
                  </label>
                  <select
                    value={formData.monthlyProducts}
                    onChange={(e) => handleChange('monthlyProducts', e.target.value)}
                    className="w-full bricolage-grotesque-light px-4 py-3 bg-gray-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="1-500">1-500 unités</option>
                    <option value="501-5000">501-5,000 unités</option>
                    <option value="5001-50000">5,001-50,000 unités</option>
                    <option value="50000+">50,000+ unités</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block bricolage-grotesque-light text-sm font-medium text-gray-700 mb-2">
                 Message additionnel
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full bricolage-grotesque-light px-4 py-3 bg-gray-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={buttonVariants({
                  size: "lg",
                  className: "w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
                })}
              >
                {isSubmitting ? 'Planification...' : 'Planifier la démo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
      {/* <Footer /> */}

    </>
  );
}