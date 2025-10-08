'use client';

import React from 'react';
import { LogOut, X } from 'lucide-react';
import { Button } from './button';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 animate-in fade-in-0"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-none tracking-tight">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mt-1">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
