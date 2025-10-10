'use client';
import { useState } from 'react';
import InputField from '@/components/input-field';
import { SignupData } from '../page';

interface ConfirmPasswordStepProps {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function ConfirmPasswordStep({ data, updateData, nextStep, prevStep }: ConfirmPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength logic
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(data.password);
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  if (strength >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-green-500';
  } else if (strength >= 2) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-orange-400';
  }

  const canProceed =
    data.password &&
    data.confirmPassword &&
    strength >= 4 &&
    data.password === data.confirmPassword;

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-center text-2xl bricolage-grotesque-light font-bold text-gray-900">
            Set your password
          </h1>
        </div>
        <div className="space-y-6">
          <InputField
            id="password"
            type="password"
            label="Password *"
            placeholder="Enter your password"
            value={data.password}
            onChange={(value) => updateData({ password: value })}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
          />
          {/* Password strength bar */}
          {data.password && (
            <div className="w-full mb-2">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
              <div className={`text-xs mt-1 font-semibold ${strengthColor.replace('bg-', 'text-')}`}>{strengthLabel} password</div>
            </div>
          )}
          <InputField
            id="confirmPassword"
            type="password"
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={data.confirmPassword}
            onChange={(value) => updateData({ confirmPassword: value })}
            showPasswordToggle={true}
            onTogglePassword={() => setShowConfirm(!showConfirm)}
            showPassword={showConfirm}
          />
          {data.password && data.confirmPassword && (
            <div className={`text-sm mt-1 ${canProceed ? 'text-green-600' : 'text-red-600'}`}>
              {canProceed
                ? '✓ Passwords match and are strong'
                : data.password !== data.confirmPassword
                ? 'Passwords do not match'
                : 'Password must be at least 8 characters, uppercase, lowercase, number, special character'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}