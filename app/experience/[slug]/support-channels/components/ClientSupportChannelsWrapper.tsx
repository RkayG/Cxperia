'use client';

import React, { useMemo } from "react";
import SectionHeader from "@/app/experience/[slug]/components/ThemeAwareSectionHeader";

// Map backend type to icon, link formatter, and description
const SUPPORT_TYPE_MAP: Record<string, { icon: string; getLink: (v: string) => string; description: string }> = {
  whatsapp: {
    icon: "/icons/whatsapp.svg",
    getLink: (v) => `https://wa.me/${v.replace(/[^\d]/g, "")}`,
    description: "Chattez avec nous sur WhatsApp",
  },
  email: {
    icon: "/icons/email.png",
    getLink: (v) => `mailto:${v}`,
    description: "Envoyez-nous un email",
  },
  phone: {
    icon: "/icons/phone.png",
    getLink: (v) => `tel:${v}`,
    description: "Appelez-nous",
  },
  faq: {
    icon: "/icons/faq.png",
    getLink: (v) => v,
    description: "Trouvez des réponses instantanément",
  },
  instagram: {
    icon: "/icons/instagram.png",
    getLink: (v) => v,
    description: "Suivez-nous pour les mises à jour",
  },
  facebook: {
    icon: "/icons/facebook.svg",
    getLink: (v) => v,
    description: "Connectez-vous sur Facebook",
  },
  twitter: {
    icon: "/icons/twitter.png",
    getLink: (v) => v,
    description: "Restez connecté sur X",
  },
  // Add more as needed
};

interface ClientSupportChannelsWrapperProps {
  slug: string;
  color: string;
  customer_support_links_simple: any[];
}

const ClientSupportChannelsWrapper: React.FC<ClientSupportChannelsWrapperProps> = ({
  slug,
  color,
  customer_support_links_simple,
}) => {
  // Get support links from backend, fallback to empty array
  type SupportLink = { type: string; value: string };
  type SupportOption = { type: string; icon: string; link: string; description: string };
  const supportLinks: SupportLink[] = customer_support_links_simple || [];
  
  // Map backend links to UI options (type, icon, link, description)
  const supportOptions: SupportOption[] = useMemo(() => {
    return supportLinks
      .map((item: SupportLink) => {
        const map = SUPPORT_TYPE_MAP[item.type?.toLowerCase()];
        if (!map) return null;
        return {
          type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
          icon: map.icon,
          link: map.getLink(item.value),
          description: map.description,
        };
      })
      .filter(Boolean) as SupportOption[];
  }, [supportLinks]);

  return (
    <div className="flex min-h-screen  justify-center bg-gray-50 font-sans" style={{ backgroundColor: color }}>
      <div className="w-full max-w-xl mb-32  bg-gray-50">
        <SectionHeader title="Nous sommes ici pour vous aider" subtitle="Choisissez votre façon de nous contacter" />

        <main className="mt-2 space-y-4 rounded-tl-3xl bg-gray-50">
          {supportOptions.length === 0 && (
            <div className="py-8 text-center text-gray-500">Aucune option de support disponible.</div>
          )}
          {supportOptions.map((option) => (
            <a
              key={option.type}
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto flex max-w-xs border items-center gap-4 rounded-2xl bg-gray-200 p-4 text-center shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:max-w-md md:max-w-lg"
              style={{ borderBottom: `4px solid ${color}` }}
            >
              <img src={option.icon} alt={option.type} className="h-10 w-10 object-contain" />
              <div>
                <div className="text-left font-semibold text-gray-800">{option.type}</div>
                <div className="text-center text-sm text-gray-800">{option.description}</div>
              </div>
            </a>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ClientSupportChannelsWrapper;
