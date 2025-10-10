'use client';

import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';

interface ResendActivationButtonProps {
  brandId: string;
  brandName: string;
}

export default function ResendActivationButton({ brandId, brandName }: ResendActivationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResendActivation = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/resend-activation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend activation email');
      }

      setMessage('Activation email sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend activation email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end space-y-2">
      <button
        onClick={handleResendActivation}
        disabled={isLoading}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        })}
      >
        {isLoading ? 'Sending...' : 'Resend Activation Email'}
      </button>
      
      {message && (
        <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
