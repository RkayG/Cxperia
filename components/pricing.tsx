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
      buttonHref: "/signup",
      isPopular: false
    },
    {
      title: "Pro",
      price: "$29",
      description: "For growing teams and brands",
      features: [
        "Up to 5 users",
        "Unlimited experiences",
        "Advanced analytics",
        "Priority email support",
        "Custom branding"
      ],
      buttonText: "Upgrade to Pro",
      buttonHref: "/signup",
      isPopular: true
    },
    {
      title: "Business",
      price: "$99",
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
    <div className="flex flex-wrap justify-center gap-8">
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

export function PricingGrid(props: {
  title: string;
  subtitle: string;
  items: PricingCardProps[];
}) {
  return (
    <section
      id="features"
      className="container space-y-6 py-8 md:py-12 lg:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">{props.title}</h2>
        <p className="max-w-[85%] text-muted-foreground sm:text-lg">
          {props.subtitle}
        </p>
      </div>

      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
        {props.items.map((item, index) => (
          <PricingCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
