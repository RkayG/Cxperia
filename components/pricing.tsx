import { Check } from "lucide-react";
import React from "react";
import {  buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function PricingCard() {
  // Static tier data
 const tiers = [
    {
      title: "Starter",
      price: "Free",
      description: "Perfect for emerging beauty brands",
      features: [
        "1 brand admin",
        "3 product experiences",
        "Basic QR code generation",
        'Basic Analytics',
        "Email support",
        'Customer Feedbacks'
      ],
      buttonText: "Start Creating",
      buttonHref: "/auth/signup",
      isPopular: false
    },
    {
      title: "Pro",
      price: "€",
      description: "For growing beauty brands",
      features: [
        'Everything in Starter, plus',
        "Up to 5 team members",
        "Unlimited product experiences",
        "Customised QR code generation",
        "Advanced QR analytics",
        "Custom branding",
        "Priority email support",
        "Skin type Recommendations",
        "Product usage tracking"
      ],
      buttonText: "Upgrade to Pro",
      buttonHref: "/auth/signup",
      isPopular: true
    },
    {
      title: "Enterprise",
      price: "€",
      description: "For established beauty companies",
      features: [
        'Everything in Pro, plus',
        "Unlimited team members",
        "Unlimited experiences + products",
        "Customised QR code generation",
        "Advanced customer insights",
        "Dedicated account manager",
        "White-label solutions",
        "Custom domain support",
        "Multi-language support",
        "SLA guarantee"
      ],
      buttonText: "Contact Sales",
      buttonHref: "/contact",
      isPopular: false
    }
  ];

  return (
    <div className="flex flex-wrap bg-[#e9c0e9] to-[#191970] justify-center  p-8 md:p-16 lg:p-24 gap-8">
      {tiers.map((tier, idx) => (
        <Card
          key={tier.title}
          className={`w-full max-w-sm bg-[#4d2d7c] text-white ${tier.isPopular ? "border-white border-2 shadow-lg" : ""}`}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{tier.title}</CardTitle>
            <CardDescription className="text-white">{tier.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className="text-white">/month</span>
            </div>
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-white" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link
              href={tier.buttonHref}
              className={buttonVariants({
                variant: tier.isPopular ? "default" : "outline",
              })}
            >
              {tier.buttonText}
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
