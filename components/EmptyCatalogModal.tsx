import { ArrowRight, Plus, Sparkles, X } from "lucide-react";
import React, { useEffect } from "react";

interface EmptyCatalogModalProps {
  open: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  message: string;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'default' | 'warning' | 'success';
  showCloseButton?: boolean;
}

const EmptyCatalogModal: React.FC<EmptyCatalogModalProps> = ({
  open,
  onClose,
  icon,
  message,
  title = "Nothing here yet",
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'default',
  showCloseButton = true,
}) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  // Variant color schemes
  const variantStyles = {
    default: {
      iconColor: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
      border: "border-purple-100",
      glow: "bg-purple-100/40"
    },
    warning: {
      iconColor: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700",
      border: "border-amber-100",
      glow: "bg-amber-100/40"
    },
    success: {
      iconColor: "text-emerald-600",
      button: "bg-emerald-600 hover:bg-emerald-700",
      border: "border-emerald-100",
      glow: "bg-emerald-100/40"
    }
  };

  const styles = variantStyles[variant];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with fade animation */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal container with scale animation */}
      <div className="relative transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
        {/* Decorative elements */}
        <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${styles.glow} blur-xl opacity-60`}></div>
        <div className={`absolute -bottom-4 -left-4 w-16 h-16 rounded-full ${styles.glow} blur-xl opacity-40`}></div>
        
        <div className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border ${styles.border} overflow-hidden`}>
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 z-10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          {/* Icon with container */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className={`text-5xl ${styles.iconColor} mb-2`}>
                {icon}
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 fill-current animate-pulse" />
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {message}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full">
            {/* Primary action */}
            {actionLabel && (actionHref ? (
              <a
                href={actionHref}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${styles.button}`}
              >
                <span>{actionLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : onAction ? (
              <button
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${styles.button}`}
                onClick={onAction}
              >
                <Plus className="h-4 w-4" />
                <span>{actionLabel}</span>
              </button>
            ) : null)}
            
            {/* Secondary action */}
            {secondaryActionLabel && onSecondaryAction && (
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100"
                onClick={onSecondaryAction}
              >
                <span>{secondaryActionLabel}</span>
              </button>
            )}
          </div>
          
          {/* Close text button */}
          {showCloseButton && (
            <button
              className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4 pt-3 border-t border-gray-100 transition-colors"
              onClick={onClose}
            >
              I'll do this later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyCatalogModal;