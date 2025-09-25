"use client";

import { useState } from "react";
import BrandInfoStep from "./steps/BrandInfoStep";
import AccountInfoStep from "./steps/AccountInfoStep";
import ProcessingStep from "./steps/ProcessingStep";
import SuccessStep from "./steps/SuccessStep";
import Stepper, { Step } from "@/components/Stepper.jsx";
import ConfirmPasswordStep from "./steps/ConfirmPasswordStep";
export interface SignupData {
  brandName: string;
  brandSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessAddress?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  contactInfo?: string;
}
import MoreBrandInfoStep from "./steps/MoreBrandInfoStep";

export default function SignupPage() {
  const [signupData, setSignupData] = useState<SignupData>({
    brandName: "",
    brandSlug: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateSignupData = (updates: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...updates }));
  };

  // Step validation logic
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        // BrandInfoStep: require brandName and brandSlug (website URL)
        return (signupData.brandName.trim().length > 0 &&
        signupData.brandSlug.trim().length > 0 && /^https?:\/\/.+\..+/.test(signupData.brandSlug.trim()));
      case 2:
        // AccountInfoStep: require firstName, lastName, email
        return (signupData.firstName.trim().length > 0 &&
        signupData.lastName.trim().length > 0 &&
        signupData.email.trim().length > 0 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signupData.email.trim()));
      case 3:
        // ConfirmPasswordStep: require strong password and match
        const password = signupData.password;
        const confirm = signupData.confirmPassword;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return (
          password.length >= 8 &&
          score >= 4 &&
          password === confirm
        );
      default:
        return true;
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#e9c0e9]">
      {/* Left: Engaging Text */}
      <div className="relative hidden lg:flex items-center justify-center bg-[#e9c0e9]">
        <div className="text-center w-full px-8">
          <h1 className="font-black text-4xl bricolage-grotesque-light md:text-4xl lg:text-4xl text-[#502274] leading-tight">
            One step closer to turning your product into a digital journey.
          </h1>
        </div>
      </div>
      {/* Right: Stepper */}
      <div className="flex flex-col max-h-screen bg-white gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Stepper
              initialStep={1}
              renderStepIndicator={undefined}
              validateStep={() => validateStep(currentStep)}
            >
              {/* <Step>
                <WelcomeStep
                  data={signupData}
                  updateData={updateSignupData}
                  nextStep={() => {}}
                />
              </Step> */}
              <Step>
                <BrandInfoStep
                  data={signupData}
                  updateData={updateSignupData}
                  nextStep={() => {}}
                  prevStep={() => {}}
                />
              </Step>
              <Step>
                <MoreBrandInfoStep
                  data={signupData}
                  updateData={updateSignupData}
                  nextStep={() => {}}
                  prevStep={() => {}}
                />
              </Step>
              <Step>
                <AccountInfoStep
                  data={signupData}
                  updateData={updateSignupData}
                  nextStep={() => {}}
                  prevStep={() => {}}
                />
              </Step>
              <Step>
                <ConfirmPasswordStep
                  data={signupData}
                  updateData={updateSignupData}
                  nextStep={() => {}}
                  prevStep={() => {}}
                />
              </Step>
              <Step>
                <ProcessingStep
                  data={signupData}
                  nextStep={() => {}}
                />
              </Step>
              <Step>
                <SuccessStep
                  data={signupData}
                />
              </Step>
            </Stepper>
          </div>
        </div>
      </div>
    </div>
  );
}