import React from "react";
import { Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
      description: "Perfect for individuals starting out",
      features: [
        "1 user",
        "3 experiences",
        "Basic analytics",
        "Email support"
      ],
      buttonText: "Get Started",
      buttonHref: "/auth/signup",
      isPopular: false
    },
    {
      title: "Pro",
      price: "€",
      description: "For growing teams and brands",
      features: [
        "Up to 5 users",
        "Unlimited experiences",
        "Advanced analytics",
        "Priority email support",
        "Custom branding"
      ],
      buttonText: "Upgrade to Pro",
      buttonHref: "/auth/signup",
      isPopular: true
    },
    {
      title: "Business",
      price: "€",
      description: "For established businesses",
      features: [
        "Unlimited users",
        "Unlimited experiences",
        "Full analytics suite",
        "Dedicated support",
        "API access",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonHref: "/contact",
      isPopular: false
    }
  ];

  return (
    <div className="flex flex-wrap bg-gradient-to-b from-[#e9c0e9] to-[#4d2d7c] justify-center  p-8 md:p-16 lg:p-24 gap-8">
      {tiers.map((tier, idx) => (
        <Card
          key={tier.title}
          className={`w-full max-w-sm ${tier.isPopular ? "border-primary border-2 shadow-lg" : ""}`}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{tier.title}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
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
