'use client'
import React, {  useMemo } from "react"
import CurvedBottomNav from "@/components/public/CurvedBottomNav"
import SectionHeader from "@/components/public/ThemeAwareSectionHeader"
import { usePublicExpStore } from "@/store/public/usePublicExpStore"
import PublicLoading from '../components/PublicLoading';

// Map backend type to icon, link formatter, and description
const SUPPORT_TYPE_MAP: Record<string, { icon: string; getLink: (v: string) => string; description: string }> = {
  whatsapp: {
    icon: "/icons/whatsapp.svg",
    getLink: (v) => `https://wa.me/${v.replace(/[^\d]/g, "")}`,
    description: "Chat with us on WhatsApp",
  },
  email: {
    icon: "/icons/email.png",
    getLink: (v) => `mailto:${v}`,
    description: "Send us an email",
  },
  phone: {
    icon: "/icons/phone.png",
    getLink: (v) => `tel:${v}`,
    description: "Give us a call",
  },
  faq: {
    icon: "/icons/faq.png",
    getLink: (v) => v,
    description: "Find answers instantly",
  },
  instagram: {
    icon: "/icons/instagram.png",
    getLink: (v) => v,
    description: "Follow us for updates",
  },
  facebook: {
    icon: "/icons/facebook.svg",
    getLink: (v) => v,
    description: "Connect on Facebook",
  },
  twitter: {
    icon: "/icons/twitter.png",
    getLink: (v) => v,
    description: "Stay connected on X",
  },
  // Add more as needed
}

const CustomerSupportPage: React.FC = () => {
  const { color, isLoading } = usePublicExpStore();
  const customer_support_links_simple = usePublicExpStore((state) => state.customer_support_links_simple)
  // Get support links from backend, fallback to empty array
  type SupportLink = { type: string; value: string }
  type SupportOption = { type: string; icon: string; link: string; description: string }
  const supportLinks: SupportLink[] = customer_support_links_simple || []
  // Map backend links to UI options (type, icon, link, description)
  const supportOptions: SupportOption[] = useMemo(() => {
    return supportLinks
      .map((item: SupportLink) => {
        const map = SUPPORT_TYPE_MAP[item.type?.toLowerCase()]
        if (!map) return null
        return {
          type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
          icon: map.icon,
          link: map.getLink(item.value),
          description: map.description,
        }
      })
      .filter(Boolean) as SupportOption[]
  }, [supportLinks])

  if (isLoading) {
    return <PublicLoading />;
  }

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 font-sans" style={{ backgroundColor: color }}>
      <div className="w-full max-w-xl bg-gray-50">
        <SectionHeader title="We’re Here to Help" subtitle="Choose your preferred way to connect" />

        <main className="mt-2 space-y-4 rounded-tl-3xl bg-gray-50">
          {supportOptions.length === 0 && (
            <div className="py-8 text-center text-gray-500">No support options available.</div>
          )}
          {supportOptions.map((option) => (
            <a
              key={option.type}
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto flex max-w-xs border  items-center gap-4 rounded-2xl bg-gray-200 p-4 text-center shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:max-w-md md:max-w-lg"
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
      <CurvedBottomNav />
    </div>
  )
}

export default CustomerSupportPage
