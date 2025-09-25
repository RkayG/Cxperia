"use client";

import { useState } from "react";
import WelcomeStep from "./steps/WelcomeStep";
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
}

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

  const updateSignupData = (updates: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...updates }));
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
      <div className="flex flex-col bg-white gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Stepper initialStep={1} renderStepIndicator={undefined}>
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